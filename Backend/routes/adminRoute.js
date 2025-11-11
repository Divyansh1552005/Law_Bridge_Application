import express from "express";
import authAdmin from "../middleware/authAdmin.js";
import { addlawyer, adminLogin, getAllLawyers, getAllAppointments, cancelAppointmentByAdmin, adminDashboard} from "../controllers/adminController.js";
import { upload } from "../middleware/multer.js";
import {changeAvailability} from "../controllers/lawyerController.js";
const AdminRouter = express.Router();

AdminRouter.post("/add-lawyer", upload.single("image"), addlawyer);
AdminRouter.post("/login", adminLogin);
AdminRouter.get("/all-lawyers", authAdmin, getAllLawyers);
AdminRouter.get("/all-appointments", authAdmin, getAllAppointments);
AdminRouter.post("/cancel-appointment", authAdmin, cancelAppointmentByAdmin);
AdminRouter.get("/dashboard", authAdmin, adminDashboard);
AdminRouter.post("/change-availability", authAdmin, changeAvailability);



export default AdminRouter;