// utils/naloSmsService.js
const axios = require('axios');

/**
 * Sends an SMS OTP via Nalo Solutions API.
 * @param {string} phone - Recipient's phone number (e.g., '233XXXXXXXXX').
 * @param {string} otp - The OTP code to send.
 * @returns {Promise<boolean>} - Returns true if successful, otherwise false.
 */
const sendOTPSMS = async (phone, otp) => {
  const payload = {
    key: process.env.NALO_SMS_API_KEY,
    msisdn: phone,
    message: `Your VPC verification code is: ${otp}`,
    sender_id: process.env.NALO_SMS_SENDER_ID || "VPC"
  };

  try {
    const response = await axios.post(
      'https://sms.nalosolutions.com/smsbackend/Resl_Nalo/send-message/',
      payload,
      { headers: { 'Content-Type': 'application/json' } }
    );

    console.log('✅ Nalo SMS sent:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Nalo SMS error:', error.response?.data || error.message);
    return false;
  }
};

module.exports = { sendOTPSMS };