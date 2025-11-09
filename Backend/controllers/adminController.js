import UserModel from "../models/userModel.js";
import lawyerModel from "../models/lawyerModel.js";
import dotenv from "dotenv/config";
import appointmentModel from "../models/appointmentModel.js";
import { verifyPassword, hashPasswordWithSalt } from "../utils/hash.js";
import { v2 as cloudinary } from "cloudinary";
import {
  addLawyerByAdminSchema,
  loginPostRequestBodySchema,
} from "../validations/reqValidation.js";
import { createToken } from "../utils/token.js";
import { create } from "domain";

export const addlawyer = async (req, res) => {
  try {
    const imageFile = req.file;
    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

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
    } = validatedData;

    if (!imageFile) {
      return res.status(400).json({ message: "Image is required" });
    }

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
    const { salt, password: hashedPassword } = await hashPasswordWithSalt(
      password
    );

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });
    const imageUrl = imageUpload.secure_url;

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
    console.error("Error adding lawyer:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const validationResult = loginPostRequestBodySchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { email, password } = validationResult.data;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminPayload = {
        id: email.toString(), // token payload with email as id
      };

      const aToken = await createToken(adminPayload);
      return res.status(200).json({
        success: true,
        message: "Admin logged in successfully",
        token: aToken,
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid admin credentials",
    });
  } catch (error) {
    console.error("Error during admin login:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await lawyerModel.find().select("-password");
    res.status(200).json({ success: true, lawyers });
  } catch (error) {
    console.error("Error fetching lawyers:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find().sort({ createdAt: -1 });

    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// api to cancel any appointment by admin

export const cancelAppointmentByAdmin = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res
        .status(400)
        .json({ success: false, message: "Appointment ID is required" });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    // check if appointment exists
    if (!appointment) {
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });
    }

    // check if appointment is already cancelled
    if (appointment.cancelled === "Cancelled by User") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Appointment is already cancelled by User",
        });
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        cancelled: "Cancelled by Admin",
      },
      { new: true }
    );

    res
      .status(200)
      .json({
        success: true,
        message: "Appointment cancelled successfully by Admin",
        appointment: updatedAppointment,
      });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


export const adminDashboard = async (req, res) => {
    try {

        const lawyers = await lawyerModel.find({})
        const users = await UserModelserModel.find({})
        const appointments = await appointmentModel.find({})

        // console.log(appointments);
        // console.log(users);
        // console.log(lawyers);

        const dashData = {
            lawyers: lawyers.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.status(200).json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}