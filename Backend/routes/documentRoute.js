import express from "express";
import {
  getUploadSignature,
  confirmUpload,
  getUserDocuments,
  getDocumentSignedUrl,
} from "../controllers/documentController.js";
import authUser from "../middleware/authUser.js";

const documentRouter = express.Router();

// Step 1 — get signed Cloudinary upload params (client uploads directly to Cloudinary)
documentRouter.post("/upload-signature", authUser, getUploadSignature);

// Step 2 — client uploaded to Cloudinary, now run the RAG ingestion pipeline
documentRouter.post("/confirm-upload", authUser, confirmUpload);

// Get all documents for the logged in user
documentRouter.get("/", authUser, getUserDocuments);

// Fresh signed URL to view/download a private document
documentRouter.get("/:id/signed-url", authUser, getDocumentSignedUrl);

export default documentRouter;
