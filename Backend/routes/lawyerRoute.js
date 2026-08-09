import express from "express";
import authLawyer from "../middleware/authLawyer.js";
import { routeLimiter } from "../middleware/rateLimiter.js";
import { verifyTurnstile } from "../middleware/verifyTurnstile.js";
import {
  changeAvailability,
  getLawyerList,
  lawyerLogin,
  cancelAppointmentByLawyer,
  appointmentCompletedByLawyer,
  getLawyerProfile,
  updateLawyerProfile,
  getLawyerUploadSignature,
  lawyerDashboard,
  getLawyerAppointments,
  refreshLawyerAccessToken,
  logoutLawyer,
} from "../controllers/lawyerController.js";

const LawyerRouter = express.Router();

LawyerRouter.post("/change-availability", authLawyer, changeAvailability);
LawyerRouter.get("/list", getLawyerList);
LawyerRouter.post("/login", routeLimiter(5, 60), verifyTurnstile, lawyerLogin);
LawyerRouter.post("/refresh", refreshLawyerAccessToken);
LawyerRouter.post("/logout", logoutLawyer);
LawyerRouter.post("/cancel-appointment", authLawyer, cancelAppointmentByLawyer);
LawyerRouter.post(
  "/complete-appointment",
  authLawyer,
  appointmentCompletedByLawyer,
);
LawyerRouter.get("/profile", authLawyer, getLawyerProfile);
LawyerRouter.post("/upload-signature", authLawyer, getLawyerUploadSignature);
LawyerRouter.patch("/update-profile", authLawyer, updateLawyerProfile);
LawyerRouter.get("/dashboard", authLawyer, lawyerDashboard);
LawyerRouter.get("/appointments", authLawyer, getLawyerAppointments);

export default LawyerRouter;
