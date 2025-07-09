const express = require('express');
const router = express.Router();
const db = require('../models/db'); // adjust path if needed

// POST - Create new blog post
router.post('/', async (req, res) => {
  const { title, excerpt, content, image_url, author } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO blogs (title, excerpt, content, image_url, author) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, excerpt, content, image_url, author]
    );
    res.json({ success: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Error saving blog:", err);
    res.status(500).json({ error: "Failed to save blog" });
  }
});

// GET - Latest 3 blog posts
router.get('/latest', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, excerpt, image_url FROM blogs ORDER BY posted_on DESC LIMIT 3`
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching latest blogs:", err);
    res.status(500).json({ error: "Failed to fetch latest blogs" });
  }
});

// GET - Single blog post by ID
router.get('/:id', async (req, res) => {
  const blogId = req.params.id;

  try {
    const result = await db.query('SELECT * FROM blogs WHERE id = $1', [blogId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching blog post:", err);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

module.exports = router;
