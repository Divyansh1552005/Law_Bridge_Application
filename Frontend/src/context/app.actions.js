import { toast } from "react-toastify";
import { getLawyersData as fetchLawyersAPI } from "../api/lawyer.api";
import { getUserProfileData } from "../api/user.api";
import { createChat, getChatBySession } from "../api/chat.api";
import {
  getUploadSignature,
  confirmUpload,
  getUserDocuments,
} from "../api/document.api";
import { uploadToCloudinaryDirect } from "../utils/directCloudinaryUpload";

export const appActions = ({
  setLawyers,
  setUserData,
  setSessionId,
  setCurrentSession,
  setUserDocuments,
  setUploadsRemaining,
  setUploadingDocument,
}) => ({
  // Lawyers related
  getLawyersData: async () => {
    try {
      const { data } = await fetchLawyersAPI();
      if (data.success) setLawyers(data.lawyers);
      else toast.error(data.message);
    } catch (err) {
      // console.error(err);
    }
  },

  // Users
  loadUserProfileData: async () => {
    try {
      const { data } = await getUserProfileData();
      if (data.success) setUserData(data.user);
      else toast.error(data.message);
    } catch (err) {
      // console.error(err);
    }
  },

  // Chat
  createNewChat: async () => {
    const session = crypto.randomUUID();

    setSessionId(session);

    try {
      const { data } = await createChat(session);

      if (!data.success) {
        toast.error(data.message);
        return null;
      }

      setCurrentSession({
        sessionId: session,
        messages: [],
        _id: data.chatId,
      });

      return session;
    } catch (err) {
      toast.error("Error creating chat");
      // console.error(err);
      return null;
    }
  },

  fetchUserChats: async (targetSessionId) => {
    if (!targetSessionId) return;

    try {
      const { data } = await getChatBySession(targetSessionId);

      if (data.success) {
        setCurrentSession(data.chats);
        return data.chats;
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      // console.error(err);
    }
  },

  // document related
  loadUserDocuments: async () => {
    try {
      const { data } = await getUserDocuments();
      if (data.success) {
        setUserDocuments(data.documents);
        setUploadsRemaining(data.uploadsRemaining);
      }
    } catch (err) {
      // silently fail
    }
  },

  uploadDocument: async (file) => {
    try {
      setUploadingDocument(true);

      const { data: signature } = await getUploadSignature(file);
      if (!signature.success) {
        toast.error(signature.message || "Document upload failed");
        return null;
      }

      const cloudinaryResult = await uploadToCloudinaryDirect(
        file,
        signature,
      );

      const { data } = await confirmUpload({
        publicId: cloudinaryResult.public_id,
        resourceType: signature.resourceType,
        filename: file.name,
        fileType: signature.fileType,
      });

      if (data.success) {
        setUserDocuments((prev) => [data.document, ...prev]);
        setUploadsRemaining(data.uploadsRemaining);
        toast.success(`"${data.document.filename}" uploaded successfully`);
        return data;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Document upload failed");
      return null;
    } finally {
      setUploadingDocument(false);
    }
  },
});
