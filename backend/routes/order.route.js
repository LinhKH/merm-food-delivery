import express from 'express';
import { createOrder, getOrder, getOrders, myOrders, verifyOrder } from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router
  .post('/', authMiddleware, createOrder)
  .get('/single-order', authMiddleware, getOrder)
  .get('/my-order', authMiddleware, myOrders)
  .get('/', authMiddleware, getOrders)
  .post('/verify', authMiddleware, verifyOrder);

export default router;