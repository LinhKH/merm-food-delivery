import express from 'express';
import { createOrder, getOrder, getOrders, myOrders, updateOrder, verifyOrder } from '../controllers/order.controller.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

router
  .post('/', authMiddleware, createOrder)
  .put('/:id/status', updateOrder)
  .get('/single-order', authMiddleware, getOrder)
  .get('/my-order', authMiddleware, myOrders)
  .get('/', getOrders)
  .post('/verify', authMiddleware, verifyOrder);

export default router;