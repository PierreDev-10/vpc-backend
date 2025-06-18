// utils/naloEmailService.js
const axios = require('axios');

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

// 🔐 Send OTP Email
const sendOTPEmail = async (email, otp) => {
  const body = `Your OTP for VPC Coin registration is: ${otp}`;
  const subject = 'VPC Coin OTP Verification';
  return await sendNaloEmail({ to: email, subject, body });
};

// 🔁 Send Reset Link Email
const sendResetEmail = async (email, link) => {
  const body = `Click the link below to reset your VPC Coin password:\n\n${link}\n\nIf you did not request this, please ignore this message.`;
  const subject = 'VPC Coin Password Reset';
  return await sendNaloEmail({ to: email, subject, body });
};

module.exports = { sendOTPEmail, sendResetEmail };