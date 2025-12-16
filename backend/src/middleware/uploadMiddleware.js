const multer = require('multer');
const path = require('path');

// Set up storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // The 'uploads' directory should be at the root of the backend project
    cb(null, 'uploads/');
  },
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