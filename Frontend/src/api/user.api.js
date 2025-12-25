import api from './axiosClient';

export const getUserProfileData = async (backendUrl, token) => {
  return api.get(`${backendUrl}/api/user/get-profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



// STEP 1: request delete account (OTP send)
export const requestDeleteAccount = async (backendUrl, token) => {
  return api.post(
    `${backendUrl}/api/user/delete-account/request`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// STEP 2: verify OTP & delete account
export const verifyDeleteAccount = async (backendUrl, token, otp) => {
  return api.post(
    `${backendUrl}/api/user/delete-account/verify`,
    { otp },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};



// SIGNUP
export const signupUser = async (backendUrl, name, email, password) => {
  return api.post(
    `${backendUrl}/api/user/signup`,
    { name, email, password }
  );
};

// LOGIN
export const loginUser = async (backendUrl, email, password) => {
  return api.post(
    `${backendUrl}/api/user/login`,
    { email, password }
  );
};

// RESEND EMAIL VERIFICATION
export const resendVerification = async (backendUrl, email) => {
  return api.post(
    `${backendUrl}/api/user/resend-verification`,
    { email }
  );
};

// FORGOT PASSWORD
export const forgotPassword = async (backendUrl, email) => {
  return api.post(
    `${backendUrl}/api/user/forgot-password`,
    { email }
  );
};