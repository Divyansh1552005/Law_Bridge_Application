import mongoose from "mongoose";

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

    // actual messages ab alag "message" collection mein hain (messageModel.js) —
    // ye sirf denormalized summary fields hain taaki sidebar list (getUserChats)
    // ko har baar poora message history load na karna pade
    messageCount: {
      type: Number,
      default: 0,
    },
    lastMessageAt: {
      type: Date,
      default: null,
    },
    lastMessagePreview: {
      type: String,
      default: null,
    },

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
