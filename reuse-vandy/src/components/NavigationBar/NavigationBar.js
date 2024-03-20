import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { auth } from '../../services/firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import './NavigationBar.css';

const categories = [
  { name: 'Home', subcategories: ['Furniture', 'Decorations', 'Appliances', 'Kitchen'] },
  { name: 'Apparel', subcategories: ['Clothing', 'Jewelry'] },
  { name: 'Books', subcategories: ['Textbooks', 'Other books'] },
  { name: 'Technology', subcategories: [] },
  { name: 'Other', subcategories: [] }
];

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
            {categories.map((mainCategory, index) => (
              <div key={index}>
                <Link to={`/category?name=${mainCategory.name}`} className={isActiveCategory(mainCategory.name) ? 'active' : ''}>
                  {mainCategory.name}
                </Link>
                {mainCategory.subcategories.length > 0 && (
                  <div className="subcategory-menu">
                    {mainCategory.subcategories.map((subcategory, subIndex) => (
                      <Link key={subIndex} to={`/category?name=${subcategory}`} className={isActiveCategory(subcategory) ? 'active' : ''}>
                        {subcategory}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
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
