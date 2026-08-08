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

// Har chat message apna alag document hai (conversationModel.messages[] ke bajaye) —
// isse ek hi conversation ka size 16MB BSON limit ke paas nahi jaata aur
// har naye message pe poora conversation document rewrite nahi hota
const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversation",
      required: true,
      index: true,
    },
    // denormalized — account-deletion cascade ke liye conversation lookup ki zaroorat nahi
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
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

// Ek conversation ke messages ko creation order mein fetch karne ke liye
messageSchema.index({ conversationId: 1, createdAt: 1 });

const messageModel =
  mongoose.models.message || mongoose.model("message", messageSchema);

export default messageModel;
