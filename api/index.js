import express from 'express';
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer  from 'multer';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173',  // frontend's address
  credentials: true,                // allow cookies
}));

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../client/public/uploads');  // ✅ Save to public/uploads
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});


const upload = multer({ storage })
app.post('/api/uploads', upload.single('file'), function (req, res) {
  const file = req.file;
  res.status(200).json(file.filename);  // respond with the file name

})

app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});