import conversationModel from "../models/conversationModel.js";

// Create a new chat session
export const createChat = async (req, res) => {
  try {
        const userId = req.user?.id || req.body.userId;
    const { sessionId } = req.body;

    // Create empty chat for this user
    const newChat = await conversationModel.create({
      userId,
      sessionId,
      messages: [],
    });

    console.log("New chat created:", newChat);

    res.status(201).json({
      success: true,
      message: "Chat created",
      chatId: newChat._id,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get chat by sessionId
export const getChat = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { sessionId } = req.params;

    const chat = await conversationModel.findOne({ sessionId, userId });

    console.log("CHAT FETCHED:", chat);

    res.status(200).json({
      success: true,
      chats: chat || { sessionId, messages: [] },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all user chat sessions
export const getUserChats = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;

    // Get all user chats with basic info (sessionId, title, first message, timestamps)
    const chats = await conversationModel.find({ userId })
      .select('sessionId title messages createdAt updatedAt')
      .sort({ updatedAt: -1 }); // Latest first

    // Format the response to include last message preview
    const formattedChats = chats.map(chat => ({
      sessionId: chat.sessionId,
      title: chat.title,
      lastMessage: chat.messages.length > 0 
        ? chat.messages[chat.messages.length - 1].content.slice(0, 50) + '...'
        : 'New chat',
      messageCount: chat.messages.length,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    }));

    res.status(200).json({
      success: true,
      sessions: formattedChats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update chat title
export const updateChatTitle = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { sessionId, title } = req.body;

    const updatedChat = await conversationModel.findOneAndUpdate(
      { sessionId, userId },
      { title },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    console.log(`Chat title updated for sessionId ${sessionId}`);
    res.status(200).json({
      success: true,
      message: "Chat title updated",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete chat by sessionId (only user's own chat)
export const deleteChat = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId;
    const { sessionId } = req.body;

    await conversationModel.deleteOne({ sessionId, userId });

    console.log(`Chat with sessionId ${sessionId} deleted`);
    res.status(200).json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
