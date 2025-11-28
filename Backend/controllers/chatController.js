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

    res.status(200).json({
      success: true,
      chat: chat || { sessionId, messages: [] },
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

    res.status(200).json({
      success: true,
      message: "Chat deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
