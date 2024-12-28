import React, { useEffect } from "react";
import "./List.css";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const List = () => {
  const [items, setItems] = useState([]);
  const url = "http://localhost:4000";
  const fetchItems = async () => {
    try {
      const response = await axios.get(`${url}/api/foods`);
      setItems(response.data.foods);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const removeFood = (id) => async () => {
    try {
      const response = await axios.delete(`${url}/api/foods/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchItems();
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);
  return (
    <div className="list add flex-col">
      <p>All Food Lists</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {items.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt="" />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={removeFood(item._id)} className="cursor">X</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
