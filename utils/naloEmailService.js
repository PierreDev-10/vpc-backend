// utils/naloEmailService.js
const axios = require('axios');

/**
 * Sends a general email using Nalo Email API.
 */
const sendNaloEmail = async ({ to, subject, body }) => {
  const payload = {
    key: process.env.NALO_EMAIL_API_KEY,
    emailTo: [to],
    emailFrom: process.env.NALO_EMAIL_FROM,
    emailBody: body,
    senderName: process.env.NALO_SENDER_NAME || "VPC Coin",
    subject: subject,
    callBackUrl: ""
  };

  try {
    const response = await axios.post(
      'https://email.nalosolutions.com/smsbackend/clientapi/Nal_resl/send-email/',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );
    console.log('✅ Nalo email sent:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Nalo email error:', error.response?.data || error.message);
    return false;
  }
};

/**
 * Sends an OTP email with proper formatting.
 */
const sendOTPEmail = async (email, otp) => {
  const subject = 'VPC Coin Registration';
  const body = `Your OTP for VPC Coin registration is ${otp}`;
  return await sendNaloEmail({ to: email, subject, body });
};

/**
 * Sends a password reset email.
 */
const sendResetEmail = async (email, link) => {
  const subject = 'VPC Coin Password Reset';
  const body = `Click the link below to reset your VPC Coin password:\n\n${link}\n\nIf you did not request this, please ignore this message.`;
  return await sendNaloEmail({ to: email, subject, body });
};

module.exports = { sendOTPEmail, sendResetEmail };