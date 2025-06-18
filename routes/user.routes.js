// routes/user.routes.js

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { User } = require('../models');
const crypto = require('crypto');
const { sendOTPEmail, sendResetEmail } = require('../utils/naloEmailService');
const { sendOTPSMS } = require('../utils/naloSmsService');

console.log('✅ user.routes.js has been loaded');

const emailOtps = {}; // { email: { otp, expires } }
const phoneOtps = {}; // { phone: { otp, expires } }
const resetTokens = {}; // { token: { userId, expires } }

// ✅ Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, phone, email, auth_method } = req.body;

    if (!username || !password || !auth_method) {
      return res.status(400).json({ message: 'Missing required fields.' });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { phone }, { email }]
      }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const newUser = await User.create({
      username,
      password,
      phone,
      email,
      auth_method
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    console.error('❌ Error registering user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Login with username and password
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// ✅ Check if username exists
router.get('/check', async (req, res) => {
  try {
    const { username } = req.query;

    const exists = await User.findOne({ where: { username } });
    if (exists) {
      return res.status(200).json({ exists: true });
    }

    res.status(404).json({ exists: false });
  } catch (err) {
    res.status(500).json({ message: 'Error checking username' });
  }
});

// ✅ Password reset (after verification)
router.post('/reset', async (req, res) => {
  try {
    const { username, newPassword } = req.body;

    const updated = await User.update(
      { password: newPassword },
      { where: { username } }
    );

    if (updated[0] === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ message: 'Error resetting password' });
  }
});

// ✅ Get user info by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// ✅ Verify user identity by username and phone
router.post('/verify', async (req, res) => {
  try {
    const { username, phone } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: 'Username and phone are required.' });
    }

    const user = await User.findOne({
      where: {
        username: username.toUpperCase(),
        phone
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found with provided credentials.' });
    }

    res.status(200).json({ verified: true });
  } catch (err) {
    console.error('❌ Error verifying user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// ✅ Send OTP to email via Nalo
router.post('/send-email-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required.' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  emailOtps[email] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000
  };

  const success = await sendOTPEmail(email, otp);
  if (!success) {
    return res.status(500).json({ message: 'Failed to send OTP. Try again later.' });
  }

  res.status(200).json({ message: 'OTP sent to email.' });
});

// ✅ Send OTP to phone via Nalo
router.post('/send-sms-otp', async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required.' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  phoneOtps[phone] = {
    otp,
    expires: Date.now() + 5 * 60 * 1000,
  };

  try {
    console.log(`📤 Attempting to send OTP ${otp} to phone: ${phone}`);
    const success = await sendOTPSMS(phone, otp);

    if (!success) {
      console.error(`❌ Failed to send OTP via SMS to ${phone}`);
      return res.status(500).json({ message: 'Failed to send OTP via SMS. Try again later.' });
    }

    console.log(`✅ OTP sent successfully via SMS to ${phone}`);
    res.status(200).json({ message: 'OTP sent via SMS.' });
  } catch (error) {
    console.error('❌ Exception during SMS sending:', error);
    res.status(500).json({ message: 'An unexpected error occurred while sending SMS.' });
  }
});

// ✅ Verify email OTP
router.post('/verify-email-otp', async (req, res) => {
  const { email, otp } = req.body;

  const record = emailOtps[email];
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  delete emailOtps[email];
  res.status(200).json({ verified: true });
});

// ✅ Verify phone OTP
router.post('/verify-sms-otp', async (req, res) => {
  const { phone, otp } = req.body;

  const record = phoneOtps[phone];
  if (!record || record.otp !== otp || record.expires < Date.now()) {
    return res.status(400).json({ message: 'Invalid or expired OTP.' });
  }

  delete phoneOtps[phone];
  res.status(200).json({ verified: true });
});

// ✅ Send reset link to email
router.post('/send-reset-link', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    resetTokens[token] = {
      userId: user.id,
      expires: Date.now() + 3600 * 1000
    };

    const resetLink = `https://vpc-frontend.com/reset-password?token=${token}`;
    const emailSent = await sendResetEmail(email, resetLink);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to send reset link' });
    }

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('❌ Reset link error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;