import mongoose from "mongoose";

// ye schema sirf conversation context ke liye banaya hai
const attachedDocumentSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "document",
      required: true,
    },
    filename: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ["pdf", "docx", "txt", "image"],
      required: true,
    },
  },
  { _id: false }, // nested object hai, alag _id nahi chahiye
);

const sourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    // Sirf user messages mein hoga, assistant ke liye null
    attachedDocument: {
      type: attachedDocumentSchema,
      default: null,
    },
    sources: {
      type: [sourceSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: null,
    },
    messages: [messageSchema],

    // public banane aali chize like if user wanna share their chat

    isPublic: {
      type: Boolean,
      default: false,
    },

    shareToken: {
      type: String,
      default: null,
      index: true, // fastly lookup krna ho
    },
  },
  { timestamps: true },
);

conversationSchema.index({ userId: 1, sessionId: 1 }, { unique: true });
conversationSchema.index({ userId: 1 });
conversationSchema.index({ updatedAt: -1 });

const conversationModel =
  mongoose.models.conversation ||
  mongoose.model("conversation", conversationSchema);

export default conversationModel;
