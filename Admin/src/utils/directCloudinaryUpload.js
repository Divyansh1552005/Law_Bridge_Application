// Uploads a file straight from the browser to Cloudinary using
// backend-issued signed params — file bytes never touch our server.
export async function uploadToCloudinaryDirect(file, signature) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", signature.apiKey);
  formData.append("timestamp", signature.timestamp);
  formData.append("signature", signature.signature);
  formData.append("folder", signature.folder);
  formData.append("public_id", signature.public_id);
  if (signature.type) formData.append("type", signature.type);
  if (signature.allowed_formats)
    formData.append("allowed_formats", signature.allowed_formats);

  const uploadUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${signature.resourceType}/upload`;

  const res = await fetch(uploadUrl, { method: "POST", body: formData });
  if (!res.ok) {
    throw new Error("Upload to Cloudinary failed");
  }
  return res.json(); // { secure_url, public_id, bytes, ... }
}
