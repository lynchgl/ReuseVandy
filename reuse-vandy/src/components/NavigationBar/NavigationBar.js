import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css'

const NavigationBar = () => {
  return (
    <nav>
        <div className="nav-links">
            <Link to="/trending">Trending</Link>
            <Link to="/furniture">Furniture</Link>
            <Link to="/clothing">Clothing</Link>
            <Link to="/technology">Technology</Link>
            <Link to="/textbooks">Textbooks</Link>
        </div>
        <Link to="/sell" className="sell-button">Sell an Item</Link>
    </nav>
  );
};

export default NavigationBar;