import express from "express";
import { addlawyer } from "../controllers/adminController.js";
import { upload } from "../middleware/multer.js";

const AdminRouter = express.Router();

AdminRouter.post("/add-lawyer", upload.single("image"), addlawyer);



export default AdminRouter;