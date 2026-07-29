const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ======================================
// GET NOTES INSIDE COLLECTION
// ======================================

router.get("/:collectionId/notes", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT n.*
      FROM notes n
      INNER JOIN collection_notes cn
      ON n.id = cn.note_id
      WHERE cn.collection_id = $1
      ORDER BY n.pinned DESC, n.created_at DESC
      `,
      [req.params.collectionId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

// ======================================
// GET AVAILABLE NOTES
// ======================================

router.get("/:collectionId/available/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM notes
      WHERE user_id = $1
      AND id NOT IN (
        SELECT note_id
        FROM collection_notes
        WHERE collection_id = $2
      )
      ORDER BY pinned DESC, created_at DESC
      `,
      [
        req.params.userId,
        req.params.collectionId,
      ]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

// ======================================
// GET ALL COLLECTIONS
// ======================================

router.get("/:userId", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        c.*,
        COUNT(cn.note_id)::int AS note_count
      FROM collections c
      LEFT JOIN collection_notes cn
      ON c.id = cn.collection_id
      WHERE c.user_id = $1
      GROUP BY c.id
      ORDER BY c.created_at DESC
      `,
      [req.params.userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

// ======================================
// CREATE COLLECTION
// ======================================

router.post("/", async (req, res) => {
  try {
    const { userId, name, icon } = req.body;

    const result = await pool.query(
      `
      INSERT INTO collections
      (user_id, name, icon)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [userId, name, icon]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

// ======================================
// ADD NOTES TO COLLECTION
// ======================================

router.post("/add-note", async (req, res) => {
  try {
    const { collectionId, noteIds } = req.body;

    for (const noteId of noteIds) {
      await pool.query(
        `
        INSERT INTO collection_notes
        (collection_id, note_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        `,
        [collectionId, noteId]
      );
    }

    res.json({
      message: "Notes added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

// ======================================
// REMOVE NOTE FROM COLLECTION
// ======================================

router.delete("/:collectionId/:noteId", async (req, res) => {
  try {
    await pool.query(
      `
      DELETE FROM collection_notes
      WHERE collection_id = $1
      AND note_id = $2
      `,
      [
        req.params.collectionId,
        req.params.noteId,
      ]
    );

    res.json({
      message: "Note removed successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

// ======================================
// DELETE COLLECTION
// ======================================

router.delete("/:id/:userId", async (req, res) => {
  try {
    await pool.query(
      `
      DELETE FROM collection_notes
      WHERE collection_id = $1
      `,
      [req.params.id]
    );

    const result = await pool.query(
      `
      DELETE FROM collections
      WHERE id = $1
      AND user_id = $2
      RETURNING *
      `,
      [
        req.params.id,
        req.params.userId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Collection not found",
      });
    }

    res.json({
      message: "Collection deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
});

module.exports = router;