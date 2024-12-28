import express from 'express';
import multer from 'multer';

import { addFood, getFoods, removeFood } from '../controllers/food.controller.js';

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
router.get('/', getFoods);
router.delete('/:id', removeFood);



export default router;