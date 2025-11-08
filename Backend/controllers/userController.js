import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
  updatePatchRequestBodySchemaforUser,
} from "../validations/reqValidation.js";
import UserModel from "../models/userModel.js";
import lawyerModel from "../models/lawyerModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { hashPasswordWithSalt, verifyPassword } from "../utils/hash.js";
import { createToken } from "../utils/token.js";
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay";

// creating user controller for signup

export const signupUser = async (req, res) => {
  try {
    const validationResult = await signupPostRequestBodySchema.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { name, email, password } = validationResult.data;

    // check if user already exists with the same email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        error: "User already exists with the same email",
        success: false,
      });
    }

    // now hashing the password
    const { password: hashedPassword } = await hashPasswordWithSalt(password);

    // now creating new user
    const new_user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });

    await new_user.save();

    // ab token create karna hai for that user
    const token = await createToken({ id: new_user._id.toString() });
    return res.status(201).json({
      message: "User created successfully",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Error in signupUser:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      success: false,
    });
  }
};

// api to login user
export const loginUser = async (req, res) => {
  try {
    const validationResult = await loginPostRequestBodySchema.safeParseAsync(
      req.body
    );

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { email, password } = validationResult.data;

    // check if user exists with the email
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({
        error: "User does not exist with the given email",
        success: false,
      });
    }

    // now verify the password
    const isPasswordValid = await verifyPassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid password",
        success: false,
      });
    }

    // ab token create karna hai for that user
    const token = await createToken({ id: existingUser._id.toString() });
    return res.status(200).json({
      message: "User logged in successfully",
      success: true,
      token,
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      success: false,
    });
  }
};

// get user data for profile page
export const getUserProfile = async (req, res) => {
  try {
    // Get userId from either req.user or req.body
    const userId = req.user?.id || req.body.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User ID not found in request",
      });
    }

    const user = await UserModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { success, data, error } =
      await updatePatchRequestBodySchemaforUser.safeParseAsync(req.body);

    if (!success) {
      return res.status(400).json({
        error: error.format(),
        success: false,
      });
    }

    const { userId, name, phone, address, dob, gender } = data;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (dob !== undefined) updates.dob = dob;
    if (gender !== undefined) updates.gender = gender;
    
    // Handle address parsing if it's a string
    if (address !== undefined) {
      if (typeof address === 'string') {
        try {
          updates.address = JSON.parse(address);
        } catch (error) {
          return res.status(400).json({
            success: false,
            message: "Invalid address format. Address must be a valid JSON object"
          });
        }
      } else {
        updates.address = address;
      }
    }

    // Handle image upload if present
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      updates.image = uploadResult.secure_url;
    }

    await UserModel.findByIdAndUpdate(userId, updates, { new: true });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });

  } catch (err) {
    console.log("Error in updateUserProfile:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const bookAppointment = async (req, res) => {
  try {
    const { userId, lawyerId, slotDate, slotTime } = req.body;
    
    if (!slotTime){
      return res.status(400).json({ 
        success: false, 
        message: "Please select slot time" 
      });
    }
    
    if (!slotDate) {
      return res.status(400).json({ 
        success: false, 
        message: "Please select appointment date" 
      });
    }

    const lawyerData = await lawyerModel.findById(lawyerId).select("-password");

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

    const userData = await UserModel.findById(userId).select("-password");

    // remove booked slots from lawyer data so frontend does not receive it so vo dikaaye hi na uss slot ko jo booked hai
    delete lawyerData.slots_booked;

    const appointmentData = {
      userId,
      lawyerId,
      userData,
      lawyerData,
      amount: lawyerData.fees,
      slotTime,
      slotDate,
      date: Date.now(), // when appointment was booked
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // save new slots data in lawyerData
    await lawyerModel.findByIdAndUpdate(lawyerId, { slots_booked });

    res.status(201).json({ success: true, message: "Appointment Booked! Pay online to complete the booking!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to get user appointments for frontend my-appointments page
export const listAppointment = async (req, res) => {
  try {
    const userId = req.body.userId; // This is set by authUser middleware
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const appointments = await appointmentModel
      .find({ userId })
      .sort({ date: -1 }); // Sort by date descending

    res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// api to cancel appointment from my-appointments page
export const cancelAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    // verify appointment user id matches request user id
    if (appointmentData.userId !== userId) {
      return res
        .status(400)
        .json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });

    // releasing lawyer slot coz appointment cancelled
    const { lawyerId, slotDate, slotTime } = appointmentData;

    const lawyerData = await lawyerModel.findById(lawyerId);

    let slots_booked = lawyerData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await lawyerModel.findByIdAndUpdate(lawyerId, { slots_booked });

    res.status(200).json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// api to make payment for appointment

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const paymentRazorpay = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled){
      return res
        .status(400)
        .json({
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
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to verify payment of razorpay
export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === "paid") {
      await appointmentModel.findByIdAndUpdate(orderInfo.receipt, {
        payment: true,
      });
      res.status(200).json({ success: true, message: "Payment Successful" });
    } else {
      res.status(400).json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


