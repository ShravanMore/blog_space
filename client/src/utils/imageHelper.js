/**
 * Helper function to get the correct image URL
 * Handles both local uploads and Cloudinary URLs
 * 
 * @param {string} imgPath - The image path from database
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imgPath) => {
  if (!imgPath) return '';
  
  // If it's already a full URL (Cloudinary), return as is
  if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
    return imgPath;
  }
  
  // Otherwise, it's a local upload (for backward compatibility)
  return `/uploads/${imgPath}`;
};
