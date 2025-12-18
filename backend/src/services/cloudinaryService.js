const { cloudinary } = require('../config/cloudinary');

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer The buffer of the file to upload.
 * @param {string} folder The folder in Cloudinary to upload the file to.
 * @returns {Promise<object>} A promise that resolves with the Cloudinary upload result.
 */
const uploadToCloudinary = (fileBuffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
        folder: folder,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { uploadToCloudinary };