import express from "express";
import authUser from "../middleware/authUser.js";
import { createChat, getChat, deleteChat } from "../controllers/chatController.js"; 

const chatRouter = express.Router();

chatRouter.post("/create", authUser, createChat);
chatRouter.get("/get", authUser, getChat);
chatRouter.delete("/delete", authUser, deleteChat);

export default chatRouter;

