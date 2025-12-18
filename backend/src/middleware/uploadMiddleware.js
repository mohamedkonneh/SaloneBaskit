const multer = require('multer');
const path = require('path');

// Use memoryStorage to hold the file as a buffer in memory.
// This is necessary for uploading to third-party services like Cloudinary.
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = { upload: multer({ storage, fileFilter: (req, file, cb) => checkFileType(file, cb) }) };