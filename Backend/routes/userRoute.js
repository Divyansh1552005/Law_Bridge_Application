import express from "express";
import authUser from "../middleware/authUser.js";
import { upload } from "../middleware/multer.js";
import {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail
} from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);
userRouter.get("/verify-email/:token", verifyEmail);
userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password/:token", resetPassword);
userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.patch(
  "/update-profile",
  authUser,
  upload.single("image"),
  updateUserProfile,
);
userRouter.post("/resend-verification", resendVerificationEmail);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-razorpay", authUser, paymentRazorpay);
userRouter.post("/verify-razorpay", authUser, verifyRazorpay);

export default userRouter;
