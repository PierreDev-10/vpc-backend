// utils/naloSmsService.js
const axios = require('axios');

const sendNaloSMS = async ({ phone, message }) => {
  const payload = {
    key: process.env.NALO_SMS_API_KEY,
    msisdn: phone,
    message,
    sender_id: process.env.NALO_SMS_SENDER_ID || "NALO"
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

module.exports = { sendNaloSMS };