const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

// Import PostgreSQL connection
require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");
const notesRoutes = require("./routes/notes");
const collectionsRoutes = require("./routes/collections");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded profile pictures
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/collections", collectionsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});