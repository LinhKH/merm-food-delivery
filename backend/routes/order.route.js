import express from 'express';
import { createOrder, getOrder, getOrders } from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router
  .post('/', authMiddleware, createOrder)
  .get('/single-order', authMiddleware, getOrder)
  .get('/', authMiddleware, getOrders)
  .post('/verify', authMiddleware, verifyOrder);

export default router;