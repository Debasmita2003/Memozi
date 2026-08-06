const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Create uploads/profile folder if it doesn't exist
const uploadDir = path.join(__dirname, "../uploads/profile");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

// Allow only image files
const fileFilter = (req, file, cb) => {
  const allowed = /jpg|jpeg|png|gif|webp/;

  const isValid =
    allowed.test(path.extname(file.originalname).toLowerCase()) &&
    allowed.test(file.mimetype);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed."));
  }
};

module.exports = multer({
  storage,
  fileFilter,
});