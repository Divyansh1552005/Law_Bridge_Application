import api from './axiosClient';

export const createChat = async (backendUrl, token, sessionId) => {
  return api.post(
    `${backendUrl}/api/chat/create`,
    { sessionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getChatBySession = async (backendUrl, token, sessionId) => {
  return api.get(`${backendUrl}/api/chat/get/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
