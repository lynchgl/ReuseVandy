import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { auth } from '../../services/firebase.config';
import './NavigationBar.css'

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update the isLoggedIn state based on the user's presence
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav>
        <div className="nav-links">
            <Link to="/trending">Trending</Link>
            <Link to="/furniture">Furniture</Link>
            <Link to="/clothing">Clothing</Link>
            <Link to="/technology">Technology</Link>
            <Link to="/textbooks">Textbooks</Link>
        </div>
        {isLoggedIn && <Link to="/sell" className="sell-button">Sell an Item</Link>}
    </nav>
  );
};

export default NavigationBar;