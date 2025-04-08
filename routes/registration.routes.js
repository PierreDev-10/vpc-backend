const express = require('express');
const router = express.Router();
const { Registration } = require('../models');

// POST /api/register - Create registration
router.post('/', async (req, res) => {
  try {
    console.log("📥 Received POST request with payload:", req.body);

    const registration = await Registration.create(req.body);

    console.log("✅ Successfully saved registration:", registration);
    res.status(201).json({
      message: 'Registration created successfully',
      data: registration,
    });
  } catch (error) {
    console.error('❌ Error creating registration:');
    console.error('🔥 Error Message:', error.message);
    console.error('📌 Full Stack Trace:', error.stack);

    res.status(500).json({
      error: 'Failed to register',
      message: error.message,
      stack: error.stack, // Optional: include full stack for now
    });
  }
});

// GET all registrations
router.get('/', async (req, res) => {
  try {
    const data = await Registration.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch registrations', error: err.message });
  }
});

// GET single registration by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await Registration.findByPk(req.params.id);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: 'Registration not found' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Error fetching registration', error: err.message });
  }
});

module.exports = router;