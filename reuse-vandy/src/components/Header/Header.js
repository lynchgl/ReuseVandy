// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import logo from '../../images/logo.png'
import shoppingCartIcon from '../../images/shopping cart.png'; // Import shopping cart icon
import profileIcon from '../../images/profile.png'; // Import profile icon
import './Header.css'
import { auth } from '../../services/firebase.config';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update the isLoggedIn state based on the user's presence
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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
        {isLoggedIn ? (
              <li>
                <button onClick={handleLogout}>Log Out</button>
              </li>
            ) : (
          <li><Link to="/signin">Sign In</Link></li>
            )}
        </ul>
      </nav>
      </div>
    </header>
  );
};

export default Header;
