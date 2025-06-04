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

module.exports = { sendNaloEmail };