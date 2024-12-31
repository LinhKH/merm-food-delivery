import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a new order
const createOrder = async (req, res) => {
  const { items, amount, address } = req.body;
  const { userId } = req.user;
  try {
    const order = new Order({
      userId,
      items,
      amount,
      address,
    });
    await order.save();
    // Update the user's orders array
    await User.findByIdAndUpdate(userId, { cartData: {} });

    // line items for stripe
    const lineItems = items.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    // Create a new payment intent
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: lineItems,
    //   mode: "payment",
    //   success_url: `${process.env.CLIENT_URL}/verify?success=true&order_id=${order._id}`,
    //   cancel_url: `${process.env.CLIENT_URL}/verify?success=false&order_id=${order._id}`,
    // });
    let session = { url: "https://www.google.com" };

    res.status(200).json({ success: true, session_url: session.url });

  } catch (error) {
    res.status(500).json({ success: false, message: "Error in creating order" });
  }
};

// verify order
const verifyOrder = async (req, res) => {
  const { order_id, success } = req.body;
  try {
    if (success) {
      const order = await Order.findByIdAndUpdate(order_id, { payment: true }, { new: true });
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      res.status(200).json({ success: true, message: 'paid', order });
    } else {
      await Order.findByIdAndDelete(order_id);
      res.status(200).json({ success: false, message: 'cancelled' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in verifying order" });
  }
};

// my orders
const myOrders = async (req, res) => {
  const { userId } = req.user;
  try {
    const orders = await Order.find({ userId });
    res.status(200).json({ success: true, orders});
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in fetching orders" });
  }
};

// Get a single order
const getOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json(order);
  }
  catch (error) {
    res.status(500).json({ success: false, message: "Error in fetching order" });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in fetching orders" });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in updating order" });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await order.remove();
    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error in deleting order" });
  }
};

export { createOrder, verifyOrder, getOrder, myOrders, getOrders, updateOrder, deleteOrder };
