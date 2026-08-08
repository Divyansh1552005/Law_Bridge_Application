import axios from "axios";
import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import User from "../models/userModel.js";
import dotenv from "dotenv/config";
import redis from "../config/redis.js";
import { getMessageSchema } from "../validations/chatValidation.js";

// RAG chatbot ko poora chat history bhejne ke bajaye sirf recent context bhejte hain —
// isse token/latency cost bounded rehti hai jaise-jaise conversation lamba hota jaaye
const CHATBOT_HISTORY_LIMIT = 20;

const getRecentHistory = async (conversationId) => {
  const recent = await messageModel
    .find({ conversationId })
    .sort({ createdAt: -1 })
    .limit(CHATBOT_HISTORY_LIMIT)
    .lean();
  return recent.reverse();
};

// chat message
// this is blocking ie isme ham pehle store krte hai convo fir user ko bhejte hai, user ko bhej kar fir backend mein save kr lenge after sending to user
// export const getMessage = async (req, res) => {
//   try {
//     // userId must always come from authenticated middleware
//     const userId = req.user?.id;
//     if (!userId) {
//       return res.status(401).json({
//         success: false,
//         message: "Unauthorized",
//       });
//     }

//     const { sessionId, message } = req.body;

//     if (!sessionId || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "SessionId and message are required",
//       });
//     }

//     // find conversation
//     let chat = await conversationModel.findOne({ sessionId, userId });

//     if (!chat) {
//       chat = await conversationModel.create({
//         userId,
//         sessionId,
//         messages: [],
//       });
//     }

//     // push user message
//     chat.messages.push({
//       role: "user",
//       content: message,
//     });

//     // call RAG chatbot
//     const chatbot_response = await axios.post(
//       process.env.RAG_CHATBOT_API_URL + "/chat",
//       {
//         sessionId,
//         history: chat.messages,
//         message,
//       },
//       {
//         headers: {
//           secure_key: process.env.RAG_SECRET_KEY,
//         },
//       },
//     );

//     const chatbot_reply = chatbot_response.data.response;

//     const replyObject = {
//       role: "assistant",
//       content: chatbot_reply,
//     };

//     // decrement Redis first
//     const redisKey = `credits:${userId}`;
//     await redis.decr(redisKey);

//     // decrement MongoDB
//     await User.findByIdAndUpdate(userId, {
//       $inc: { "credits.remaining": -1 },
//     });

//     // save assistant reply
//     chat.messages.push(replyObject);
//     await chat.save();

//     return res.status(200).json({
//       success: true,
//       response: replyObject,
//     });
//   } catch (error) {
//     console.error("getMessage error:", {
//       message: error.message,
//       stack: error.stack,
//       axiosResponse: error.response?.data,
//       axiosStatus: error.response?.status,
//     });
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//       detail: error.response?.data || null,
//     });
//   }
// };

export const getMessage = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const validationResult = getMessageSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const { sessionId, message, attachedDocument } = validationResult.data;

    let chat = await conversationModel.findOne({ sessionId, userId });

    if (!chat) {
      chat = await conversationModel.create({ userId, sessionId });
    }

    await messageModel.create({
      conversationId: chat._id,
      userId,
      role: "user",
      content: message,
      attachedDocument: attachedDocument || null,
    });

    const history = await getRecentHistory(chat._id);

    const chatbot_response = await axios.post(
      process.env.RAG_CHATBOT_API_URL + "/chat",
      {
        sessionId,
        history,
        message,
        user_id: userId,
        mode: "both",
      },
      {
        headers: {
          secure_key: process.env.RAG_SECRET_KEY,
        },
      },
    );

    const chatbot_reply = chatbot_response.data.response;
    const sources = chatbot_response.data.sources || []; // sources bhi lo for web search

    const replyObject = {
      role: "assistant",
      content: chatbot_reply,
      sources: sources,
    };

    const redisKey = `credits:${userId}`;

    // decrement credits first (critical section)
    const remainingAfter = await redis.decr(redisKey);
    await User.findByIdAndUpdate(userId, {
      $inc: { "credits.remaining": -1 },
    });

    // send response immediately after credit consistency
    res.status(200).json({
      success: true,
      response: replyObject,
      creditsRemaining: Math.max(0, Number(remainingAfter)),
      sources,
    });

    // background save of assistant reply + conversation summary (non-blocking)
    (async () => {
      try {
        await messageModel.create({
          conversationId: chat._id,
          userId,
          ...replyObject,
        });

        await conversationModel.findByIdAndUpdate(chat._id, {
          $inc: { messageCount: 2 },
          lastMessageAt: new Date(),
          lastMessagePreview: chatbot_reply.slice(0, 100),
        });
      } catch (err) {
        console.error("Background chat save failed:", err.message);
      }
    })();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
