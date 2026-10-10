/**
 * Go Orbit Email Service
 * Handles transactional emails, security verification OTPs, and notifications
 * Uses Nodemailer with SMTP / Gmail App Password support
 */

const nodemailer = require('nodemailer');

let cachedTransporter = null;

/**
 * Creates or retrieves the configured mail transporter
 */
async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const service = process.env.SMTP_SERVICE;
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  // 1. If SMTP credentials are provided, use them
  if (user && pass) {
    if (service === 'gmail' || (!host && user.toLowerCase().endsWith('@gmail.com'))) {
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
      console.log(`[Go Orbit Email] Configured Gmail SMTP transport with account: ${user}`);
      return cachedTransporter;
    }

    cachedTransporter = nodemailer.createTransport({
      host: host || 'smtp.gmail.com',
      port,
      secure,
      auth: { user, pass }
    });
    console.log(`[Go Orbit Email] Configured custom SMTP transport (${host}:${port}) with user: ${user}`);
    return cachedTransporter;
  }

  // 2. Fallback in development when no SMTP is configured in .env yet
  console.warn('[Go Orbit Email] Notice: SMTP credentials (SMTP_USER & SMTP_PASS) not set in .env.');
  console.warn('[Go Orbit Email] Attempting Ethereal test mail transport for safe offline testing...');

  try {
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('[Go Orbit Email] Ethereal test inbox connected successfully.');
    return cachedTransporter;
  } catch (err) {
    console.warn('[Go Orbit Email] Could not connect to Ethereal. Using mock stream transporter.');
    cachedTransporter = nodemailer.createTransport({
      streamTransport: true,
      newline: 'windows'
    });
    return cachedTransporter;
  }
}

/**
 * Generates branded HTML template for the 6-digit OTP verification email
 */
function generateOTPEmailHtml({ recipientName, otp }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Go Orbit Security Verification Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #1d4ed8 0%, #4338ca 100%); padding: 36px 32px; text-align: center;">
              <h1 style="color: #ffffff; font-size: 28px; font-weight: 800; margin: 0; letter-spacing: -0.5px;">Go Orbit</h1>
              <p style="color: #bfdbfe; font-size: 13px; font-weight: 600; margin: 6px 0 0; letter-spacing: 0.5px; text-transform: uppercase;">Travel & Tour Platform</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 16px;">Identity Verification Code</h2>
              
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 18px;">
                Hello <strong>${recipientName || 'Traveler'}</strong>,
              </p>
              
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
                We received a request to verify your identity and reset your password for your Go Orbit account. Please enter the following 6-digit verification code to proceed:
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <div style="background-color: #eff6ff; border: 2px dashed #3b82f6; border-radius: 14px; padding: 20px 32px; display: inline-block;">
                      <span style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #1d4ed8; display: block;">${otp}</span>
                    </div>
                    <p style="color: #64748b; font-size: 12px; font-weight: 600; margin: 10px 0 0;">
                      ⏱ This code is valid for <strong>10 minutes</strong> and can only be used once.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Warning Box -->
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 8px; padding: 14px 18px; margin: 28px 0 0;">
                <p style="color: #991b1b; font-size: 12px; line-height: 1.5; margin: 0; font-weight: 500;">
                  <strong>Important Security Notice:</strong> Go Orbit will never ask for your verification code via phone, chat, or social media. If you did not initiate this password reset request, someone may be trying to access your account without authorization. Your account remains completely safe and cannot be modified without this code.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                This is an automated security email from Go Orbit. Please do not reply directly to this message.
              </p>
              <p style="color: #cbd5e1; font-size: 11px; margin: 8px 0 0;">
                © ${new Date().getFullYear()} Go Orbit Technologies & Travels. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Sends the 6-digit OTP verification email directly to the recipient's address
 *
 * @param {string} toEmail - Target user email address
 * @param {string} recipientName - User's display name
 * @param {string} otp - 6-digit cryptographic verification code
 * @returns {Promise<{success: boolean, messageId?: string, previewUrl?: string, error?: string}>}
 */
async function sendPasswordResetOTP(toEmail, recipientName, otp) {
  try {
    const transporter = await getTransporter();
    const fromAddress = process.env.EMAIL_FROM || (process.env.SMTP_USER ? `"Go Orbit Security" <${process.env.SMTP_USER}>` : '"Go Orbit Security" <security@goorbit.com>');

    const mailOptions = {
      from: fromAddress,
      to: toEmail,
      subject: `Your Go Orbit Verification Code: ${otp}`,
      text: `Hello ${recipientName || 'Traveler'},\n\nYour Go Orbit password reset verification code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this code, you can safely ignore this email.\n\nGo Orbit Security Team`,
      html: generateOTPEmailHtml({ recipientName, otp })
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`[Go Orbit Email] Dispatched security verification email to ${toEmail} (Message ID: ${info.messageId})`);

    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[Go Orbit Email] Development Ethereal Inbox Preview: ${previewUrl}`);
    }

    return {
      success: true,
      messageId: info.messageId,
      previewUrl
    };
  } catch (error) {
    console.error(`[Go Orbit Email] Error sending verification email to ${toEmail}:`, error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  sendPasswordResetOTP,
  getTransporter
};
