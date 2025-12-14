import {
  signupPostRequestBodySchema,
  loginPostRequestBodySchema,
  updatePatchRequestBodySchemaforUser,
} from "../validations/reqValidation.js";
import UserModel from "../models/userModel.js";
import lawyerModel from "../models/lawyerModel.js";
import appointmentModel from "../models/appointmentModel.js";
import crypto from "crypto";
import { generateCryptoToken } from "../utils/cryptoToken.js";
import { sendEmail } from "../services/mailService.js";
import { verifyEmailTemplate, resetPasswordTemplate } from "../services/emailTemplates.js";
import { hashPasswordWithSalt, verifyPassword } from "../utils/hash.js";
import { createToken } from "../utils/token.js";
import { v2 as cloudinary } from "cloudinary";
import razorpay from "razorpay";
import { error } from "console";
import userModel from "../models/userModel.js";

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
    
    // generate crypto token for verification
    const {rawToken, hashedToken} = generateCryptoToken();
    
    // now creating new user
    const new_user = new UserModel({
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
        message: "User does not exist with the given email",
        success: false,
      });
    }
    
    // check if email is verified for login
    if (!existingUser.emailVerified) {
      return res.status(403).json({
        message: "Please verify your email before logging in",
        // we will show resend email button in frontend if user has not verified email
        action : "RESEND VERIFICATION EMAIL"
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

// verification of email
export const verifyEmail = async (req,res) =>{
  try{
    // becoz zod changed it to obj
    const token = String(req.params.token);
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    const user = await userModel.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpiry: { $gt: Date.now() },
    })
    
    
    if (!user) {
          return res.status(400).json({ message: "Invalid or expired token" });
        }
    
        user.emailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpiry = undefined;
    
        await user.save();

        
        res.status(201).json({message : "Email Verified Successfully!!!"})
    
    
  }catch(error){
    res.status(500).json({
      message : error.message
    })
  }
}
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

// forgot password ie we will send reset link to the user if they exist
export const forgotPassword = async (req,res) => {
  try{
    const { email } = req.body;
    
    const user = await userModel.findOne({ email });
     if (!user){
       return res.status(404).json({ message: "No user with the email exists!!" });
    }
     
    const { rawToken, hashedToken } = generateCryptoToken();
    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();
    
    const resetLink =
        `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
    
      await sendEmail({
        to: email,
        subject: "Reset your password",
        html: resetPasswordTemplate(resetLink),
      });
    
      res.status(200).json({ message: "Reset password email sent" });
     
  }catch(error){
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// now we will have to reset the password from the link sent by forgot password
export const resetPassword = async (req, res) =>{
   const { token } = req.params;
   const { password } = req.body;
   
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
  // find the user jiska resetpasswordToken hash token se mil jaaye and expire na hua ho
  const user = await userModel.findOne({
    resetPasswordToken: hashedToken,
    // this checks ki vo user nikalo jinki resetPasswordExpiry is greater than current time ie time limit mein hai na vo abhi
    resetPasswordExpiry: { $gt: Date.now() },
  })
  
  if (!user){
      return res.status(400).json({ message: "Invalid or expired reset token" });
  }
  
    const { password: hashedPassword } = await hashPasswordWithSalt(password);
  
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;
  
    await user.save();
  
    res.status(201).json({ message: "Password reset successful" });
}



export const updateUserProfile = async (req, res) => {
  try {
    // Ensure userId is in the body for validation (added by authUser middleware)
    const bodyToValidate = {
      ...req.body,
      userId: req.body.userId || req.user?.id
    };

    console.log('Update profile request body:', bodyToValidate); // Debug log

    const { success, data, error } =
      await updatePatchRequestBodySchemaforUser.safeParseAsync(bodyToValidate);

    if (!success) {
      console.log('Validation error:', error.format()); // Debug log
      return res.status(400).json({
        error: error.format(),
        success: false,
        message: "Validation failed"
      });
    }

    const { userId, name, phone, address, dob, gender } = data;

    const updates = {};

    if (name !== undefined) updates.name = name;
    if (phone !== undefined && phone !== '') updates.phone = phone;
    if (dob !== undefined && dob !== '' && dob !== 'Not Selected') updates.dob = dob;
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
      cancelled: "Cancelled by User",
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

    if (!appointmentData || (appointmentData.cancelled && appointmentData.cancelled !== "Not Cancelled")){
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


