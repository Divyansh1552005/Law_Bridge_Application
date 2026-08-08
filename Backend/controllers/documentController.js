import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import documentModel from "../models/documentModel.js";
import redis from "../config/redis.js";
import {
  signUploadParams,
  getSignedDeliveryUrl,
  getResourceType,
} from "../config/cloudinarySign.js";

const DAILY_UPLOAD_LIMIT = 2;

const EXTENSION_SIZE_LIMITS = {
  pdf: 15 * 1024 * 1024,
  docx: 5 * 1024 * 1024,
  txt: 2 * 1024 * 1024,
  image: 5 * 1024 * 1024,
};

const MIMETYPE_TO_FILETYPE = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "text/plain": "txt",
  "image/jpeg": "image",
  "image/png": "image",
  "image/webp": "image",
};

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getSecondsUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
};

// Redis key for daily upload count — resets at midnight, same as chat credits
const getDailyUploadKey = (userId) => {
  const today = getLocalDateKey();
  return `doc_upload:${userId}:${today}`;
};

const getUploadCountToday = async (userId) => {
  const redisKey = getDailyUploadKey(userId);
  return parseInt((await redis.get(redisKey)) || "0");
};

// Filename ko public_id mein safely embed karne ke liye
const sanitizeFilename = (filename) =>
  filename.replace(/[^a-zA-Z0-9._-]/g, "_");

// Step 1 — client Cloudinary pe seedha upload karne se pehle signed params maangta hai
export const getUploadSignature = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const { filename, mimetype, size } = req.body;

    if (!filename || !mimetype || !size) {
      return res.status(400).json({
        success: false,
        message: "filename, mimetype aur size zaroori hain",
      });
    }

    const fileType = MIMETYPE_TO_FILETYPE[mimetype];
    if (!fileType) {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported file type" });
    }

    const sizeLimit = EXTENSION_SIZE_LIMITS[fileType];
    if (size > sizeLimit) {
      const limitMB = sizeLimit / (1024 * 1024);
      return res.status(400).json({
        success: false,
        message: `${fileType.toUpperCase()} files must be under ${limitMB}MB`,
      });
    }

    const uploadCountToday = await getUploadCountToday(userId);
    if (uploadCountToday >= DAILY_UPLOAD_LIMIT) {
      return res.status(429).json({
        success: false,
        message: `Daily upload limit reached (${DAILY_UPLOAD_LIMIT} uploads/day). Try again tomorrow.`,
      });
    }

    const resourceType = getResourceType(fileType);
    const folder = `lawbridge/user-documents/${userId}`;
    const publicId = `${Date.now()}-${sanitizeFilename(filename)}`;

    const signedParams = signUploadParams({
      folder,
      public_id: publicId,
      type: "authenticated",
    });

    return res.status(200).json({
      success: true,
      ...signedParams,
      resourceType,
      fileType,
    });
  } catch (error) {
    console.error("getUploadSignature error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Step 2 — client ne seedha Cloudinary pe upload kar diya, ab RAG pipeline chalao
export const confirmUpload = async (req, res) => {
  const userId = req.user.id.toString();
  const { publicId, resourceType, filename, fileType } = req.body;

  if (!publicId || !resourceType || !filename || !fileType) {
    return res.status(400).json({
      success: false,
      message: "publicId, resourceType, filename aur fileType zaroori hain",
    });
  }

  // Client se aaya publicId sirf isi user ke folder ka hona chahiye
  if (!publicId.startsWith(`lawbridge/user-documents/${userId}/`)) {
    return res.status(400).json({ success: false, message: "Invalid publicId" });
  }

  try {
    const uploadCountToday = await getUploadCountToday(userId);
    if (uploadCountToday >= DAILY_UPLOAD_LIMIT) {
      return res.status(429).json({
        success: false,
        message: `Daily upload limit reached (${DAILY_UPLOAD_LIMIT} uploads/day). Try again tomorrow.`,
      });
    }

    // Verify asset actually exists on Cloudinary — client-supplied publicId ko blindly trust nahi karte
    let asset;
    try {
      asset = await cloudinary.api.resource(publicId, {
        resource_type: resourceType,
        type: "authenticated",
      });
    } catch {
      return res
        .status(400)
        .json({ success: false, message: "Uploaded asset not found" });
    }

    const signedUrl = getSignedDeliveryUrl(publicId, resourceType);
    const today = getLocalDateKey();

    let pythonResult;
    try {
      const pythonResponse = await axios.post(
        `${process.env.RAG_CHATBOT_API_URL}/upload-document`,
        {
          user_id: userId,
          filename,
          signed_url: signedUrl,
          public_id: publicId,
        },
        {
          headers: { secure_key: process.env.RAG_SECRET_KEY },
        },
      );
      pythonResult = pythonResponse.data;
    } catch (axiosError) {
      // Cloudinary pe upload ho gaya tha, clean up karo
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
        type: "authenticated",
      });
      const message =
        axiosError.response?.data?.detail || "Document processing failed";
      return res.status(500).json({ success: false, message });
    }

    const document = await documentModel.create({
      userId,
      filename,
      fileType,
      cloudinaryUrl: asset.secure_url,
      cloudinaryPublicId: publicId,
      chunksStored: pythonResult.chunks_stored,
      pineconeNamespace: pythonResult.namespace,
      uploadDate: today,
    });

    // Redis counter increment — set TTL only on first upload of the day
    // so the upload limit resets at midnight, same as chat credits.
    const redisKey = getDailyUploadKey(userId);
    const newCount = await redis.incr(redisKey);
    if (newCount === 1) {
      await redis.expire(redisKey, getSecondsUntilMidnight());
    }

    return res.status(201).json({
      success: true,
      message: "Document uploaded and processed successfully",
      document: {
        _id: document._id,
        filename: document.filename,
        fileType: document.fileType,
        chunksStored: document.chunksStored,
        createdAt: document.createdAt,
      },
      uploadsRemaining: DAILY_UPLOAD_LIMIT - (uploadCountToday + 1),
    });
  } catch (error) {
    console.error("confirmUpload error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// User ki saari uploaded files list karo
// Frontend pe documents list dikhane ke liye
export const getUserDocuments = async (req, res) => {
  try {
    const userId = req.user.id.toString();

    const documents = await documentModel
      .find({ userId })
      .select("filename fileType chunksStored createdAt")
      .sort({ createdAt: -1 });

    // Daily uploads remaining from Redis
    const uploadCountToday = await getUploadCountToday(userId);

    return res.status(200).json({
      success: true,
      documents,
      uploadsToday: uploadCountToday,
      uploadsRemaining: Math.max(0, DAILY_UPLOAD_LIMIT - uploadCountToday),
    });
  } catch (error) {
    console.error("getUserDocuments error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Ek document ke liye fresh signed URL — "View Document" / chat attachment ke liye
export const getDocumentSignedUrl = async (req, res) => {
  try {
    const userId = req.user.id.toString();
    const { id } = req.params;

    const document = await documentModel.findById(id);
    if (!document || document.userId.toString() !== userId) {
      return res
        .status(404)
        .json({ success: false, message: "Document not found" });
    }

    const resourceType = getResourceType(document.fileType);
    const url = getSignedDeliveryUrl(document.cloudinaryPublicId, resourceType);

    return res.status(200).json({ success: true, url });
  } catch (error) {
    console.error("getDocumentSignedUrl error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
