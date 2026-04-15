import express from 'express';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import 'dotenv/config';
import { storage } from './config/cloudinaryConfig.js';
import db from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// Test database connection endpoint
app.get('/api/test-db', async (req, res) => {
  try {
    db.query('SELECT 1 + 1 AS result', (err, results) => {
      if (err) {
        return res.status(500).json({ 
          error: 'Database connection failed', 
          details: err.message 
        });
      }
      res.json({ 
        success: true, 
        message: 'Database connected successfully',
        result: results 
      });
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Database test failed', 
      details: error.message 
    });
  }
});

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

// Upload endpoint
app.post('/api/uploads', upload.single('file'), function (req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Cloudinary returns the full URL in req.file.path
    const imageUrl = req.file.path;
    
    res.status(200).json({
      url: imageUrl,
      filename: req.file.filename,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Error handling middleware for multer
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File is too large. Max size is 10MB.' });
    }
    return res.status(400).json({ error: error.message });
  }
  next(error);
});

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
