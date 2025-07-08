const express = require('express');
const router = express.Router();
const db = require('../models/db');

// POST from modal form
router.post('/', async (req, res) => {
  const { name, email, phone, service } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO modal_quotes (name, email, phone, service) VALUES (?, ?, ?, ?)",
      [name, email, phone, service]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("Error saving quote:", err);
    res.status(500).json({ error: "Failed to save quote" });
  }
});

// GET for admin panel
router.get('/current-month', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT id, name, email, phone, service, submitted_on
      FROM modal_quotes
      WHERE MONTH(submitted_on) = MONTH(CURRENT_DATE())
        AND YEAR(submitted_on) = YEAR(CURRENT_DATE())
      ORDER BY submitted_on DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching modal data:", err);
    res.status(500).json({ error: "Failed to fetch modal data" });
  }
});

module.exports = router;
