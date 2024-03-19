import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebase.config';
import './NavigationBar.css'

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update the isLoggedIn state based on the user's presence
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav>
        <div className="nav-links">
          <Link to="/trending" className={location.pathname === '/trending' ? 'active' : ''}>Trending</Link>
          <Link to="/furniture" className={location.pathname === '/furniture' ? 'active' : ''}>Furniture</Link>
          <Link to="/clothing" className={location.pathname === '/clothing' ? 'active' : ''}>Clothing</Link>
          <Link to="/technology" className={location.pathname === '/technology' ? 'active' : ''}>Technology</Link>
          <Link to="/textbooks" className={location.pathname === '/textbooks' ? 'active' : ''}>Textbooks</Link>
        </div>
        {isLoggedIn && <Link to="/sell" className="sell-button">Sell an Item</Link>}
    </nav>
  );
};

export default NavigationBar;