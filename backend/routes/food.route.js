import express from 'express';
import multer from 'multer';

import { addFood } from '../controllers/food.controller.js';

const router = express.Router();

// image store engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/add', upload.single('image'), addFood);



export default router;