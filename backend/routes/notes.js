const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// =======================================
// Get all notes for a user
// =======================================

router.get("/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM notes
       WHERE user_id = $1
       ORDER BY pinned DESC, created_at DESC`,
      [req.params.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// =======================================
// Add a new note
// =======================================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      content,
      titleColor,
      contentColor,
      pinned,
      userId,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO notes
      (title, content, title_color, content_color, pinned, user_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        title,
        content,
        titleColor || "#ffffff",
        contentColor || "#d1d5db",
        pinned || false,
        userId,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// =======================================
// Update note
// =======================================

router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      content,
      titleColor,
      contentColor,
      pinned,
      userId,
    } = req.body;

    const result = await pool.query(
      `UPDATE notes
       SET
         title = $1,
         content = $2,
         title_color = $3,
         content_color = $4,
         pinned = $5,
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $6
       AND user_id = $7
       RETURNING *`,
      [
        title,
        content,
        titleColor,
        contentColor,
        pinned,
        req.params.id,
        userId,
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

// =======================================
// Delete note
// =======================================

router.delete("/:id/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM notes
       WHERE id = $1
       AND user_id = $2
       RETURNING *`,
      [req.params.id, req.params.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Note not found",
      });
    }

    res.json({
      message: "Note deleted",
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;