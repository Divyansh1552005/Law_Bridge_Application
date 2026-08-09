import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import { routeLimiter } from "../middleware/rateLimiter.js";
import { verifyTurnstile } from "../middleware/verifyTurnstile.js";
import {
  addlawyer,
  adminLogin,
  getAllLawyers,
  getAllAppointments,
  cancelAppointmentByAdmin,
  adminDashboard,
  refreshAdminAccessToken,
  logoutAdmin,
  changeAvailability,
  getAdminLawyerUploadSignature,
} from "../controllers/adminController.js";
const AdminRouter = express.Router();

AdminRouter.post(
  "/upload-signature",
  authAdmin,
  getAdminLawyerUploadSignature,
);
AdminRouter.post("/add-lawyer", authAdmin, addlawyer);

AdminRouter.post("/login", routeLimiter(5, 60), verifyTurnstile, adminLogin);
AdminRouter.post("/refresh", refreshAdminAccessToken);
AdminRouter.post("/logout", logoutAdmin);
AdminRouter.get("/all-lawyers", authAdmin, getAllLawyers);
AdminRouter.get("/all-appointments", authAdmin, getAllAppointments);
AdminRouter.post("/cancel-appointment", authAdmin, cancelAppointmentByAdmin);
AdminRouter.get("/dashboard", authAdmin, adminDashboard);
AdminRouter.post("/change-availability", authAdmin, changeAvailability);

export default AdminRouter;
