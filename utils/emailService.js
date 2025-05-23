// utils/emailService.js

const formData = require('form-data');
const Mailgun = require('mailgun.js');
require('dotenv').config();

const mailgun = new Mailgun(formData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY,
});

const sendOTPEmail = async (to, otp) => {
  try {
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