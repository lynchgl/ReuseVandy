import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebase.config';
import './NavigationBar.css';

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });

    return () => unsubscribe();
  }, []);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const isActiveCategory = (category) => {
    const params = new URLSearchParams(location.search);
    const categoryName = params.get('name') || '';
    return location.pathname === '/category' && categoryName === category;
  };

  return (
    <nav>
      <div className="nav-links">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>All Listings</Link>
        <div className="dropdown" onMouseEnter={toggleDropdown} onMouseLeave={toggleDropdown}>
          <span className="dropdown-toggle">Shop by Category</span>
          {showDropdown && (
            <div className="dropdown-menu">
              <Link to="/category?name=Furniture" className={isActiveCategory('Furniture') ? 'active' : ''}>Furniture</Link>
              <Link to="/category?name=Clothing" className={isActiveCategory('Clothing') ? 'active' : ''}>Clothing</Link>
              <Link to="/category?name=Technology" className={isActiveCategory('Technology') ? 'active' : ''}>Technology</Link>
              <Link to="/category?name=Textbooks" className={isActiveCategory('Textbooks') ? 'active' : ''}>Textbooks</Link>
            </div>
          )}
        </div>
        <Link to="/trending" className={location.pathname === '/trending' ? 'active' : ''}>Trending</Link>
      </div>
      {isLoggedIn && <Link to="/sell" className="sell-button">Sell an Item</Link>}
    </nav>
  );
};

export default NavigationBar;
