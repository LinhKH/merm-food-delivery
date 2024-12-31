import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import foodRouter from './routes/food.route.js';
import userRouter from './routes/user.route.js';
import cartRouter from './routes/cart.route.js';
import orderRouter from './routes/order.route.js';

// app config
const app = express();
const port = 4000;

// middleware
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/foods', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/users', userRouter);
app.use('/api/carts', cartRouter);
app.use('/api/orders', orderRouter);


app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// listen
app.listen(port, () => {
  connectDB();
  console.log(`Server is running on http://localhost:${port}`);
});