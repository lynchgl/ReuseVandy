// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/logo.png'
import shoppingCartIcon from '../../images/shopping cart.png'; // Import shopping cart icon
import profileIcon from '../../images/profile.png'; // Import profile icon
import './Header.css'

const Header = () => {
  return (
    <header className="header-container">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
        </Link>
      </div>
      <div className="nav-container">
        <Link to="/cart">
          <img src={shoppingCartIcon} alt="Shopping Cart" className="icon" />
        </Link>
        <Link to="/profile">
          <img src={profileIcon} alt="Profile" className="icon" />
        </Link>
        <nav>
        <ul>
          <li><Link to="/signin">Sign In</Link></li>
        </ul>
      </nav>
      </div>
    </header>
  );
};

export default Header;
