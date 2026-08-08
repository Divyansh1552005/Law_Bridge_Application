import UserModel from "../models/userModel.js";
import lawyerModel from "../models/lawyerModel.js";
import dotenv from "dotenv/config";
import appointmentModel from "../models/appointmentModel.js";
import { verifyPassword, hashPasswordWithSalt } from "../utils/hash.js";
import {
  addLawyerByAdminSchema,
  adminLoginSchema,
  changeAvailabilitySchema,
  cancelAppointmentByAdminSchema,
} from "../validations/adminValidation.js";
import {
  createToken,
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";
import { refreshCookieOptions } from "../utils/cookies.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { signUploadParams } from "../config/cloudinarySign.js";

// Signed Cloudinary upload params for the new lawyer's profile picture
// (lawyer doesn't exist yet, so the folder/public_id use a random id, not a lawyerId)
export const getAdminLawyerUploadSignature = async (req, res) => {
  try {
    const signedParams = signUploadParams({
      folder: "lawbridge/profile-images/lawyer-new",
      public_id: `avatar-${nanoid(12)}`,
      allowed_formats: "jpg,png",
    });

    return res
      .status(200)
      .json({ success: true, ...signedParams, resourceType: "image" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const addlawyer = async (req, res) => {
  try {
    // Parse address if it's a string
    if (req.body.address && typeof req.body.address === "string") {
      try {
        req.body.address = JSON.parse(req.body.address);
      } catch (error) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid address format. Address must be a valid JSON object",
        });
      }
    }

    // validate request body
    const validatedData = await addLawyerByAdminSchema.parseAsync(req.body);
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      imageUrl,
    } = validatedData;

    // check if lawyer with the same email already exists
    const existingLawyer = await lawyerModel.findOne({
      email: validatedData.email,
    });
    if (existingLawyer) {
      return res
        .status(400)
        .json({ message: "Lawyer with this email already exists" });
    }

    // hashing password
    const { salt, password: hashedPassword } =
      await hashPasswordWithSalt(password);

    // create new lawyer
    const newLawyer = new lawyerModel({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: {
        Location: address.Location || "",
        City: address.City || "",
        State: address.State || "",
      },
      date: Date.now(),
    });

    // save lawyer to database
    await newLawyer.save();
    res
      .status(201)
      .json({ success: true, message: "Lawyer added successfully" });
  } catch (error) {
    // console.error("Error adding lawyer:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const validationResult = adminLoginSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { email, password } = validationResult.data;

    // check against env credentials
    if (
      email !== process.env.ADMIN_EMAIL ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // admin JWT payload
    const adminPayload = {
      id: email,
      role: "admin",
    };

    // access token (short lived)
    const accessToken = generateAccessToken(adminPayload);

    // refresh token (long lived)
    const refreshToken = generateRefreshToken(adminPayload);

    // set refresh token cookie
    res.cookie("adminRefreshToken", refreshToken, refreshCookieOptions);

    // admin profile data
    const adminProfile = {
      id: email,
      email: email,
      role: "admin",
      name: "Admin",
    };

    return res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      accessToken,
      admin: adminProfile,
    });
  } catch (error) {
    // console.error("Error during admin login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllLawyers = async (req, res) => {
  try {
    // Explicit allowlist — ensures refreshToken, date, and any future
    // internal fields are never accidentally sent to the admin frontend.
    const lawyers = await lawyerModel
      .find()
      .select(
        "_id name email image speciality degree experience about available fees address slots_booked",
      );
    res.status(200).json({ success: true, lawyers });
  } catch (error) {
    // console.error("Error fetching lawyers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin function to change lawyer availability
export const changeAvailability = async (req, res) => {
  try {
    const validationResult = changeAvailabilitySchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { lawyerId } = validationResult.data;

    const lawyer = await lawyerModel.findById(lawyerId);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    lawyer.available = !lawyer.available;
    await lawyer.save();

    res.status(200).json({
      success: true,
      message: `Lawyer is now ${lawyer.available ? "available" : "unavailable"}`,
    });
  } catch (error) {
    // console.error("Error changing availability:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    // archived (old cancelled/completed) appointments hidden from the default view
    const query = { archived: { $ne: true } };
    const { status, lawyer, sort } = req.query;

    if (status) {
      if (status === "cancelled") {
        query.cancelled = { $nin: ["Not Cancelled", false, null] };
      } else if (status === "completed") {
        query.isCompleted = true;
      } else if (status === "upcoming") {
        query.isCompleted = false;
        query.cancelled = { $in: ["Not Cancelled", false, null] };
      }
    }

    if (lawyer && lawyer !== "all") {
      query["lawyerData.name"] = lawyer;
    }

    const sortOrder = sort === "asc" ? 1 : -1;

    const [total, raw] = await Promise.all([
      appointmentModel.countDocuments(query),
      appointmentModel
        .find(query)
        .select(
          "slotDate slotTime amount payment isCompleted cancelled createdAt " +
            "userId lawyerId userData lawyerData videoCall",
        )
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const appointments = raw.map((appt) => {
      const ud = appt.userData || {};
      const ld = appt.lawyerData || {};

      return {
        id: appt._id,
        slotDate: appt.slotDate,
        slotTime: appt.slotTime,
        amount: appt.amount,
        payment: appt.payment,
        isCompleted: appt.isCompleted,
        cancelled: appt.cancelled,
        createdAt: appt.createdAt,

        videoCall: appt.videoCall
          ? {
              status: appt.videoCall.status ?? "not_started",
              duration: appt.videoCall.duration ?? 0,
              startedAt: appt.videoCall.startedAt ?? null,
              endedAt: appt.videoCall.endedAt ?? null,
            }
          : null,

        user: {
          id: appt.userId,
          name: ud.name ?? null,
          image: ud.image && ud.image.startsWith("http") ? ud.image : null,
        },

        lawyer: {
          id: appt.lawyerId,
          name: ld.name ?? null,
          speciality: ld.speciality ?? null,
          image: ld.image && ld.image.startsWith("http") ? ld.image : null,
        },
      };
    });

    return res.status(200).json({
      success: true,
      appointments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    // console.error("Error fetching appointments:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// api to cancel any appointment by admin

export const cancelAppointmentByAdmin = async (req, res) => {
  try {
    const validationResult = cancelAppointmentByAdminSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { appointmentId } = validationResult.data;

    const appointment = await appointmentModel.findById(appointmentId);

    // check if appointment exists
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // check if appointment is already cancelled
    if (appointment.cancelled === "Cancelled by User") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled by User",
      });
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        cancelled: "Cancelled by Admin",
      },
      { new: true },
    );

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully by Admin",
    });
  } catch (error) {
    // console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminDashboard = async (req, res) => {
  try {
    const [lawyersCount, usersCount, allAppointments, latestRaw] =
      await Promise.all([
        lawyerModel.countDocuments(),
        UserModel.countDocuments(),
        appointmentModel
          .find()
          .select("amount payment isCompleted cancelled createdAt lawyerData")
          .lean(),
        appointmentModel
          .find()
          .select(
            "slotDate slotTime amount payment isCompleted cancelled createdAt userId lawyerId userData lawyerData videoCall",
          )
          .sort({ createdAt: -1 })
          .limit(5)
          .lean(),
      ]);

    // Status breakdown
    let totalRevenue = 0;
    let completed = 0;
    let cancelled = 0;
    let pending = 0;
    const specialityMap = {};

    // Last 7 days earnings map
    const earningsMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      });
      earningsMap[key] = 0;
    }

    // Last 12 months earnings map
    const monthlyEarningsMap = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleDateString("en-IN", {
        month: "short",
        year: "2-digit",
      });
      monthlyEarningsMap[key] = 0;
    }

    for (const appt of allAppointments) {
      // Revenue
      if (appt.isCompleted && appt.payment) {
        totalRevenue += appt.amount || 0;

        const apptDate = new Date(appt.createdAt);
        const dayKey = apptDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
        if (earningsMap.hasOwnProperty(dayKey)) {
          earningsMap[dayKey] += appt.amount || 0;
        }

        const monthKey = apptDate.toLocaleDateString("en-IN", {
          month: "short",
          year: "2-digit",
        });
        if (monthlyEarningsMap.hasOwnProperty(monthKey)) {
          monthlyEarningsMap[monthKey] += appt.amount || 0;
        }
      }

      // Status breakdown
      if (appt.cancelled && appt.cancelled !== "Not Cancelled") {
        cancelled++;
      } else if (appt.isCompleted) {
        completed++;
      } else {
        pending++;
      }

      // Speciality breakdown
      const speciality = appt.lawyerData?.speciality || "Other";
      specialityMap[speciality] = (specialityMap[speciality] || 0) + 1;
    }

    // Shape speciality data for chart
    const specialityBreakdown = Object.entries(specialityMap).map(
      ([name, count]) => ({ name, count }),
    );

    const earningsTrend = Object.entries(earningsMap).map(([date, amount]) => ({
      date,
      amount,
    }));

    const monthlyEarningsTrend = Object.entries(monthlyEarningsMap).map(
      ([date, amount]) => ({
        date,
        amount,
      }),
    );

    // Shape latest appointments
    const latestAppointments = latestRaw.map((appt) => {
      const ud = appt.userData || {};
      const ld = appt.lawyerData || {};
      return {
        id: appt._id,
        slotDate: appt.slotDate,
        slotTime: appt.slotTime,
        amount: appt.amount,
        payment: appt.payment,
        isCompleted: appt.isCompleted,
        cancelled: appt.cancelled,
        createdAt: appt.createdAt,
        videoCall: appt.videoCall
          ? {
              status: appt.videoCall.status ?? "not_started",
              duration: appt.videoCall.duration ?? 0,
              startedAt: appt.videoCall.startedAt ?? null,
              endedAt: appt.videoCall.endedAt ?? null,
            }
          : null,
        user: {
          id: appt.userId,
          name: ud.name ?? null,
          image: ud.image && ud.image.startsWith("http") ? ud.image : null,
        },
        lawyer: {
          id: appt.lawyerId,
          name: ld.name ?? null,
          speciality: ld.speciality ?? null,
          image: ld.image && ld.image.startsWith("http") ? ld.image : null,
        },
      };
    });

    return res.status(200).json({
      success: true,
      dashData: {
        lawyers: lawyersCount,
        appointments: allAppointments.length,
        patients: usersCount,
        totalRevenue,
        statusBreakdown: { completed, cancelled, pending },
        specialityBreakdown,
        earningsTrend,
        monthlyEarningsTrend,
        latestAppointments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin refresh token endpoint
export const refreshAdminAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.adminRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Admin refresh token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Admin refresh token expired or invalid",
      });
    }

    // Verify it's an admin token
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Invalid admin token",
      });
    }

    // minimal payload
    const payload = {
      id: decoded.id,
      role: "admin",
    };

    const newAccessToken = generateAccessToken(payload);

    // Refresh token rotation
    const newRefreshToken = generateRefreshToken(payload);
    res.cookie("adminRefreshToken", newRefreshToken, refreshCookieOptions);

    // admin profile data
    const adminProfile = {
      id: decoded.id,
      email: decoded.id,
      role: "admin",
      name: "Admin",
    };

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      admin: adminProfile,
    });
  } catch (error) {
    // console.error("Admin refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not refresh admin access token",
    });
  }
};

// Admin logout endpoint
export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("adminRefreshToken", {
      ...refreshCookieOptions,
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
