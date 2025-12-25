import api from './axiosClient';

// GET VIDEO TOKEN
export const getVideoToken = async (backendUrl, token, appointmentId) => {
  return api.post(
    `${backendUrl}/api/video/get-token`,
    { appointmentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// JOIN VIDEO CALL
export const joinVideoCall = async (backendUrl, token, appointmentId) => {
  return api.post(
    `${backendUrl}/api/video/update-status`,
    { appointmentId, action: 'join' },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// LEAVE VIDEO CALL
export const leaveVideoCall = async (backendUrl, token, appointmentId) => {
  return api.post(
    `${backendUrl}/api/video/update-status`,
    { appointmentId, action: 'leave' },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
