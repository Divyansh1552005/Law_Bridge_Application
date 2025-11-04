import express from "express";
import authUser from "../middleware/authUser.js";
import {signupUser, loginUser} from "../controllers/userController.js";
const userRouter = express.Router();


userRouter.post("/signup", signupUser);
userRouter.post("/login", loginUser);


export default userRouter;

