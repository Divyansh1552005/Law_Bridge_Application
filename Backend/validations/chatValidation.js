import { z } from "zod";

export const createChatSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

export const updateChatTitleSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  title: z.string().min(1, "Title is required"),
});

export const deleteChatSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
});

export const getMessageSchema = z.object({
  sessionId: z.string().min(1, "Session ID is required"),
  message: z.string().min(1, "Message is required"),
  attachedDocument: z
    .object({
      documentId: z.string(),
      filename: z.string(),
      fileType: z.string(),
    })
    .nullable()
    .optional(),
});
