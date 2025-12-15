export const verifyEmailTemplate = (link) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4a51cc 0%, #5f6FFF 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                LawBridge
              </h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Your Legal Support Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Verify Your Email Address
              </h2>
              <p style="margin: 0 0 25px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Thank you for joining LawBridge. To complete your registration and access all features, please verify your email address by clicking the button below.
              </p>
              
              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #4a51cc 0%, #5f6FFF 100%);">
                    <a href="${link}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 10px 0 0 0; word-break: break-all;">
                <a href="${link}" style="color: #5f6FFF; text-decoration: none; font-size: 14px;">${link}</a>
              </p>
              
              <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                  If you didn't create a LawBridge account, please ignore this email or contact our support team if you have concerns.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                © ${new Date().getFullYear()} LawBridge. All rights reserved.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Reducing the gap between People and the Law
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const resetPasswordTemplate = (link) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4a51cc 0%, #5f6FFF 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                LawBridge
              </h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Your Legal Support Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Reset Your Password
              </h2>
              <p style="margin: 0 0 25px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                We received a request to reset the password for your LawBridge account. Click the button below to create a new password.
              </p>
              
              <!-- Security Notice -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  <strong>Security Notice:</strong> This link will expire in 15 minutes for your protection.
                </p>
              </div>
              
              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #4a51cc 0%, #5f6FFF 100%);">
                    <a href="${link}" style="display: inline-block; padding: 16px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 25px 0 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin: 10px 0 0 0; word-break: break-all;">
                <a href="${link}" style="color: #5f6FFF; text-decoration: none; font-size: 14px;">${link}</a>
              </p>
              
              <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                  If you didn't request a password reset, please ignore this email or contact our support team immediately if you believe your account security is at risk.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                © ${new Date().getFullYear()} LawBridge. All rights reserved.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Reducing the gap between People and the Law
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const deleteAccountOtpTemplate = (otp) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delete Account Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #4a51cc 0%, #5f6FFF 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600; letter-spacing: 0.5px;">
                LawBridge
              </h1>
              <p style="margin: 8px 0 0 0; color: #e0e7ff; font-size: 14px;">Your Legal Support Platform</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="margin: 0 0 20px 0; color: #1e293b; font-size: 24px; font-weight: 600;">
                Account Deletion Verification
              </h2>
              <p style="margin: 0 0 25px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                We received a request to delete your LawBridge account. To confirm this action, please use the verification code below.
              </p>
              
              <!-- Warning Notice -->
              <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 16px 20px; margin: 25px 0; border-radius: 4px;">
                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.5;">
                  <strong>Warning:</strong> This action is permanent and cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
              
              <!-- OTP Code -->
              <div style="text-align: center; margin: 40px 0;">
                <p style="margin: 0 0 15px 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px;">
                  Your Verification Code
                </p>
                <div style="display: inline-block; background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 20px 40px; border-radius: 8px; border: 2px dashed #9ca3af;">
                  <p style="margin: 0; font-size: 36px; font-weight: 700; color: #1e293b; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${otp}
                  </p>
                </div>
                <p style="margin: 15px 0 0 0; color: #64748b; font-size: 13px;">
                  This code will expire in 10 minutes
                </p>
              </div>
              
              <div style="background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 30px 0;">
                <p style="margin: 0 0 12px 0; color: #1e293b; font-size: 15px; font-weight: 600;">
                  Before you proceed:
                </p>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                  <li>All your account data will be permanently deleted</li>
                  <li>Your appointments and consultations will be cancelled</li>
                  <li>You will lose access to all documents and records</li>
                  <li>This action cannot be reversed</li>
                </ul>
              </div>
              
              <div style="margin-top: 35px; padding-top: 25px; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.5;">
                  If you didn't request to delete your account, please ignore this email and contact our support team immediately. Your account will remain active.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                © ${new Date().getFullYear()} LawBridge. All rights reserved.
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                Reducing the gap between People and the Law
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;