import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
  updatePatchRequestBodySchemaforUser,
  resetPasswordPostRequestBodySchema,
  verify2FASchema,
  bookAppointmentSchema,
  emailOnlySchema,
  verifyEmailSchema,
  cancelAppointmentSchema,
  verifyRazorpaySchema,
  disable2FASchema,
  verifyDeleteAccountOtpSchema,
  createPaymentOrderSchema,
  verifyPaymentAndCreateAppointmentSchema,
} from "../validations/userValidation.js";
import redis from "../config/redis.js";
import userModel from "../models/userModel.js";
import lawyerModel from "../models/lawyerModel.js";
import appointmentModel from "../models/appointmentModel.js";
import documentModel from "../models/documentModel.js";
import crypto from "crypto";
import { generateCryptoToken } from "../utils/cryptoToken.js";
import { sendEmail } from "../services/mailService.js";
import {
  verifyEmailTemplate,
  resetPasswordTemplate,
  deleteAccountOtpTemplate,
  magicLinkTemplate,
} from "../services/emailTemplates.js";
import {
  hashPasswordWithSalt,
  verifyPassword,
  hashToken,
} from "../utils/hash.js";
import axios from "axios";
import { encrypt, decrypt } from "../utils/encryption.js";
import { generateOTP } from "../utils/generateOTP.js";
import { v2 as cloudinary } from "cloudinary";
import { signUploadParams } from "../config/cloudinarySign.js";
import razorpay from "razorpay";
import conversationModel from "../models/conversationModel.js";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import { refreshCookieOptions } from "../utils/cookies.js";
import jwt from "jsonwebtoken";
import QRCode from "qrcode";
import { TOTP, Secret } from "otpauth";

// creating user controller for signup

export const signupUser = async (req, res) => {
  try {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(
      req.body,
    );

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { name, email, password } = validationResult.data;

    // check if user already exists with the same email
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists with the same email",
        success: false,
      });
    }

    // now hashing the password
    const { password: hashedPassword } = await hashPasswordWithSalt(password);

    // generate crypto token for verification
    const { rawToken, hashedToken } = generateCryptoToken();

    // now creating new user
    const new_user = new userModel({
      name,
      email,
      password: hashedPassword,
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: Date.now() + 24 * 60 * 60 * 1000,
    });

    await new_user.save();

    // send verification email
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: verifyEmailTemplate(verifyLink),
    });

    // ab token create karna hai for that user
    // const token = await createToken({ id: new_user._id.toString() });
    // return res.status(201).json({
    //   message: "User created successfully",
    //   success: true,
    //   token,
    // });

    // token will be created only in login and emailVerified == true par
    return res.status(201).json({
      message: "Signup successful. Please verify your email.",
      success: true,
    });
  } catch (error) {
    // console.error("Error in signupUser:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      success: false,
    });
  }
};

// api to login user

const createTOTP = (secret, label = "") => {
  return new TOTP({
    issuer: "LawBridge",
    label,
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret: secret, // base32 string directly
  });
};

export const setup2FA = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA already enabled",
      });
    }

    // Generate secret (base32)
    const secret = new Secret({ size: 20 }); // 160-bit
    const base32Secret = secret.base32;

    // Create TOTP instance using shared factory
    const totp = createTOTP(base32Secret, user.email);

    // Generate otpauth URI
    const otpauthUrl = totp.toString();

    // Save secret in DB in encrypted form
    user.twoFactorSecret = encrypt(base32Secret);
    await user.save();

    // Generate QR
    const qrCode = await QRCode.toDataURL(otpauthUrl);

    return res.status(200).json({
      success: true,
      qrCode,
      manualKey: base32Secret, // fallback manual entry
    });
  } catch (error) {
    console.error("Error in setup2FA:", error);

    return res.status(500).json({
      success: false,
      message: "Could not setup 2FA",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    // console.log("Login request received:", { email: req.body.email });

    // validation of request
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(
      req.body,
    );

    if (validationResult.error) {
      // console.error("Login validation error:", validationResult.error);
      return res.status(400).json({
        success: false,
        error: validationResult.error.format(),
      });
    }

    const { email, password, twoFactorCode } = validationResult.data;

    // checking if user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist with the given email",
      });
    }

    // BLOCK: Google users cannot use password login
    if (existingUser.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message:
          "This account was created using Google. Please login with Google.",
      });
    }

    // email verified pe ae kaam chlega
    if (!existingUser.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
        action: "RESEND VERIFICATION EMAIL",
      });
    }

    // verifying password
    const isPasswordValid = await verifyPassword(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // 2FA check: if enabled, require and verify TOTP code
    if (existingUser.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          success: true,
          requires2FA: true,
          message: "2FA code required",
        });
      }

      // Verify 2FA code using otpauth
      // brute-force protection: max 5 failed attempts per user per 15 minutes
      const bruteKey = `2fa:login:${existingUser._id}`;

      // check lockout BEFORE doing anything — so even a correct code is blocked
      // until the window expires
      const currentAttempts = await redis.get(bruteKey);
      if (currentAttempts !== null && parseInt(currentAttempts, 10) >= 5) {
        const ttl = await redis.ttl(bruteKey);
        return res.status(429).json({
          success: false,
          message: `Too many 2FA attempts. Try again in ${Math.ceil(ttl / 60)} minutes.`,
        });
      }

      const totp = createTOTP(decrypt(existingUser.twoFactorSecret));
      const delta = totp.validate({ token: twoFactorCode, window: 1 });

      if (delta === null) {
        // increment counter only on failure
        const attempts = await redis.incr(bruteKey);
        if (attempts === 1) {
          await redis.expire(bruteKey, 15 * 60);
        }
        return res.status(401).json({
          success: false,
          message: "Invalid or expired 2FA code",
        });
      }

      // clear brute-force counter on success
      await redis.del(bruteKey);
    }

    // generating the access token and refresh token
    const accessToken = generateAccessToken({
      id: existingUser._id,
    });

    const refreshToken = generateRefreshToken({
      id: existingUser._id,
    });

    // store the hashed refresh token in DB
    existingUser.refreshToken = hashToken(refreshToken);
    await existingUser.save({ validateBeforeSave: false });

    // sending refresh token as cookie
    return res
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        accessToken,
        user: {
          _id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image,
          phone: existingUser.phone,
          address: existingUser.address,
          gender: existingUser.gender,
          dob: existingUser.dob,
          emailVerified: existingUser.emailVerified,
          twoFactorEnabled: existingUser.twoFactorEnabled,
          authProvider: existingUser.authProvider,
        },
      });
  } catch (error) {
    // console.error("Error in loginUser:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// verification of email
export const verifyEmail = async (req, res) => {
  try {
    // becoz zod changed it to obj
    const token = String(req.params.token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await userModel.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpiry = undefined;

    await user.save();

    res.status(201).json({ message: "Email Verified Successfully!!!" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// resend verification email
export const resendVerificationEmail = async (req, res) => {
  try {
    const validationResult = emailOnlySchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { email } = validationResult.data;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        message: "Email is already verified",
        success: false,
      });
    }

    // prevent spamming of resend of verification mail by checking this
    if (
      user.emailVerificationExpiry &&
      user.emailVerificationExpiry > Date.now()
    ) {
      return res.status(429).json({
        success: false,
        message:
          "Verification email already sent. Please check your inbox or try again later.",
      });
    }

    const { rawToken, hashedToken } = generateCryptoToken();

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpiry = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyLink = `${process.env.FRONTEND_URL}/verify-email/${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: verifyEmailTemplate(verifyLink),
    });

    res.status(200).json({
      message: "Verification email resent",
      success: true,
    });
  } catch (error) {
    // console.error("Resend verification error:", error);
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
// get user data for profile page
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Reset credits if a new day has started (same logic as checkCredit middleware)
    const today = new Date().toDateString();
    const lastReset = new Date(user.credits?.lastReset).toDateString();
    if (today !== lastReset) {
      user.credits.remaining = user.credits.dailyLimit;
      user.credits.lastReset = new Date();
      await user.save();
      // Invalidate Redis so checkCredit re-seeds the fresh value on next chat request
      await redis.del(`credits:${userId}`);
    }

    // Explicit safe response object
    const safeUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      phone: user.phone,
      address: user.address,
      gender: user.gender,
      dob: user.dob,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      authProvider: user.authProvider,
      credits: {
        dailyLimit: user.credits?.dailyLimit,
        remaining: user.credits?.remaining,
      },
    };

    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// forgot password ie we will send reset link to the user if they exist
export const forgotPassword = async (req, res) => {
  try {
    const validationResult = emailOnlySchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { email } = validationResult.data;

    const user = await userModel.findOne({ email });
    // Prevent email enumeration ie hacker baar baar mail behj k pata laga skta hai konsa acc hai ya nahi
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with this email exists, a reset link has been sent.",
      });
    }

    // Google users sign in via OAuth and have no password to reset
    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message:
          "This account uses Google Sign-In. Password reset is not available.",
      });
    }

    // Prevent spamming reset emails
    if (user.resetPasswordExpiry && user.resetPasswordExpiry > Date.now()) {
      return res.status(429).json({
        success: false,
        message:
          "A password reset email has already been sent. Please check your inbox.",
      });
    }

    const { rawToken, hashedToken } = generateCryptoToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: resetPasswordTemplate(resetLink),
    });

    res.status(200).json({ message: "Reset password email sent" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// now we will have to reset the password from the link sent by forgot password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;

    // validate the request
    const validationResult =
      await resetPasswordPostRequestBodySchema.safeParseAsync(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.format(),
      });
    }

    const { password } = validationResult.data;

    // hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // find if request is valid
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // hash the new password
    const { password: hashedPassword } = await hashPasswordWithSalt(password);

    user.password = hashedPassword;

    // clear the reset password thangs
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    // invalidate all existing sessions
    user.refreshToken = undefined;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login again.",
    });
  } catch (error) {
    // console.error("Reset password error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// Signed Cloudinary upload params for the profile-picture direct upload
export const getUserUploadSignature = async (req, res) => {
  try {
    const userId = req.user.id;
    const signedParams = signUploadParams({
      folder: `lawbridge/profile-images/user/${userId}`,
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

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const validationResult =
      await updatePatchRequestBodySchemaforUser.safeParseAsync(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.format(),
        message: "Validation failed",
      });
    }

    const { name, phone, address, dob, gender } = validationResult.data;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (phone !== undefined && phone !== "") updates.phone = phone;
    if (dob !== undefined && dob !== "" && dob !== "Not Selected")
      updates.dob = dob;
    if (gender !== undefined) updates.gender = gender;

    // handling address
    if (address !== undefined) {
      if (typeof address === "string") {
        try {
          updates.address = JSON.parse(address);
        } catch {
          return res.status(400).json({
            success: false,
            message:
              "Invalid address format. Address must be a valid JSON object",
          });
        }
      } else {
        updates.address = address;
      }
    }

    // img handling — client ne already Cloudinary pe seedha upload kar diya (presigned flow)
    if (req.body.imageUrl) {
      updates.image = req.body.imageUrl;
    }

    await userModel.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    // console.error("Update user profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/*
// UNUSED IN NEW FLOW - Replaced by createPaymentOrder and verifyPaymentAndCreateAppointment
export const bookAppointment = async (req, res) => {
  try {
    const validationResult = bookAppointmentSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const userId = req.user.id;
    const { lawyerId, slotDate, slotTime } = validationResult.data;

    if (!slotTime) {
      return res.status(400).json({
        success: false,
        message: "Please select slot time",
      });
    }

    if (!slotDate) {
      return res.status(400).json({
        success: false,
        message: "Please select appointment date",
      });
    }

    const lawyerData = await lawyerModel.findById(lawyerId).select("-password");

    if (!lawyerData) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });
    }

    if (!lawyerData.available) {
      // if lawyer is not available
      return res
        .status(400)
        .json({ success: false, message: "Lawyer Not Available" });
    }

    // get booked slots
    let slots_booked = lawyerData.slots_booked;

    // checking for slot availablity
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res
          .status(400)
          .json({ success: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      // if no slots booked on that date yet
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    // Snapshot only the fields needed for appointment display — never store
    // sensitive internal fields (refreshToken, twoFactorSecret, tokens, credits)
    // permanently in the appointment document.
    const rawUser = await userModel
      .findById(userId)
      .select("_id name image phone gender dob address");
    const userData = rawUser
      ? {
          _id: rawUser._id,
          name: rawUser.name,
          image:
            rawUser.image && rawUser.image.startsWith("http")
              ? rawUser.image
              : null,
          phone: rawUser.phone,
          gender: rawUser.gender,
          dob: rawUser.dob,
          address: rawUser.address,
        }
      : {};

    // remove booked slots from lawyer data so frontend does not receive it so vo dikaaye hi na uss slot ko jo booked hai
    delete lawyerData.slots_booked;

    // Snapshot only safe lawyer fields into the appointment document
    const lawyerSnapshot = {
      _id: lawyerData._id,
      name: lawyerData.name,
      image:
        lawyerData.image && lawyerData.image.startsWith("http")
          ? lawyerData.image
          : null,
      speciality: lawyerData.speciality,
      degree: lawyerData.degree,
      experience: lawyerData.experience,
      fees: lawyerData.fees,
      address: lawyerData.address,
    };

    const appointmentData = {
      userId,
      lawyerId,
      userData,
      lawyerData: lawyerSnapshot,
      amount: lawyerData.fees,
      slotTime,
      slotDate,
      date: Date.now(), // when appointment was booked
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in lawyerData
    await lawyerModel.findByIdAndUpdate(lawyerId, { slots_booked });

    res.status(201).json({
      success: true,
      message: "Appointment Booked! Pay online to complete the booking!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
*/

// api to list all appointments of a user
// api to get user appointments for frontend my-appointments page
export const listAppointment = async (req, res) => {
  try {
    const userId = req.user.id;

    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 7, 50);
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const sortOrder = String(req.query.sortOrder || "desc").toLowerCase();

    const lawyerName =
      typeof req.query.lawyerName === "string"
        ? req.query.lawyerName.trim()
        : "";
    const fromDateParam =
      typeof req.query.fromDate === "string" ? req.query.fromDate.trim() : "";
    const toDateParam =
      typeof req.query.toDate === "string" ? req.query.toDate.trim() : "";
    const sortDirection = ["asc", "ascending"].includes(sortOrder) ? 1 : -1;
    const fromDate = fromDateParam
      ? new Date(`${fromDateParam}T00:00:00.000Z`)
      : null;
    const toDate = toDateParam
      ? new Date(`${toDateParam}T23:59:59.999Z`)
      : null;

    if (
      (fromDate && Number.isNaN(fromDate.getTime())) ||
      (toDate && Number.isNaN(toDate.getTime()))
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid date filter provided",
      });
    }

    if (fromDate && toDate && fromDate > toDate) {
      return res.status(400).json({
        success: false,
        message: "From date cannot be later than to date",
      });
    }

    const query = { userId };

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

    if (lawyerName) {
      query["lawyerData.name"] = { $regex: lawyerName, $options: "i" };
    }

    const pipeline = [
      { $match: query },
      {
        $addFields: {
          slotDateObj: {
            $let: {
              vars: { parts: { $split: ["$slotDate", "_"] } },
              in: {
                $dateFromParts: {
                  year: { $toInt: { $arrayElemAt: ["$$parts", 2] } },
                  month: { $toInt: { $arrayElemAt: ["$$parts", 1] } },
                  day: { $toInt: { $arrayElemAt: ["$$parts", 0] } },
                },
              },
            },
          },
        },
      },
    ];

    if (fromDate || toDate) {
      const rangeQuery = {};
      if (fromDate) rangeQuery.$gte = fromDate;
      if (toDate) rangeQuery.$lte = toDate;
      pipeline.push({ $match: { slotDateObj: rangeQuery } });
    }

    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        appointments: [
          { $sort: { slotDateObj: sortDirection, createdAt: sortDirection } },
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              slotDate: 1,
              slotTime: 1,
              amount: 1,
              payment: 1,
              isCompleted: 1,
              cancelled: 1,
              createdAt: 1,
              lawyerId: 1,
              lawyerData: 1,
              videoCall: 1,
            },
          },
        ],
      },
    });

    const [result] = await appointmentModel.aggregate(pipeline);
    const total = result?.metadata?.[0]?.total || 0;
    const appointments = result?.appointments || [];

    // Shape each appointment — expose only safe, required fields
    const shaped = appointments.map((appt) => {
      // lawyerData is an embedded snapshot stored at booking time
      // Use it directly — avoids an extra DB round-trip per appointment
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

        lawyer: {
          id: appt.lawyerId,
          name: ld.name ?? null,
          // Only include image if it is a URL — skip base64 strings
          image: ld.image && ld.image.startsWith("http") ? ld.image : null,
          speciality: ld.speciality ?? null,
          fees: ld.fees ?? null,
        },
      };
    });

    return res.status(200).json({
      success: true,
      appointments: shaped,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// api to cancel appointment from my-appointments page
export const cancelAppointment = async (req, res) => {
  try {
    const validationResult = cancelAppointmentSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const userId = req.user.id;
    const { appointmentId } = validationResult.data;

    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Authorization check
    if (appointmentData.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized action",
      });
    }

    // 🛑 If already cancelled
    if (appointmentData.cancelled === "Cancelled by User") {
      return res.status(400).json({
        success: false,
        message: "Appointment already cancelled",
      });
    }

    // cancel Appointment
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: "Cancelled by User",
    });

    // release lawyer slots
    const { lawyerId, slotDate, slotTime } = appointmentData;

    const lawyerData = await lawyerModel.findById(lawyerId);

    if (lawyerData && lawyerData.slots_booked?.[slotDate]) {
      lawyerData.slots_booked[slotDate] = lawyerData.slots_booked[
        slotDate
      ].filter((time) => time !== slotTime);

      await lawyerModel.findByIdAndUpdate(lawyerId, {
        slots_booked: lawyerData.slots_booked,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
    });
  } catch (error) {
    // console.error("Cancel appointment error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// api to make payment for appointment

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/*
// UNUSED IN NEW FLOW - Retained for legacy support
export const paymentRazorpay = async (req, res) => {
  try {
    const validationResult = cancelAppointmentSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { appointmentId } = validationResult.data;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (
      !appointmentData ||
      (appointmentData.cancelled &&
        appointmentData.cancelled !== "Not Cancelled")
    ) {
      return res.status(400).json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    // creating options for razorpay payment
    const options = {
      amount: appointmentData.amount * 100, // *100 to remove 2 decimal points
      currency: process.env.CURRENCY,
      receipt: appointmentId,
    };

    // creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// API to verify payment
export const verifyRazorpay = async (req, res) => {
  try {
    const validationResult = verifyRazorpaySchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      validationResult.data;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification fields",
      });
    }

    // Generate expected signature using Razorpay secret
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // Use constant-time comparison instead of normal string comparison.
    // Normal comparisons (=== / !==) stop when characters differ and may leak
    // timing information. crypto.timingSafeEqual ensures the comparison time
    // stays constant to prevent theoretical timing attacks on the HMAC signature.
    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Fetch order from Razorpay to confirm payment status
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    // Even if signature matches, we verify that Razorpay marks the order as "paid".
    // This prevents marking unpaid or incomplete payments as successful.
    if (orderInfo.status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const appointment = await appointmentModel.findById(orderInfo.receipt);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Idempotency protection:
    // If this endpoint is called multiple times (page refresh, retry, network issues),
    // we should not update the payment again. This ensures the operation is safe to repeat.
    if (appointment.payment === true) {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
      });
    }

    await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
      payment: true,
      razorpayPaymentId: razorpay_payment_id,
    });

    res.status(200).json({ success: true, message: "Payment Successful" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
*/
export const createPaymentOrder = async (req, res) => {
  try {
    const validationResult = createPaymentOrderSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { lawyerId, slotDate, slotTime } = validationResult.data;

    const lawyerData = await lawyerModel.findById(lawyerId);
    if (!lawyerData) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });
    }

    if (!lawyerData.available) {
      return res
        .status(400)
        .json({ success: false, message: "Lawyer Not Available" });
    }

    // checking for slot availablity
    let slots_booked = lawyerData.slots_booked;
    if (slots_booked[slotDate] && slots_booked[slotDate].includes(slotTime)) {
      return res
        .status(400)
        .json({ success: false, message: "Slot Not Available" });
    }

    // meeting booking restrictions : per day 2 meeting hi book kr skta hai user
    // and maximum 3 meetings in next 5 days (done so as to avoid ki ek banda hi sbhi slots book krle)
    const userId = req.user.id;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const windowEnd = new Date(today);
    windowEnd.setDate(today.getDate() + 4); // today included = 5 days total

    const parseSlotDate = (sd) => {
      const [d, m, y] = sd.split("_");
      return new Date(y, m - 1, d);
    };

    const existingAppointments = await appointmentModel.find({
      userId,
      cancelled: "Not Cancelled",
      isCompleted: false,
    });

    // Check: max 3 in next 5 days (rolling window)
    const inWindow = existingAppointments.filter((apt) => {
      const aptDate = parseSlotDate(apt.slotDate);
      return aptDate >= today && aptDate <= windowEnd;
    });

    if (inWindow.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "You can only have 3 appointments within the next 5 days",
      });
    }

    // Check: max 2 per day
    const onSameDay = existingAppointments.filter(
      (apt) => apt.slotDate === slotDate,
    );

    if (onSameDay.length >= 2) {
      return res.status(400).json({
        success: false,
        message: "You can only book 2 appointments per day",
      });
    }

    // Create options for razorpay payment
    const options = {
      amount: lawyerData.fees * 100, // *100 to remove 2 decimal points
      currency: process.env.CURRENCY,
      receipt: `receipt_${Date.now()}`,
    };

    // Creation of an order
    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const verifyPaymentAndCreateAppointment = async (req, res) => {
  try {
    const validationResult = verifyPaymentAndCreateAppointmentSchema.safeParse(
      req.body,
    );

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      lawyerId,
      slotDate,
      slotTime,
    } = validationResult.data;
    const userId = req.user.id;

    // Verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    if (
      expectedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid payment signature" });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (orderInfo.status !== "paid") {
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    }

    // Idempotency protection: Check if appointment already exists for this payment
    const existingAppointment = await appointmentModel.findOne({
      razorpayPaymentId: razorpay_payment_id,
    });
    if (existingAppointment) {
      return res.status(200).json({
        success: true,
        message: "Appointment Booked Successfully!",
      });
    }

    // restrictions checking
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const windowEnd = new Date(today);
    windowEnd.setDate(today.getDate() + 4);

    const parseSlotDate = (sd) => {
      const [d, m, y] = sd.split("_");
      return new Date(y, m - 1, d);
    };

    const existingUserAppointments = await appointmentModel.find({
      userId,
      cancelled: "Not Cancelled",
      isCompleted: false,
    });

    const inWindow = existingUserAppointments.filter((apt) => {
      const aptDate = parseSlotDate(apt.slotDate);
      return aptDate >= today && aptDate <= windowEnd;
    });

    if (inWindow.length >= 3) {
      return res.status(400).json({
        success: false,
        message: "You can only have 3 appointments within the next 5 days",
      });
    }

    const onSameDay = existingUserAppointments.filter(
      (apt) => apt.slotDate === slotDate,
    );

    if (onSameDay.length >= 2) {
      return res.status(400).json({
        success: false,
        message: "You can only book 2 appointments per day",
      });
    }

    const lawyerData = await lawyerModel.findById(lawyerId).select("-password");
    if (!lawyerData) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer not found" });
    }

    let slots_booked = lawyerData.slots_booked;
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res
          .status(400)
          .json({ success: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const rawUser = await userModel
      .findById(userId)
      .select("_id name image phone gender dob address");
    const userData = rawUser
      ? {
          _id: rawUser._id,
          name: rawUser.name,
          image:
            rawUser.image && rawUser.image.startsWith("http")
              ? rawUser.image
              : null,
          phone: rawUser.phone,
          gender: rawUser.gender,
          dob: rawUser.dob,
          address: rawUser.address,
        }
      : {};

    const lawyerSnapshot = {
      _id: lawyerData._id,
      name: lawyerData.name,
      image:
        lawyerData.image && lawyerData.image.startsWith("http")
          ? lawyerData.image
          : null,
      speciality: lawyerData.speciality,
      degree: lawyerData.degree,
      experience: lawyerData.experience,
      fees: lawyerData.fees,
      address: lawyerData.address,
    };

    const appointmentData = {
      userId,
      lawyerId,
      userData,
      lawyerData: lawyerSnapshot,
      amount: lawyerData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
      payment: true,
      razorpayPaymentId: razorpay_payment_id,
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await lawyerModel.findByIdAndUpdate(lawyerId, { slots_booked });

    res
      .status(201)
      .json({ success: true, message: "Appointment Booked Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// delete account routes

export const requestDeleteAccountOtp = async (req, res) => {
  try {
    // user identity ONLY from auth middleware
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent OTP spamming
    if (user.deleteOtpExpiresAt && user.deleteOtpExpiresAt > Date.now()) {
      return res.status(429).json({
        success: false,
        message:
          "An OTP has already been sent. Please check your email or try again later.",
      });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();

    // Hash OTP before storing
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.deleteOtp = hashedOtp;
    user.deleteOtpExpiresAt = Date.now() + 10 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    await sendEmail({
      to: user.email,
      subject: "Confirm Account Deletion",
      html: deleteAccountOtpTemplate(otp),
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    // console.error("Request delete account OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//now we need to verify that OTP
export const verifyDeleteAccountOtp = async (req, res) => {
  try {
    const validationResult = verifyDeleteAccountOtpSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    // user identity ONLY from auth middleware
    const userId = req.user.id;
    const { otp } = validationResult.data;

    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    const user = await userModel.findById(userId);

    if (!user || !user.deleteOtp) {
      return res.status(400).json({
        success: false,
        message: "No account deletion request found",
      });
    }

    if (user.deleteOtpExpiresAt < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    if (hashedOtp !== user.deleteOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const userDocs = await documentModel.find({ userId });

    if (userDocs.length > 0) {
      // Cloudinary cleanup
      await Promise.all(
        userDocs.map((doc) =>
          cloudinary.uploader
            .destroy(doc.cloudinaryPublicId, {
              resource_type: doc.fileType === "image" ? "image" : "raw",
              type: "authenticated",
            })
            .catch((err) => console.error("Cloudinary cleanup error:", err)),
        ),
      );

      // Pinecone cleanup — chatbot service se
      try {
        await axios.delete(
          `${process.env.RAG_CHATBOT_API_URL || "http://localhost:4000"}/delete-user-data`,
          {
            headers: {
              "Content-Type": "application/json",
              secure_key: process.env.RAG_SECRET_KEY,
            },
            data: {
              user_id: userId.toString(),
            },
          },
        );
      } catch (err) {
        console.error("Failed to clear vector DB data:", err.message);
      }

      await documentModel.deleteMany({ userId });
    }

    // delete user-related data first
    await appointmentModel.deleteMany({ userId });
    await conversationModel.deleteMany({ userId });

    // delete user account
    await userModel.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Verify delete account OTP error:", error);
    return res.status(500).json({
      success: false,
      message: "Account deletion failed",
    });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    // Invalidate the refresh token in the DB so it can't be reused
    // even if someone had captured it before logout
    if (refreshToken) {
      try {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );
        await userModel.findByIdAndUpdate(decoded.id, { refreshToken: null });
      } catch (_) {
        // Token already expired or invalid — no need to clear from DB,
        // just proceed with clearing the cookie
      }
    }

    res.clearCookie("refreshToken", {
      ...refreshCookieOptions,
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Refresh token missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Refresh token expired or invalid",
      });
    }

    // Fetch user — include refreshToken field so we can verify against the DB hash.
    // This is what makes the stored hash actually useful: a logged-out or
    // revoked token will fail here even if the JWT signature is still valid.
    const user = await userModel
      .findById(decoded.id)
      .select(
        "_id name email image phone address gender dob emailVerified twoFactorEnabled credits refreshToken authProvider",
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify the incoming token matches the hashed one stored in DB.
    // If the user has logged out (or their token was revoked), user.refreshToken
    // will be null and this check will correctly reject the request.
    if (!user.refreshToken || hashToken(refreshToken) !== user.refreshToken) {
      // Clear the stale cookie so the client doesn't keep retrying
      res.clearCookie("refreshToken", { ...refreshCookieOptions });
      return res.status(401).json({
        success: false,
        message: "Refresh token revoked or invalid",
      });
    }

    // minimal payload only
    const payload = {
      id: decoded.id,
      // role: decoded.role,
    };

    const newAccessToken = generateAccessToken(payload);

    // Refresh token rotation
    const newRefreshToken = generateRefreshToken({ id: decoded.id });
    user.refreshToken = hashToken(newRefreshToken);
    await user.save({ validateBeforeSave: false });

    // Set new refresh token cookie
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    return res.status(200).json({
      success: true,
      accessToken: newAccessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        phone: user.phone,
        address: user.address,
        gender: user.gender,
        dob: user.dob,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Could not refresh access token",
    });
  }
};

// 2FA

export const verify2FA = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const validationResult = verify2FASchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: validationResult.error.errors[0].message,
      });
    }

    const { code } = validationResult.data;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is already enabled",
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        success: false,
        message: "2FA setup not initiated",
      });
    }

    const totp = createTOTP(decrypt(user.twoFactorSecret));

    // otpauth returns delta (0 = valid, null = invalid)
    const delta = totp.validate({ token: code, window: 1 });

    if (delta === null) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired 2FA code",
      });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "2FA enabled successfully",
    });
  } catch (error) {
    // console.error("Error in verify2FA:", error);
    return res.status(500).json({
      success: false,
      message: "Could not verify 2FA",
    });
  }
};

export const disable2FA = async (req, res) => {
  try {
    const validationResult = disable2FASchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const userId = req.user.id;
    const { password, twoFactorCode } = validationResult.data;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is not enabled",
      });
    }

    if (!twoFactorCode) {
      return res.status(400).json({
        success: false,
        message: "2FA code is required",
      });
    }

    // Local users must also verify their password; Google users have none
    if (user.authProvider !== "google") {
      if (!password) {
        return res.status(400).json({
          success: false,
          message: "Password is required",
        });
      }
      const isPasswordValid = await verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid password",
        });
      }
    }

    const totp = createTOTP(decrypt(user.twoFactorSecret));
    const delta = totp.validate({ token: twoFactorCode, window: 1 });

    if (delta === null) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired 2FA code",
      });
    }

    // disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;

    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "2FA disabled successfully",
    });
  } catch (error) {
    // console.error("Error in disable2FA:", error);
    return res.status(500).json({
      success: false,
      message: "Could not disable 2FA",
    });
  }
};

// Magic Link for logging in existing user's

export const requestMagicLink = async (req, res) => {
  try {
    const validationResult = emailOnlySchema.safeParse(req.body);
    if (validationResult.error) {
      return res.status(400).json({
        success: false,
        error: validationResult.error.format(),
      });
    }

    const { email } = validationResult.data;

    const user = await userModel.findOne({ email });

    // prevent user enumeration — same response whether user exists or not
    if (!user || !user.emailVerified) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, a magic link has been sent.",
      });
    }

    // Google users should use Google login
    if (user.authProvider === "google") {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Please login with Google.",
      });
    }

    // Daily limit check — 2 magic links per day via Redis
    const countKey = `magic:count:${user._id}`;
    const currentCount = await redis.get(countKey);

    if (currentCount !== null && parseInt(currentCount, 10) >= 2) {
      return res.status(429).json({
        success: false,
        message:
          "You have reached the limit of 2 magic links per day. Please try again tomorrow.",
      });
    }

    // Generate token
    const { rawToken, hashedToken } = generateCryptoToken();

    // Store in Redis: hashed token → userId, 15 min TTL
    await redis.set(
      `magic:token:${hashedToken}`,
      user._id.toString(),
      "EX",
      15 * 60,
    );

    // Increment daily counter, expire at end of day (86400s max)
    const newCount = await redis.incr(countKey);
    if (newCount === 1) {
      // Set TTL to seconds remaining until midnight
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const secondsUntilMidnight = Math.floor((midnight - now) / 1000);
      await redis.expire(countKey, secondsUntilMidnight);
    }

    const magicLink = `${process.env.FRONTEND_URL}/verify-magic-link/${rawToken}`;

    await sendEmail({
      to: email,
      subject: "Your Magic Login Link - LawBridge",
      html: magicLinkTemplate(magicLink),
    });

    return res.status(200).json({
      success: true,
      message: "If an account exists, a magic link has been sent.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyMagicLink = async (req, res) => {
  try {
    const token = String(req.params.token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const redisKey = `magic:token:${hashedToken}`;
    const userId = await redis.get(redisKey);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Magic link is invalid or has expired.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // If 2FA is enabled, do NOT consume the token yet.
    // The client must complete 2FA via POST /verify-magic-link/:token first.
    if (user.twoFactorEnabled) {
      return res.status(200).json({
        success: true,
        requires2FA: true,
        message: "2FA verification required to complete login.",
      });
    }

    // No 2FA — one-time use, consume now
    await redis.del(redisKey);

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    return res
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          dob: user.dob,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          authProvider: user.authProvider,
        },
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const verifyMagicLink2FA = async (req, res) => {
  try {
    const token = String(req.params.token);
    const { twoFactorCode } = req.body;

    if (!twoFactorCode) {
      return res.status(400).json({
        success: false,
        message: "2FA code is required.",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const redisKey = `magic:token:${hashedToken}`;
    const userId = await redis.get(redisKey);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Magic link is invalid or has expired.",
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is not enabled for this account.",
      });
    }

    // Brute-force protection — max 5 failed attempts per 15 minutes
    const bruteKey = `2fa:magic:${userId}`;
    const currentAttempts = await redis.get(bruteKey);
    if (currentAttempts !== null && parseInt(currentAttempts, 10) >= 5) {
      const ttl = await redis.ttl(bruteKey);
      return res.status(429).json({
        success: false,
        message: `Too many 2FA attempts. Try again in ${Math.ceil(ttl / 60)} minutes.`,
      });
    }

    const totp = createTOTP(decrypt(user.twoFactorSecret));
    const delta = totp.validate({ token: twoFactorCode, window: 1 });

    if (delta === null) {
      const attempts = await redis.incr(bruteKey);
      if (attempts === 1) await redis.expire(bruteKey, 15 * 60);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired 2FA code.",
      });
    }

    // 2FA verified — consume the magic link token and clear brute-force counter
    await redis.del(redisKey);
    await redis.del(bruteKey);

    const accessToken = generateAccessToken({ id: user._id });
    const refreshToken = generateRefreshToken({ id: user._id });

    user.refreshToken = hashToken(refreshToken);
    await user.save({ validateBeforeSave: false });

    return res
      .cookie("refreshToken", refreshToken, refreshCookieOptions)
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          dob: user.dob,
          emailVerified: user.emailVerified,
          twoFactorEnabled: user.twoFactorEnabled,
          authProvider: user.authProvider,
        },
      });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
