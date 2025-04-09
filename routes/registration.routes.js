const express = require('express');
const router = express.Router();
const { Registration } = require('../models');

// POST /api/register - Create or Reject Duplicates
router.post('/', async (req, res) => {
  try {
    const existing = await Registration.findOne({ where: { email: req.body.email } });

    if (existing) {
      return res.status(409).json({
        error: 'Duplicate',
        message: 'Registration already exists with this email',
      });
    }

    const registration = await Registration.create(req.body);
    return res.status(201).json({
      message: 'Registration created successfully',
      data: registration,
    });

  } catch (error) {
    console.error('❌ Error creating registration:', error);
    res.status(500).json({
      error: 'Failed to register',
      message: error.message,
      stack: error.stack,
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
// Check if registration exists
router.get('/check', async (req, res) => {
  try {
    const { email } = req.query;
    const record = await Registration.findOne({ where: { email } });
    if (record) return res.status(200).json(record);
    res.status(404).json({ message: 'Not registered' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to check registration' });
  }
});

// Update route
router.post('/update', async (req, res) => {
  try {
    const { email } = req.body;
    const updated = await Registration.update(req.body, {
      where: { email }
    });
    res.status(200).json({ message: 'Updated successfully', updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

module.exports = router;