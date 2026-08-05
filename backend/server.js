const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// PostgreSQL Connection
require("./config/db");

// Routes
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const collectionsRoutes = require("./routes/collections");

const app = express();

/* =========================
   CORS Configuration
========================= */

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  process.env.FRONTEND_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  })
);

/* =========================
   Middleware
========================= */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   Static Files
========================= */

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* =========================
   API Routes
========================= */

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/collections", collectionsRoutes);

/* =========================
   Test Routes
========================= */

app.get("/", (req, res) => {
  res.send("🚀 Memozi API is running...");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
  });
});

/* =========================
   Error Handling
========================= */

app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/* =========================
   Server
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});