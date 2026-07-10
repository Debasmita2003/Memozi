const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all bookmarks
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM bookmarks ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add bookmark
router.post("/", async (req, res) => {
  try {
    const { title, url } = req.body;

    const result = await pool.query(
      "INSERT INTO bookmarks (title, url) VALUES ($1, $2) RETURNING *",
      [title, url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete bookmark
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM bookmarks WHERE id = $1",
      [req.params.id]
    );

    res.json({ message: "Bookmark deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;