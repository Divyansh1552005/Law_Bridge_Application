import api from "./axiosClient";

export const getUploadSignature = async (file) => {
  return api.post("/api/documents/upload-signature", {
    filename: file.name,
    mimetype: file.type,
    size: file.size,
  });
};

export const confirmUpload = async ({
  publicId,
  resourceType,
  filename,
  fileType,
}) => {
  return api.post("/api/documents/confirm-upload", {
    publicId,
    resourceType,
    filename,
    fileType,
  });
};

export const getUserDocuments = async () => {
  return api.get("/api/documents/");
};

export const getDocumentSignedUrl = async (documentId) => {
  return api.get(`/api/documents/${documentId}/signed-url`);
};
