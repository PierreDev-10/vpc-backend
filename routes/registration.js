// routes/registration.js
const express = require('express');
const router = express.Router();
const { Registration } = require('../models');

// POST /api/register - Save registration data
router.post('/', async (req, res) => {
  try {
    const data = await Registration.create(req.body);
    res.status(201).json({ message: 'Registration successful', data });
  } catch (err) {
    console.error('Error saving registration:', err);
    res.status(500).json({ message: 'Error saving registration', error: err.message });
  }
});

// GET /api/register - Fetch all registrations
router.get('/', async (req, res) => {
  try {
    const data = await Registration.findAll();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch registrations', error: err.message });
  }
});

// GET /api/register/:id - Fetch single registration by ID
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