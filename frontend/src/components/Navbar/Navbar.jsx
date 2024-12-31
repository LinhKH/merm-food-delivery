import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets.js";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";

// In React Router, both Link and NavLink are used for navigation, but they have some differences in terms of functionality and use cases.
// Key Differences

// Active State Management:
// Link: Does not manage active states.
// NavLink: Automatically applies an active class to the link when it matches the current URL.

// Styling:
// Link: Basic navigation without any built-in styling for active states.
// NavLink: Provides built-in support for styling active links using activeClassName or activeStyle.

// Use Case:
// Link: Use when you need simple navigation without active state styling.
// NavLink: Use when you need to highlight the active link to indicate the current route to the user.

const Navbar = ({setShowLogin}) => {
  const { getTotalCartAmount, token, setToken, setCartItems } = useContext(StoreContext);
  const [menu, setMenu] = useState("home");
  const navigate = useNavigate();
  
  const logOut = () => {
    localStorage.removeItem("token");
    setToken(null);
    setCartItems({});
    navigate('/');
  }
  return (
    <div className="navbar">
      <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <Link to='/' onClick={() => setMenu('home')} className={menu === 'home' ? 'active' : ''}>home</Link>
        <a href="#explore-menu" onClick={() => setMenu('menu')} className={menu === 'menu' ? 'active' : ''}>menu</a>
        <a href="#app-download" onClick={() => setMenu('mobile-app')} className={menu === 'mobile-app' ? 'active' : ''}>mobile-app</a>
        <a href="#footer" onClick={() => setMenu('contact-us')} className={menu === 'contact-us' ? 'active' : ''}>contact-us</a>
      </ul>
      <div className="navbar-right">
        <img src={assets.search_icon} alt="" />
        <div className="navbar-search-icon">
          <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
          <div className={getTotalCartAmount() > 0 ? 'dot' : ''}></div>
        </div>
        {
          !token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className="navbar-profile">
              <img src={assets.profile_icon} alt="" />
              <ul className="nav-profile-dropdown">
                <Link to='my-order'><li><img src={assets.bag_icon} alt="" />Orders</li></Link>
                <hr />
                <li onClick={logOut}><img src={assets.logout_icon} alt="" />Logout</li>
              </ul>
          </div>
        }
        
      </div>
    </div>
  );
};

export default Navbar;
