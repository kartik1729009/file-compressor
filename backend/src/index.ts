import express from 'express';
import compressionRoutes from './routes/routes';
import multer from 'multer';
import cors from 'cors'
const app = express();
const port = process.env.PORT || 3000;
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

app.use('/api', compressionRoutes);

app.get('/', (req, res) => {
  res.send('File Compression Service is running');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});