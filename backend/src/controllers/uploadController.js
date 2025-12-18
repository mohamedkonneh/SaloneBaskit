const { uploadToCloudinary } = require('../services/cloudinaryService');

const uploadImages = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }
  // Use a generic 'uploads' folder for this endpoint
  const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'product_images'));
  const uploadResults = await Promise.all(uploadPromises);
  const imageUrls = uploadResults.map(result => result.secure_url);
  res.status(201).json({ message: 'Images uploaded successfully', imageUrls });
};

module.exports = { uploadImages };