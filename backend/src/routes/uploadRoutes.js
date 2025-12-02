const path = require('path');
const express = require('express');
const multer = require('multer');

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function checkFileType(req, file, cb) {
  // Add a defensive check here. If there's no originalname, it's not a file we want.
  if (!file.originalname) {
    return cb(null, false); // Reject this part, but don't throw an error.
  }

  // Define allowed file extensions
  const filetypes = /jpeg|jpg|png|gif|webp|avif/;
  // Define allowed MIME types
  const mimetypes = /image\/jpeg|image\/jpg|image\/png|image\/gif|image\/webp|image\/avif/;

  // Get the extension from the filename (e.g., '.jpg') and remove the dot.
  const extension = path.extname(file.originalname).toLowerCase().substring(1);

  // Test the extension and the mimetype
  const isExtValid = filetypes.test(extension);
  const isMimeValid = mimetypes.test(file.mimetype);

  // Log the results for debugging
  console.log(`Validating file: ${file.originalname}, MIME: ${file.mimetype}, Extension: ${extension}`);
  console.log(`Is Extension Valid? ${isExtValid}, Is MIME Valid? ${isMimeValid}`);

  if (isExtValid && isMimeValid) {
    return cb(null, true);
  } else {
    cb(new Error('Images only! Please upload files with .jpeg, .jpg, .png, .gif, .webp, or .avif extensions.'));
  }
}

const upload = multer({ storage, fileFilter: checkFileType });

router.post('/', upload.array('images', 5), (req, res) => { // Allow up to 5 images
  const imageUrls = req.files.map(file => `/${file.path.replace(/\\/g, "/")}`);
  res.send({
    message: 'Images Uploaded',
    imageUrls: imageUrls, // Return an array of URLs
  });
});

module.exports = router;