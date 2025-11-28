import express from "express";
import authUser from "../middleware/authUser.js";
import { getMessage } from "../controllers/messageContoller.js";

const messageRouter = express.Router();

messageRouter.post("/get-message", authUser, getMessage);

export default messageRouter;

