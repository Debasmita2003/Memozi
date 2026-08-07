const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "memozi/profile",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
  },
});

module.exports = multer({
  storage,
});