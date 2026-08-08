import lawyerModel from "../models/lawyerModel.js";
import appointmentModel from "../models/appointmentModel.js";
import {
  lawyerLoginSchema,
  updatePatchRequestBodySchemaForLawyer,
  lawyerAppointmentSchema,
} from "../validations/lawyerValidation.js";
import { verifyPassword, hashToken } from "../utils/hash.js";
import mongoose from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { refreshCookieOptions } from "../utils/cookies.js";
import jwt from "jsonwebtoken";
import { signUploadParams } from "../config/cloudinarySign.js";

// Signed Cloudinary upload params for the profile-picture direct upload
export const getLawyerUploadSignature = async (req, res) => {
  try {
    const lawyerId = req.lawyer.id;
    const signedParams = signUploadParams({
      folder: `lawbridge/profile-images/lawyer/${lawyerId}`,
      public_id: `avatar-${Date.now()}`,
      allowed_formats: "jpg,png",
    });

    return res
      .status(200)
      .json({ success: true, ...signedParams, resourceType: "image" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const changeAvailability = async (req, res) => {
  try {
    const lawyerId = req.lawyer.id;

    const lawyer = await lawyerModel.findById(lawyerId);

    if (!lawyer) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });
    }

    lawyer.available = !lawyer.available;

    await lawyer.save();

    res.status(200).json({
      success: true,
      message: `Lawyer is now ${lawyer.available ? "available" : "unavailable"}`,
    });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to get lawyer list for frontend

export const getLawyerList = async (req, res) => {
  try {
    // TODO:
    // - Add pagination (page & limit via query params)
    // - Filter only available lawyers if required by frontend

    // Explicitly allowlist fields instead of blacklisting password.
    // This ensures internal fields (refreshToken, date) are never
    // accidentally sent to unauthenticated frontend clients.
    // slots_booked is intentionally included — Appointment.jsx reads it
    // to check slot availability client-side.
    const lawyers = await lawyerModel
      .find({})
      .select(
        "_id name email image speciality degree experience about available fees address slots_booked",
      );

    res.status(200).json({ success: true, lawyers });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// api to login lawyer
export const lawyerLogin = async (req, res) => {
  try {
    const validationResult = lawyerLoginSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { email, password } = validationResult.data;

    const lawyer = await lawyerModel.findOne({ email });
    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    const isPasswordValid = await verifyPassword(password, lawyer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // access token (short lived)
    const accessToken = generateAccessToken({
      id: lawyer._id.toString(),
    });

    // refresh token (long lived)
    const refreshToken = generateRefreshToken({
      id: lawyer._id.toString(),
    });

    // store the hashed refresh token in DB
    lawyer.refreshToken = hashToken(refreshToken);
    await lawyer.save({ validateBeforeSave: false });

    // set refresh token cookie
    res.cookie("lawyerRefreshToken", refreshToken, refreshCookieOptions);

    // lawyer profile data (without sensitive info)
    const lawyerProfile = {
      _id: lawyer._id,
      name: lawyer.name,
      email: lawyer.email,
      image: lawyer.image,
      speciality: lawyer.speciality,
      degree: lawyer.degree,
      experience: lawyer.experience,
      about: lawyer.about,
      fees: lawyer.fees,
      address: lawyer.address,
      available: lawyer.available,
    };

    return res.status(200).json({
      success: true,
      message: "Lawyer logged in successfully",
      accessToken,
      lawyer: lawyerProfile,
    });
  } catch (error) {
    // console.error("Error during lawyer login:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// api to get lawyer appointments
export const getLawyerAppointments = async (req, res) => {
  try {
    const lawyerId = req.lawyer.id;

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const query = { lawyerId };
    const { status, sort } = req.query;

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

    // Manually shape — never return raw doc or embedded snapshots directly
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

        // Always return consistent videoCall structure
        videoCall: {
          status: appt.videoCall?.status ?? "not_started",
          duration: appt.videoCall?.duration ?? 0,
          startedAt: appt.videoCall?.startedAt ?? null,
          endedAt: appt.videoCall?.endedAt ?? null,
        },

        // Safe user snapshot — name + URL image only
        user: {
          id: appt.userId,
          name: ud.name ?? null,
          image: ud.image && ud.image.startsWith("http") ? ud.image : null,
        },

        // Safe lawyer snapshot — no password, refreshToken, slots_booked etc.
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
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// api to cancel appointment by lawyer
export const cancelAppointmentByLawyer = async (req, res) => {
  try {
    const validationResult = lawyerAppointmentSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { appointmentId } = validationResult.data;
    const lawyerId = req.lawyer.id;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.lawyerId.toString() !== lawyerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    if (appointment.cancelled === "Cancelled by User") {
      return res.status(400).json({
        success: false,
        message: "Appointment is already cancelled by User",
      });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: "Cancelled by Lawyer",
    });

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully by Lawyer",
    });
  } catch (error) {
    // console.error("Error cancelling appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// api to mark appointment as completed by lawyer
export const appointmentCompletedByLawyer = async (req, res) => {
  try {
    const validationResult = lawyerAppointmentSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { appointmentId } = validationResult.data;
    const lawyerId = req.lawyer.id;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (appointment.lawyerId.toString() !== lawyerId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    if (appointment.isCompleted) {
      return res.status(400).json({
        success: false,
        message: "Appointment already completed",
      });
    }

    await appointmentModel.findByIdAndUpdate(
      appointmentId,
      { isCompleted: true },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Appointment completed successfully",
    });
  } catch (error) {
    // console.error("Error completing appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// api to get lawyer profile
export const getLawyerProfile = async (req, res) => {
  try {
    const lawyerId = req.lawyer.id;

    // if(!lawyerId){
    //     return res.status(400).json({ success: false, message: "Lawyer ID is required" })
    // }

    const lawyer = await lawyerModel.findById(lawyerId).select("-password");

    if (!lawyer) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });
    }

    res.status(200).json({ success: true, profileData: lawyer });
  } catch (error) {
    // console.log(error)
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to update lawyer profile
export const updateLawyerProfile = async (req, res) => {
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

    // Parse available if it's a string
    if (req.body.available && typeof req.body.available === "string") {
      req.body.available = req.body.available === "true";
    }

    // Parse fees if it's a string
    if (req.body.fees && typeof req.body.fees === "string") {
      const feesNumber = Number(req.body.fees);
      if (isNaN(feesNumber)) {
        return res.status(400).json({
          success: false,
          message: "Fees must be a valid number",
        });
      }
      req.body.fees = feesNumber;
    }

    // Validate body (WITHOUT lawyerId)
    const validationResult =
      await updatePatchRequestBodySchemaForLawyer.safeParseAsync(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { fees, address, available, about } = validationResult.data;

    // lawyerId ONLY from auth middleware
    const lawyerId = req.lawyer.id;

    const updates = {};
    if (fees !== undefined) updates.fees = fees;
    if (address !== undefined) updates.address = address;
    if (available !== undefined) updates.available = available;
    if (about !== undefined) updates.about = about;

    // img handling — client ne already Cloudinary pe seedha upload kar diya (presigned flow)
    if (req.body.imageUrl) {
      updates.image = req.body.imageUrl;
    }

    const updatedLawyer = await lawyerModel.findByIdAndUpdate(
      lawyerId,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedLawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      lawyer: updatedLawyer,
    });
  } catch (error) {
    // console.error("Error in updateLawyerProfile:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// api to get data for lawyer dashboard

export const lawyerDashboard = async (req, res) => {
  try {
    const lawyerId = req.lawyer.id;

    const [allAppointments, latestRaw] = await Promise.all([
      appointmentModel
        .find({ lawyerId })
        .select("isCompleted payment amount cancelled userId createdAt")
        .lean(),
      appointmentModel
        .find({ lawyerId })
        .select(
          "slotDate slotTime amount payment isCompleted cancelled createdAt userId lawyerId userData lawyerData videoCall",
        )
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

    let totalEarnings = 0;
    let completed = 0;
    let cancelled = 0;
    let pending = 0;
    const uniquePatientIds = new Set();

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
      if (appt.isCompleted && appt.payment) {
        totalEarnings += appt.amount || 0;

        // Last 7 days earnings
        const apptDate = new Date(appt.createdAt);
        const key = apptDate.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
        if (earningsMap.hasOwnProperty(key)) {
          earningsMap[key] += appt.amount || 0;
        }

        // Monthly earnings
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

      if (appt.userId) {
        uniquePatientIds.add(appt.userId.toString());
      }
    }

    // Shape for chart
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

    // Completion rate
    const completionRate =
      allAppointments.length > 0
        ? Math.round((completed / allAppointments.length) * 100)
        : 0;

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
        videoCall: {
          status: appt.videoCall?.status ?? "not_started",
          duration: appt.videoCall?.duration ?? 0,
          startedAt: appt.videoCall?.startedAt ?? null,
          endedAt: appt.videoCall?.endedAt ?? null,
        },
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
        earnings: totalEarnings,
        appointments: allAppointments.length,
        patients: uniquePatientIds.size,
        completionRate,
        statusBreakdown: { completed, cancelled, pending },
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
// Lawyer refresh token endpoint
export const refreshLawyerAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.lawyerRefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Lawyer refresh token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Lawyer refresh token expired or invalid",
      });
    }

    // minimal payload
    const payload = {
      id: decoded.id,
    };

    const newAccessToken = generateAccessToken(payload);

    // Fetch lawyer data to send with the response
    const lawyer = await lawyerModel.findById(decoded.id).select("-password");

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found",
      });
    }

    // Verify the incoming token matches the hashed one stored in DB
    if (
      !lawyer.refreshToken ||
      hashToken(refreshToken) !== lawyer.refreshToken
    ) {
      res.clearCookie("lawyerRefreshToken", { ...refreshCookieOptions });
      return res.status(401).json({
        success: false,
        message: "Refresh token revoked or invalid",
      });
    }

    // Refresh token rotation
    const newRefreshToken = generateRefreshToken({ id: decoded.id });
    lawyer.refreshToken = hashToken(newRefreshToken);
    await lawyer.save({ validateBeforeSave: false });

    // Set new refresh token cookie
    res.cookie("lawyerRefreshToken", newRefreshToken, refreshCookieOptions);

    // lawyer profile data
    const lawyerProfile = {
      _id: lawyer._id,
      name: lawyer.name,
      email: lawyer.email,
      image: lawyer.image,
      speciality: lawyer.speciality,
      degree: lawyer.degree,
      experience: lawyer.experience,
      about: lawyer.about,
      fees: lawyer.fees,
      address: lawyer.address,
      available: lawyer.available,
    };

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      lawyer: lawyerProfile,
    });
  } catch (error) {
    // console.error("Lawyer refresh token error:", error);
    return res.status(500).json({
      success: false,
      message: "Could not refresh lawyer access token",
    });
  }
};

// Lawyer logout endpoint
export const logoutLawyer = async (req, res) => {
  try {
    const refreshToken = req.cookies?.lawyerRefreshToken;

    // Invalidate the refresh token in the DB
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );
        await lawyerModel.findByIdAndUpdate(decoded.id, { refreshToken: null });
      } catch (_) {
        // Token already expired or invalid
      }
    }

    res.clearCookie("lawyerRefreshToken", {
      ...refreshCookieOptions,
    });

    return res.status(200).json({
      success: true,
      message: "Lawyer logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};
