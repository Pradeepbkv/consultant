const express = require('express');
const router = express.Router();
const db = require('../models/db');

// POST testimonial
router.post('/', async (req, res) => {
  const { name, feedback, image } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO testimonials (name, feedback, image) VALUES ($1, $2, $3) RETURNING id',
      [name, feedback, image]
    );

    res.status(201).json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Error saving testimonial:", err);
    res.status(500).json({ error: 'Failed to save testimonial' });
  }
});

// GET latest 3 testimonials
router.get('/latest', async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, feedback, image FROM testimonials ORDER BY submitted_on DESC LIMIT 3'
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching testimonials:", err);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});
module.exports = router;
