import express from 'express';
import { create, remove, list } from '../controllers/cart.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router
  .post('/add', authMiddleware, create)
  .post('/remove', authMiddleware, remove)
  .get('/', authMiddleware, list);

export default router;