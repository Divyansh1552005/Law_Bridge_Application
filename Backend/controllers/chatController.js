import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";
import {
  createChatSchema,
  updateChatTitleSchema,
  deleteChatSchema,
} from "../validations/chatValidation.js";
import PDFDocument from "pdfkit";
import { nanoid } from "nanoid";

// getChat/getSharedChat me itne hi recent messages dikhate hain by default —
// bahut purane/lambe sessions ka poora history load karne se bachne ke liye
const MESSAGE_FETCH_LIMIT = 200;

// Create a new chat session
export const createChat = async (req, res) => {
  try {
    const validationResult = createChatSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const userId = req.user.id;

    const { sessionId } = validationResult.data;

    // Create empty chat for this user
    const newChat = await conversationModel.create({
      userId,
      sessionId,
    });

    // console.log("New chat created:", newChat);

    res.status(201).json({
      success: true,
      message: "Chat created",
      chatId: newChat._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get chat by sessionId
export const getChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const chat = await conversationModel.findOne({ sessionId, userId }).lean();

    if (!chat) {
      return res.status(200).json({
        success: true,
        chats: { sessionId, messages: [] },
      });
    }

    const messages = await messageModel
      .find({ conversationId: chat._id })
      .sort({ createdAt: 1 })
      .limit(MESSAGE_FETCH_LIMIT)
      .lean();

    res.status(200).json({
      success: true,
      chats: { ...chat, messages },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Get all user chat sessions
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all user chats with basic info (sessionId, title, last message, timestamps)
    // messageCount/lastMessagePreview are denormalized on the conversation doc,
    // so this never has to touch the (much larger) message collection
    const chats = await conversationModel
      .find({ userId })
      .select(
        "sessionId title messageCount lastMessagePreview createdAt updatedAt",
      )
      .sort({ updatedAt: -1 }); // Latest first

    const formattedChats = chats.map((chat) => ({
      sessionId: chat.sessionId,
      title: chat.title,
      lastMessage: chat.lastMessagePreview
        ? chat.lastMessagePreview.slice(0, 50) + "..."
        : "New chat",
      messageCount: chat.messageCount,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }));

    res.status(200).json({
      success: true,
      sessions: formattedChats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update chat title
export const updateChatTitle = async (req, res) => {
  try {
    const validationResult = updateChatTitleSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const userId = req.user.id;
    const { sessionId, title } = validationResult.data;

    const updatedChat = await conversationModel.findOneAndUpdate(
      { sessionId, userId },
      { title },
      { new: true },
    );

    if (!updatedChat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // console.log(`Chat title updated for sessionId ${sessionId}`);
    res.status(200).json({
      success: true,
      message: "Chat title updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete chat by sessionId
// Delete chat by sessionId (only user's own chat)
export const deleteChat = async (req, res) => {
  try {
    const validationResult = deleteChatSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.format(),
        success: false,
      });
    }

    const userId = req.user.id;
    const { sessionId } = validationResult.data;

    const chat = await conversationModel.findOneAndDelete({
      sessionId,
      userId,
    });

    if (chat) {
      await messageModel.deleteMany({ conversationId: chat._id });
    }

    // console.log(`Chat with sessionId ${sessionId} deleted`);
    res.status(200).json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const exportAllChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const format = req.query.format || "json";

    const conversations = await conversationModel
      .find({ userId })
      .select("sessionId title messageCount createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const nonEmptyConversations = conversations.filter(
      (conv) => conv.messageCount > 0,
    );

    // ek hi query se saare conversations ke messages fetch karo, phir group karo —
    // export explicit/infrequent user action hai, so full history fetch yaha theek hai
    const allMessages = await messageModel
      .find({ conversationId: { $in: nonEmptyConversations.map((c) => c._id) } })
      .sort({ createdAt: 1 })
      .lean();

    const messagesByConversation = new Map();
    for (const msg of allMessages) {
      const key = msg.conversationId.toString();
      if (!messagesByConversation.has(key)) messagesByConversation.set(key, []);
      messagesByConversation.get(key).push(msg);
    }

    const filteredConversations = nonEmptyConversations.map((conv) => ({
      ...conv,
      messages: messagesByConversation.get(conv._id.toString()) || [],
    }));

    // JSON export
    if (format === "json") {
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalConversations: filteredConversations.length,
        conversations: filteredConversations.map((conv) => ({
          sessionId: conv.sessionId,
          title: conv.title || "Untitled",
          createdAt: conv.createdAt,
          updatedAt: conv.updatedAt,
          totalMessages: conv.messages.length,
          messages: conv.messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.createdAt,
          })),
        })),
      };

      res.setHeader("Content-Disposition", `attachment; filename="lawbridge-chats-${Date.now()}.json"`);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(exportData);
    }

    // PDF export
    if (format === "pdf") {
      const doc = new PDFDocument({ margin: 50 });

      res.setHeader("Content-Disposition", `attachment; filename="lawbridge-chats-${Date.now()}.pdf"`);
      res.setHeader("Content-Type", "application/pdf");

      doc.pipe(res);

      // Header
      doc.fontSize(20).font("Helvetica-Bold").text("LawBridge - Chat Export", { align: "center" });
      doc.fontSize(10).font("Helvetica").text(`Exported on: ${new Date().toLocaleString("en-IN")}`, { align: "center" });
      doc.moveDown(2);

      if (filteredConversations.length === 0) {
        doc.fontSize(12).text("No conversations found.", { align: "center" });
        doc.end();
        return;
      }

      filteredConversations.forEach((conv, index) => {
        // Conversation title
        doc.fontSize(14)
          .font("Helvetica-Bold")
          .text(`${index + 1}. ${conv.title || "Untitled"}`, { underline: true });

        doc.fontSize(9)
          .font("Helvetica")
          .text(`Session: ${conv.sessionId}`)
          .text(`Created: ${new Date(conv.createdAt).toLocaleString("en-IN")}`)
          .text(`Messages: ${conv.messages.length}`);

        doc.moveDown(0.5);

        // Messages
        conv.messages.forEach((msg) => {
          const isUser = msg.role === "user";
          const label = isUser ? "You" : "LawBridge AI";

          doc.fontSize(10)
            .font("Helvetica-Bold")
            .fillColor(isUser ? "#1a56db" : "#057a55")
            .text(`${label}:`, { continued: false });

          doc.fontSize(10)
            .font("Helvetica")
            .fillColor("#000000")
            .text(msg.content, { width: 500 });

          doc.fontSize(8)
            .fillColor("#888888")
            .text(new Date(msg.createdAt).toLocaleString("en-IN"));

          doc.moveDown(0.5);
        });

        // Divider between conversations
        if (index < filteredConversations.length - 1) {
          doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke("#cccccc");
          doc.moveDown(1);
        }
      });

      doc.end();
      return;
    }

    return res.status(400).json({ success: false, message: "Invalid format. Use 'json' or 'pdf'" });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to export chats",
    });
  }
};


// if a user wanna export a particular chat as pdf or json
export const exportSingleChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;
    const format = req.query.format || "json";

    const chat = await conversationModel
      .findOne({ userId, sessionId })
      .select("sessionId title messageCount createdAt updatedAt")
      .lean();

    if (!chat || chat.messageCount === 0) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    const messages = await messageModel
      .find({ conversationId: chat._id })
      .sort({ createdAt: 1 })
      .lean();

    const conversation = { ...chat, messages };

    // JSON
    if (format === "json") {
      const exportData = {
        exportedAt: new Date().toISOString(),
        sessionId: conversation.sessionId,
        title: conversation.title || "Untitled",
        createdAt: conversation.createdAt,
        totalMessages: conversation.messages.length,
        messages: conversation.messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
        })),
      };
      res.setHeader("Content-Disposition", `attachment; filename="lawbridge-chat-${Date.now()}.json"`);
      res.setHeader("Content-Type", "application/json");
      return res.status(200).json(exportData);
    }

    // PDF
    if (format === "pdf") {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader("Content-Disposition", `attachment; filename="lawbridge-chat-${Date.now()}.pdf"`);
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);

      doc.fontSize(20).font("Helvetica-Bold").text("LawBridge - Chat Export", { align: "center" });
      doc.fontSize(10).font("Helvetica").text(`Exported on: ${new Date().toLocaleString("en-IN")}`, { align: "center" });
      doc.moveDown(2);

      doc.fontSize(14).font("Helvetica-Bold").text(conversation.title || "Untitled", { underline: true });
      doc.fontSize(9).font("Helvetica")
        .text(`Session: ${conversation.sessionId}`)
        .text(`Created: ${new Date(conversation.createdAt).toLocaleString("en-IN")}`)
        .text(`Messages: ${conversation.messages.length}`);
      doc.moveDown(0.5);

      conversation.messages.forEach((msg) => {
        const isUser = msg.role === "user";
        doc.fontSize(10).font("Helvetica-Bold")
          .fillColor(isUser ? "#1a56db" : "#057a55")
          .text(isUser ? "You:" : "LawBridge AI:");
        doc.fontSize(10).font("Helvetica").fillColor("#000000").text(msg.content, { width: 500 });
        doc.fontSize(8).fillColor("#888888").text(new Date(msg.createdAt).toLocaleString("en-IN"));
        doc.moveDown(0.5);
      });

      doc.end();
      return;
    }

    return res.status(400).json({ success: false, message: "Invalid format" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to export chat" });
  }
};


// chat sharing aale controllers
// we will provide toggle button too ie public bana di, user can make that chat private too

// Sharing the chat
export const shareChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    const conversation = await conversationModel.findOne({ userId, sessionId });
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    if (!conversation.shareToken) {
      conversation.shareToken = nanoid(12);
    }
    
    conversation.isPublic = true;
    await conversation.save();

    return res.status(200).json({
      success: true,
      shareUrl: `${process.env.FRONTEND_URL}/shared/${conversation.shareToken}`,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to share chat" });
  }
};

// Toggling the chat to unshare it, like make it private again
export const unshareChat = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.params;

    await conversationModel.findOneAndUpdate(
      { userId, sessionId },
      { isPublic: false, shareToken: null }
    );

    return res.status(200).json({ success: true, message: "Chat is now private" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to unshare chat" });
  }
};

// Public fetch -> jisko share kri hai vo bhi dekh ske
export const getSharedChat = async (req, res) => {
  try {
    const { shareToken } = req.params;

    const conversation = await conversationModel
      .findOne({ shareToken, isPublic: true })
      .select("title createdAt")
      .lean();

    if (!conversation) {
      return res.status(404).json({ success: false, message: "Shared chat not found" });
    }

    const messages = await messageModel
      .find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .limit(MESSAGE_FETCH_LIMIT)
      .lean();

    return res.status(200).json({
      success: true,
      chat: {
        title: conversation.title || "Untitled",
        createdAt: conversation.createdAt,
        messages: messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.createdAt,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch shared chat" });
  }
};