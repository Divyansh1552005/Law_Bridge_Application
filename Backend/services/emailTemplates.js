export const verifyEmailTemplate = (link) => `
  <h2>Verify your email</h2>
  <p>Please click the link below to verify your account</p>
  <a href="${link}">Verify Email</a>
`;

export const resetPasswordTemplate = (link) => `
  <h2>Reset Password</h2>
  <p>Click below to reset your password</p>
  <a href="${link}">Reset Password</a>
`;
