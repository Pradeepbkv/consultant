const express = require('express');
const router = express.Router();
const db = require('../models/db'); // adjust path if needed

router.post('/', async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO contacts (name, email, phone, message) VALUES (?, ?, ?, ?)",
      [name, email, phone, message]
    );
    res.status(201).json({ success: true, id: result.insertId });
  } catch (err) {
    console.error("❌ Error saving contact:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;


// GET /api/contact/monthly
router.get('/monthly', async (req, res) => {
  try {
    const [rows] = await db.query(`
  SELECT * FROM contacts
WHERE MONTH(submitted_on) = MONTH(CURRENT_DATE())
  AND YEAR(submitted_on) = YEAR(CURRENT_DATE())
ORDER BY submitted_on DESC;
`);


   const grouped = rows.reduce((acc, row) => {
  const month = new Date(row.submitted_on).toISOString().slice(0, 7); // "YYYY-MM"
  if (!acc[month]) acc[month] = [];
  acc[month].push(row);
  return acc;
}, {});


    res.json(grouped);
  } catch (err) {
    console.error("❌ Error fetching contacts:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

