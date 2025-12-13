const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Constructs the full, absolute URL for a given image path.
 * @param {string} imagePath - The relative path of the image from the database (e.g., '/uploads/image.jpg').
 * @returns {string} The full URL to the image.
 */
export const getImageUrl = (imagePath) => {
  return `${API_BASE_URL}${imagePath}`;
};