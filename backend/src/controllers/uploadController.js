const { uploadToCloudinary } = require('../services/cloudinaryService');

const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }
    // Use a generic 'uploads' folder for this endpoint
    const uploadPromises = req.files.map(file => uploadToCloudinary(file.buffer, 'product_images'));
    const uploadResults = await Promise.all(uploadPromises);
    const images = uploadResults.map(result => ({
      url: result.secure_url,
      public_id: result.public_id
    }));
    res.status(201).json({ message: 'Images uploaded successfully', images });
  } catch (error) {
    console.error('Image upload failed:', error);
    res.status(500).json({ message: 'An error occurred during image upload.' });
  }
};

module.exports = { uploadImages };