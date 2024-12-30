import React, { useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { useContext } from "react";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { url, token, setToken } = useContext(StoreContext);

  const onChangeHandle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    try {
      if (currState === "Login") {
        const response = await axios.post(`${url}/api/users/login`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          setShowLogin(false);
        }
      } else {
        const response = await axios.post(`${url}/api/users/register`, data, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.success) {
          localStorage.setItem("token", response.data.token);
          setShowLogin(false);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="login-popup">
      <form
        method="POST"
        className="login-popup-container"
        onSubmit={onSubmitHandle}
      >
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>
        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              onChange={onChangeHandle}
              name="name"
              placeholder="Your name"
              required
            />
          )}
          <input
            type="text"
            onChange={onChangeHandle}
            name="email"
            placeholder="Your Email"
            required
          />
          <input
            type="password"
            onChange={onChangeHandle}
            name="password"
            placeholder="Your Password"
            required
          />
        </div>
        <button type="submit">
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>
        <div className="login-popup-conddition">
          <input
            type="checkbox"
            onChange={onChangeHandle}
            name=""
            id=""
            required
          />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" && (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        )}
        {currState === "Sign Up" && (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
