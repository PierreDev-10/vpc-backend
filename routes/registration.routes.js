const express = require('express');
const router = express.Router();
const db = require('../models');
const { Registration } = require('../models'); // ✅ Add this line

/// POST /api/register
 router.post('/', async (req, res) => {
   try {
     const registration = await db.Registration.create(req.body);
     res.status(201).json({
       message: 'Registration created successfully',
       registration,
     });
   } catch (error) {
     console.error('Error creating registration:', error); // 👈 helpful for debugging
     res.status(500).json({ error: 'Failed to register' });
   }
 });

// POST new registration
router.post('/', async (req, res) => {
  try {
    const newRegistration = await db.Registration.create(req.body);
    res.status(201).json(newRegistration);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create registration' });
  }
});

module.exports = router;