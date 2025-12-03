import axios from "axios";
import conversationModel from "../models/conversationModel.js";
import userModel from "../models/userModel.js";
import dotenv from "dotenv/config";


// chat message 
export const getMessage = async (req, res) => {

    try {
        const userId = req.user?.id || req.body.userId;

        const {sessionId, message} = req.body;
        const userMessage = message;

        // find conversiation if it exists
        let chat = await conversationModel.findOne({sessionId, userId});

        if(!chat){
            // create new conversation
            chat = await conversationModel.create({
                userId,
                sessionId,
                messages: []
            });
        }

        // add user message to conversation
        chat.messages.push({
            role: "user",
            content: userMessage
        });

        // call the RAG Chatbot API
        const chatbot_response = await axios.post(process.env.RAG_CHATBOT_API_URL + "/chat", {
            sessionId,
            history: chat.messages,
            message: userMessage
        },

        {
            headers: {
                'secure_key': process.env.RAG_SECRET_KEY
            }
        },
    );

        const chatbot_reply = chatbot_response.data.response;
        
        const replyObject = {
            role: "assistant",
            content: chatbot_reply
        }

        // ab user ko directly bhej do and fir save karo database me
        res.status(200).json({
            success: true,
            response: replyObject
        });


        // add chatbot reply to database
        chat.messages.push(replyObject);
        await chat.save();
        
    }catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }

}

