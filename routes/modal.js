const express = require('express');
const router = express.Router();
const db = require('../models/db');

// POST from modal form
router.post('/', async (req, res) => {
  const { name, email, phone, service } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO modal_quotes (name, email, phone, service) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, phone, service]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Error saving quote:", err);
    res.status(500).json({ error: "Failed to save quote" });
  }
});

// GET for admin panel
router.get('/current-month', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, name, email, phone, service, submitted_on
      FROM modal_quotes
      WHERE DATE_TRUNC('month', submitted_on) = DATE_TRUNC('month', CURRENT_DATE)
      ORDER BY submitted_on DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching modal data:", err);
    res.status(500).json({ error: "Failed to fetch modal data" });
  }
});

module.exports = router;

