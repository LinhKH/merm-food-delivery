import React, { useContext, useEffect, useState } from "react";
import "./MyOrder.css";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";

const MyOrder = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/orders/my-order`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (!response.data.success) {
        console.error("Error fetching orders:", response.data.message);
        return;
      }
      console.log(response.data);
      setData(response.data.orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className="my-orders">
      <h2>My Order</h2>
      <div className="container">
        {data.map((order) => (
          <div className="my-orders-order" key={order._id}>
            <img src={assets.parcel_icon} alt="" />
            <p>
              {order.items.map((item, key) => {
                if (key === order.items.length - 1) {
                  return (
                    <span key={key}>
                      {item.name} x {item.quantity}
                    </span>
                  );
                } else {
                  return (
                    <span key={key}>
                      {item.name} x {item.quantity},{" "}
                    </span>
                  );
                }
              })}
            </p>
            <p>${order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrder;
