const express = require('express');
const router = express.Router();
const db = require('../models/db');

router.post('/', async (req, res) => {
  const { name, feedback, image_url } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO testimonials (name, feedback, image_url) VALUES (?, ?, ?)",
      [name, feedback, image_url]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to save testimonial" });
  }
});

module.exports = router;

router.get('/latest', async (req, res) => {
  const [rows] = await db.query(`
    SELECT name, feedback, image_url
    FROM testimonials
    ORDER BY submitted_on DESC
    LIMIT 3
  `);
  res.json(rows);
});

