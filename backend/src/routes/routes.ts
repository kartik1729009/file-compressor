import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { userfile } from '../controller/fileController';

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

router.post('/compress', upload.single('file'), userfile);

export default router;
