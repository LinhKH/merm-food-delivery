import { createContext, useEffect, useState } from "react";
import axios from "axios";

// import { food_list } from "../assets/assets";

export const StoreContext = createContext();

const StoreContextProvider = ({children}) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState(null);
  const [food_list, setFoodList] = useState([]);

  const url = "http://localhost:4000";

  const addToCart = async (itemId) => {
    const response = await axios.post(
      `${url}/api/carts/add`,
      {
        foodId: itemId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    setCartItems(response.data.cartData);

    // if (!cartItems[itemId]) {
    //   setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    // } else {
    //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    // }
  };

  const removeFromCart = async (itemId) => {
    const response = await axios.post(
      `${url}/api/carts/remove`,
      {
        foodId: itemId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setCartItems(response.data.cartData);
    // if (cartItems[itemId] === 1) {
    //   const newCart = { ...cartItems };
    //   delete newCart[itemId];
    //   setCartItems(newCart);
    // } else {
    //   setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    // }
  };

  const getTotalCartAmount = () => {
    let total = 0;
    for (let item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((food) => food._id === item);
        if (!itemInfo) {
          continue;
        }
        total += itemInfo.price * cartItems[item];
      }
    }
    return total;
  };

  const getFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/foods`);
      setFoodList(response.data.foods);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const getCarts = async () => {
    try {
      const response = await axios.get(`${url}/api/carts`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCartItems(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    async function getData() {
      await getFoodList();
      if (localStorage.getItem("token")) {
        setToken(localStorage.getItem("token"));
        await getCarts();
      }
    }
    getData();
  }, [token]);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
  };
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
