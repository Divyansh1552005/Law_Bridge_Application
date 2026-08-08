import { v2 as cloudinary } from "cloudinary";

// Signed params for a direct browser -> Cloudinary upload.
// Backend never sees the file bytes; it only controls what gets signed
// (folder, public_id, type, etc.) so the client can't upload wherever it wants.
export const signUploadParams = (paramsToSign) => {
  const timestamp = Math.round(Date.now() / 1000);
  const params = { timestamp, ...paramsToSign };
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_SECRET_KEY,
  );

  return {
    ...params,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_NAME,
  };
};

// Fresh, short-lived signed URL to read a private ("authenticated") Cloudinary asset.
export const getSignedDeliveryUrl = (
  publicId,
  resourceType,
  expiresInSeconds = 300,
) =>
  cloudinary.utils.private_download_url(publicId, null, {
    resource_type: resourceType,
    type: "authenticated",
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
  });

export const getResourceType = (fileType) =>
  ["pdf", "docx", "txt"].includes(fileType) ? "raw" : "image";
