const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import PostgreSQL connection
require("./config/db");

// Import Routes
const authRoutes = require("./routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);          // ✅ Authentication
app.use("/api/notes", require("./routes/notes"));
app.use("/api/bookmarks", require("./routes/bookmarks"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});