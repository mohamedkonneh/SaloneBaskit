const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define the absolute path for the uploads directory
const uploadDir = path.join(__dirname, '../../uploads');

// Ensure the uploads directory exists, creating it if necessary
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

module.exports = { upload: multer({ storage, fileFilter: (req, file, cb) => checkFileType(file, cb) }) };