// One-off migration: move conversationModel.messages[] (legacy embedded array)
// into the new standalone `message` collection, then $unset the old field.
//
// Safe to re-run — a conversation is skipped once it no longer has a
// non-empty legacy `messages` array (i.e. already migrated).
//
// Usage: node scripts/migrateMessagesToCollection.js
// Requires MONGODB_URI in the environment (same as the main server).

import "dotenv/config";
import { connectMongoDB } from "../config/mongodb.js";
import mongoose from "mongoose";
import conversationModel from "../models/conversationModel.js";
import messageModel from "../models/messageModel.js";

const run = async () => {
  await connectMongoDB(process.env.MONGODB_URI);
  console.log("Connected to MongoDB for migration.");

  // Read the legacy `messages` field directly off the raw collection —
  // it no longer exists on the conversationModel schema, so we go around
  // Mongoose's schema-aware query layer for this one read.
  const rawCollection = conversationModel.collection;

  const cursor = rawCollection.find({
    messages: { $exists: true, $ne: [] },
  });

  let conversationsMigrated = 0;
  let messagesMigrated = 0;

  while (await cursor.hasNext()) {
    const conv = await cursor.next();
    const legacyMessages = conv.messages || [];

    if (legacyMessages.length === 0) continue;

    const docs = legacyMessages.map((msg) => ({
      _id: msg._id,
      conversationId: conv._id,
      userId: conv.userId,
      role: msg.role,
      content: msg.content,
      attachedDocument: msg.attachedDocument || null,
      sources: msg.sources || [],
      createdAt: msg.createdAt || conv.createdAt,
      updatedAt: msg.updatedAt || conv.updatedAt,
    }));

    await messageModel.insertMany(docs, { ordered: false });

    const lastMessage = legacyMessages[legacyMessages.length - 1];

    await rawCollection.updateOne(
      { _id: conv._id },
      {
        $set: {
          messageCount: legacyMessages.length,
          lastMessageAt: lastMessage?.createdAt || conv.updatedAt,
          lastMessagePreview: (lastMessage?.content || "").slice(0, 100),
        },
        $unset: { messages: "" },
      },
    );

    conversationsMigrated += 1;
    messagesMigrated += legacyMessages.length;
    console.log(
      `Migrated conversation ${conv._id} — ${legacyMessages.length} messages`,
    );
  }

  console.log(
    `\nDone. ${conversationsMigrated} conversations, ${messagesMigrated} messages migrated.`,
  );

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
