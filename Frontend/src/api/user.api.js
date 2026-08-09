import api from "./axiosClient";

// get user profile
export const getUserProfileData = async () => {
  return api.get("/api/user/get-profile");
};

// delete account (request OTP)
export const requestDeleteAccount = async () => {
  return api.post("/api/user/delete-account/request");
};

// delete account (verify OTP)
export const verifyDeleteAccount = async (otp) => {
  return api.post("/api/user/delete-account/verify", { otp });
};

// signup
export const signupUser = async (name, email, password, turnstileToken) => {
  return api.post("/api/user/signup", { name, email, password, turnstileToken });
};

// google login
export const loginWithGoogle = () => {
  const baseUrl = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "");
  window.location.href = `${baseUrl}/api/user/google`;
};

// login
export const loginUser = async (payload, turnstileToken) => {
  return api.post("/api/user/login", { ...payload, turnstileToken });
};

// resend verification email
export const resendVerification = async (email) => {
  return api.post("/api/user/resend-verification", { email });
};

// forgot password
export const forgotPassword = async (email, turnstileToken) => {
  return api.post("/api/user/forgot-password", { email, turnstileToken });
};

// signed Cloudinary params for the profile-picture direct upload
export const getUserUploadSignature = async () => {
  return api.post("/api/user/upload-signature");
};

// update profile
export const updateUserProfile = async (payload) => {
  return api.patch("/api/user/update-profile", payload);
};

// reset password
export const resetPassword = async (resetToken, password, turnstileToken) => {
  return api.post(`/api/user/reset-password/${resetToken}`, {
    password,
    turnstileToken,
  });
};

// verify email
export const verifyUserEmail = async (verificationToken) => {
  return api.get(`/api/user/verify-email/${verificationToken}`);
};

// for 2fa

export const setup2FA = () => {
  return api.post("/api/user/2fa/setup");
};

export const verify2FA = (code) => {
  return api.post("/api/user/2fa/verify", { code });
};

export const disable2FA = (payload) => {
  return api.post("/api/user/2fa/disable", payload);
};

// Magic link for login
export const requestMagicLink = async (email, turnstileToken) => {
  return api.post("/api/user/magic-link", { email, turnstileToken });
};

export const verifyMagicLink = async (token) => {
  return api.get(`/api/user/verify-magic-link/${token}`);
};

export const verifyMagicLink2FA = async (token, twoFactorCode) => {
  return api.post(`/api/user/verify-magic-link/${token}`, { twoFactorCode });
};
