import api from './axiosClient';

// CREATE Razorpay order / initiate payment
export const createRazorpayPayment = async (
  backendUrl,
  token,
  appointmentId
) => {
  return api.post(
    `${backendUrl}/api/user/payment-razorpay`,
    { appointmentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// VERIFY Razorpay payment
export const verifyRazorpayPayment = async (
  backendUrl,
  token,
  response
) => {
  return api.post(
    `${backendUrl}/api/user/verify-razorpay`,
    response,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
