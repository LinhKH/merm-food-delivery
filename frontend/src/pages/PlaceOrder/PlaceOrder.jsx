import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } =
    useContext(StoreContext);
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: "",
  });

  const onChangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list &&
      food_list.map((item) => {
        if (cartItems[item._id]) {
          orderItems.push({
            name: item.name,
            price: item.price,
            quantity: cartItems[item._id],
          });
        }
      });

    const orderData = {
      items: orderItems,
      amount: getTotalCartAmount() + 2,
      address: data,
    };

    try {
      const response = await axios.post(`${url}/api/orders`, orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response);
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
    }
  }, [token]);

  return (
    <form className="place-order" onSubmit={handleSubmit}>
      <div className="place-order-left">
        <p className="title">Delivery Infomation</p>
        <div className="multi-fields">
          <input
            type="text"
            name="firstName"
            onChange={onChangeHandler}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastName"
            onChange={onChangeHandler}
            placeholder="Last Name"
          />
        </div>
        <input
          type="email"
          name="email"
          onChange={onChangeHandler}
          placeholder="Email Address"
        />
        <input
          type="text"
          name="street"
          onChange={onChangeHandler}
          placeholder="Street"
        />
        <div className="multi-fields">
          <input
            type="text"
            name="city"
            onChange={onChangeHandler}
            placeholder="City"
          />
          <input
            type="text"
            name="state"
            onChange={onChangeHandler}
            placeholder="State"
          />
        </div>
        <div className="multi-fields">
          <input
            type="text"
            name="zip"
            onChange={onChangeHandler}
            placeholder="Zip code"
          />
          <input
            type="text"
            name="country"
            onChange={onChangeHandler}
            placeholder="Country"
          />
        </div>
        <input
          type="text"
          name="phone"
          onChange={onChangeHandler}
          placeholder="Phone Number"
        />
      </div>

      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>
                ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
              </b>
            </div>
            <button type="submit">PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
