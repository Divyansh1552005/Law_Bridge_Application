import express from "express";
import authUser from "../middleware/authUser.js";
import { createChat, getChat, deleteChat, getUserChats, updateChatTitle } from "../controllers/chatController.js"; 

const chatRouter = express.Router();

chatRouter.post("/create", authUser, createChat);
chatRouter.get("/get/:sessionId", authUser, getChat);
chatRouter.get("/sessions", authUser, getUserChats);
chatRouter.put("/update-title", authUser, updateChatTitle);
chatRouter.delete("/delete", authUser, deleteChat);

export default chatRouter;

