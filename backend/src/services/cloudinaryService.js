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

/**
 * Deletes images from Cloudinary based on their public IDs.
 * @param {string[]} publicIds An array of public IDs to delete.
 * @returns {Promise<object>} A promise that resolves with the deletion result.
 */
const deleteFromCloudinary = (publicIds) => {
  return new Promise((resolve, reject) => {
    if (!publicIds || publicIds.length === 0) {
      return resolve({ result: 'ok', message: 'No images to delete.' });
    }
    cloudinary.api.delete_resources(publicIds, (error, result) => {
      if (error) {
        console.error('Cloudinary Deletion Error:', error);
        return reject(error);
      }
      resolve(result);
    });
  });
};


module.exports = { uploadToCloudinary, deleteFromCloudinary };