// routes/user.routes.js

const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { User } = require('../models'); // Make sure models/index.js includes User

console.log('✅ user.routes.js has been loaded');

// ✅ Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, password, phone, email, auth_method } = req.body;

    // Basic validation
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

// ✅ Password reset (must be securely connected with identity verification)
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

// ✅ Add this to routes/user.routes.js

router.post('/verify', async (req, res) => {
  try {
    const { username, phone } = req.body;

    if (!username || !phone) {
      return res.status(400).json({ message: 'Username and phone are required.' });
    }

    const user = await User.findOne({
      where: {
        username: username.toUpperCase(),
        phone: phone
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

module.exports = router;