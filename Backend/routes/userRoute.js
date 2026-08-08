import express from "express";
import authUser from "../middleware/authUser.js";
import {
  signupUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserUploadSignature,
  listAppointment,
  cancelAppointment,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendVerificationEmail,
  requestDeleteAccountOtp,
  verifyDeleteAccountOtp,
  verify2FA,
  setup2FA,
  disable2FA,
  createPaymentOrder,
  verifyPaymentAndCreateAppointment,
  requestMagicLink,
  verifyMagicLink,
  verifyMagicLink2FA,
} from "../controllers/userController.js";
import { rateLimiter, routeLimiter } from "../middleware/rateLimiter.js";
import {
  startGoogleAuth,
  googleCallback,
} from "../controllers/googleAuthController.js";

const userRouter = express.Router();

// signup and login routes
userRouter.post("/signup", routeLimiter(3, 60), signupUser);
userRouter.post("/login", routeLimiter(5, 60), loginUser);
userRouter.get("/verify-email/:token", verifyEmail);

// forgot password routes
userRouter.post("/forgot-password", routeLimiter(3, 60 * 60), forgotPassword);
userRouter.post(
  "/reset-password/:token",
  routeLimiter(5, 60 * 15),
  resetPassword,
);

// fetch user profile or  update it
userRouter.get("/get-profile", authUser, getUserProfile);
userRouter.post("/upload-signature", authUser, getUserUploadSignature);
userRouter.patch("/update-profile", authUser, updateUserProfile);

// resending verification email
userRouter.post(
  "/resend-verification",
  routeLimiter(3, 60 * 60),
  resendVerificationEmail,
);

// Oauth2 + OIDC

userRouter.get("/google", routeLimiter(10, 60), startGoogleAuth);
userRouter.get("/google/callback", routeLimiter(10, 60), googleCallback);

// Account deletion
userRouter.post("/delete-account/request", authUser, requestDeleteAccountOtp);
userRouter.post("/delete-account/verify", authUser, verifyDeleteAccountOtp);

// appointment and online payment related paths
// userRouter.post("/book-appointment", authUser, bookAppointment); // UNUSED IN NEW FLOW
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
// userRouter.post("/payment-razorpay", authUser, paymentRazorpay); // UNUSED IN NEW FLOW
// userRouter.post("/verify-razorpay", authUser, verifyRazorpay); // UNUSED IN NEW FLOW
userRouter.post("/create-payment-order", authUser, createPaymentOrder);
userRouter.post(
  "/verify-payment-and-create-appointment",
  authUser,
  verifyPaymentAndCreateAppointment,
);

// 2FA based
// initiate 2FA setup (generate secret + QR)
userRouter.post("/2fa/setup", authUser, setup2FA);

// verify OTP and enable 2FA
userRouter.post("/2fa/verify", authUser, verify2FA);

// disable 2fa
userRouter.post("/2fa/disable", authUser, disable2FA);

// Magic link for login
userRouter.post("/magic-link", routeLimiter(3, 60 * 60), requestMagicLink);
userRouter.get("/verify-magic-link/:token", verifyMagicLink);
userRouter.post(
  "/verify-magic-link/:token",
  routeLimiter(10, 15 * 60),
  verifyMagicLink2FA,
);

export default userRouter;
