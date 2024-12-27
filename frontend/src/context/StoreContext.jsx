import { createContext, useEffect, useState } from "react";

import { food_list } from "../assets/assets";

export const StoreContext = createContext();

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});

  const addToCart = (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  }

  const removeFromCart = (itemId) => {
    if (cartItems[itemId] === 1) {
      const newCart = { ...cartItems };
      delete newCart[itemId];
      setCartItems(newCart);
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    }
  }

  const getTotalCartAmount = () => {
    let total = 0;
    for (let item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((food) => food._id === item);
        total += itemInfo.price * cartItems[item];
      }
    }
    return total;
  }

  // useEffect(() => {
  //   console.log(cartItems)
  // }, [cartItems]);

  const contextValue = { food_list, cartItems, setCartItems, addToCart, removeFromCart, getTotalCartAmount};
  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
