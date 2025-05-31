// utils/emailService.js

const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
  url: 'https://api.mailgun.net', // only change if you're on EU region
});

const sendOTPEmail = async (to, otp) => {
  try {
    // ✅ Debug logs added to verify env variables
    console.log("KEY:", process.env.MAILGUN_API_KEY);
    console.log("DOMAIN:", process.env.MAILGUN_DOMAIN);
    console.log("FROM:", process.env.EMAIL_FROM);

    const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Your VPC Coin OTP Code',
      text: `Your One-Time Password (OTP) is: ${otp}`,
      html: `<p>Your One-Time Password (OTP) is: <strong>${otp}</strong></p>`,
    });

    console.log('✅ Mailgun email sent:', response.id);
    return true;
  } catch (err) {
    console.error('❌ Mailgun send error:', err.message);
    return false;
  }
};

module.exports = { sendOTPEmail };