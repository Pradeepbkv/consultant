const express = require('express');
const router = express.Router();
const db = require('../models/db'); // adjust path if different


router.post('/', async (req, res) => {
  const { title, excerpt, content, image_url, author } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO blogs (title, excerpt, content, image_url, author) VALUES (?, ?, ?, ?, ?)",
      [title, excerpt, content, image_url, author]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: "Failed to save blog" });
  }
});

module.exports = router;

router.get('/latest', async (req, res) => {
  const [rows] = await db.query(`
    SELECT id, title, excerpt, image_url
    FROM blogs
    ORDER BY posted_on DESC
    LIMIT 3
  `);
  res.json(rows);
});

// Get single blog post by ID
router.get('/:id', async (req, res) => {
  const blogId = req.params.id;
  try {
    const [rows] = await db.query('SELECT * FROM blogs WHERE id = ?', [blogId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error("Error fetching blog post:", err);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

