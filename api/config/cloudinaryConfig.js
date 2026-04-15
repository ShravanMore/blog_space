import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_uploads', // Folder name in your Cloudinary account
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'], // Allowed file types
    transformation: [
      {
        width: 1200,
        height: 1200,
        crop: 'limit', // Don't upscale, only downscale if larger
        quality: 'auto', // Automatic quality optimization
        fetch_format: 'auto', // Automatic format selection (WebP for modern browsers)
      }
    ],
  },
});

export { cloudinary, storage };
