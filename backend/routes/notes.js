const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// Get all notes
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM notes ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Add a new note
router.post("/", async (req, res) => {
  try {
    const {
      title,
      content,
      titleColor,
      contentColor,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO notes
      (title, content, title_color, content_color)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [
        title,
        content,
        titleColor || "#ffffff",
        contentColor || "#d1d5db",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Update a note
router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      content,
      titleColor,
      contentColor,
    } = req.body;

    const result = await pool.query(
      `UPDATE notes
       SET
         title = $1,
         content = $2,
         title_color = $3,
         content_color = $4,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [
        title,
        content,
        titleColor,
        contentColor,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// Delete a note
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM notes WHERE id = $1",
      [req.params.id]
    );

    res.json({
      message: "Note deleted",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;