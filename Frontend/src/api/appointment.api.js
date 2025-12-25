import api from './axiosClient';

// GET user appointments
export const getUserAppointments = async (backendUrl, token) => {
  return api.get(`${backendUrl}/api/user/appointments`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

// CANCEL appointment
export const cancelAppointment = async (
  backendUrl,
  token,
  appointmentId
) => {
  return api.post(
    `${backendUrl}/api/user/cancel-appointment`,
    { appointmentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// BOOK APPOINTMENTS
export const bookAppointment = async (
  backendUrl,
  token,
  lawyerId,
  slotDate,
  slotTime
) => {
  return api.post(
    `${backendUrl}/api/user/book-appointment`,
    { lawyerId, slotDate, slotTime },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
