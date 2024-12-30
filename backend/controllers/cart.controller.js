import User from "../models/user.model.js";

// add to cart
const create = async (req, res) => {
  try {
    const userId = req.user.userId;
    const foodId = req.body.foodId;

    // Find the user by ID
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Initialize cartData if it doesn't exist
    if (!user.cartData) {
      user.cartData = {};
    }
    
    // Update the cartData
    if (!user.cartData[foodId]) {
      user.cartData[foodId] = 1;
    } else {
      user.cartData[foodId] += 1;
    }
    
    // update the user
    const response = await User.findByIdAndUpdate(userId, { cartData: user.cartData }, { new: true });

    res.json({ success: true, message: "Item added to cart", cartData: response.cartData });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// remove from cart
const remove = async (req, res) => {
  try {
    const userId = req.user.userId;
    const foodId = req.body.foodId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.cartData || !user.cartData[foodId]) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    // Remove the item from cartData
    if (user.cartData[foodId] === 1) {
      delete user.cartData[foodId];
    } else {
      user.cartData[foodId] -= 1;
    }

    // update the user
    const response = await User.findByIdAndUpdate(userId, { cartData: user.cartData }, { new: true });

    res.json({ success: true, message: 'Item removed from cart', cartData:response.cartData });
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// list cart items
const list = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find the user by ID and populate the cartData
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.cartData);
  } catch (error) {
    console.error('Error fetching cart data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export { create, remove, list };
