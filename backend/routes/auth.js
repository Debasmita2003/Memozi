const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const upload = require("../middleware/upload");

// =======================================
// SIGNUP
// =======================================

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    // Check if email already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const result = await pool.query(
      `INSERT INTO users (name, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, name, email`,
      [name, email, hashedPassword]
    );

    res.status(201).json({
      message: "Signup successful",
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// =======================================
// LOGIN
// =======================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    // Find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const user = result.rows[0];

    // Compare password
    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "memozi_secret_key",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        profile_picture: user.profile_picture,
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

  // ===============================
// UPDATE PROFILE
// ===============================

router.put("/profile", async (req, res) => {
  try {
    const { id, name, profile_picture } = req.body;

    if (!id || !name) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const result = await pool.query(
      `UPDATE users
       SET name = $1,
           profile_picture = $2
       WHERE id = $3
       RETURNING id, name, email, profile_picture, language`,
      [name, profile_picture, id]
    );

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

// =======================================
// UPDATE SETTINGS
// =======================================

router.put("/settings", async (req, res) => {
  try {
    const {
      id,
      auto_save,
      notifications,
      compact_mode,
      spell_check,
    } = req.body;

    const result = await pool.query(
      `UPDATE users
       SET
         auto_save = $1,
         notifications = $2,
         compact_mode = $3,
         spell_check = $4
       WHERE id = $5
       RETURNING
         id,
         name,
         email,
         profile_picture,
         auto_save,
         notifications,
         compact_mode,
         spell_check`,
      [
        
        auto_save,
        notifications,
        compact_mode,
        spell_check,
        id,
      ]
    );

    res.json({
      message: "Settings updated successfully",
      user: result.rows[0],
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
});
// Upload profile picture
router.post(
  "/upload-profile",
  upload.single("profilePicture"),
  async (req, res) => {
    try {
      const { id } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded",
        });
      }

      const imagePath = `uploads/profile/${req.file.filename}`;

      const result = await pool.query(
        `UPDATE users
         SET profile_picture = $1
         WHERE id = $2
         RETURNING *`,
        [imagePath, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "Profile picture updated",
        user: result.rows[0],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);
// Delete Account
router.delete("/delete-account/:id", async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query("DELETE FROM notes WHERE user_id = $1", [id]);
    await pool.query("DELETE FROM bookmarks WHERE user_id = $1", [id]);

    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
// ======================================
// CHANGE PASSWORD
// ======================================

router.put("/change-password", async (req, res) => {
  try {
    const {
      userId,
      currentPassword,
      newPassword,
    } = req.body;

    // Find user
    const user = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1
      `,
      [userId]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check current password
    const validPassword = await bcrypt.compare(
      currentPassword,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password
    await pool.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2
      `,
      [hashedPassword, userId]
    );

    res.json({
      message: "Password updated successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server Error",
    });
  }
});
module.exports = router;