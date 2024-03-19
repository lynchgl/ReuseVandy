import React, { useState } from 'react';
import './HomePage.css';
import NavigationBar from '../NavigationBar/NavigationBar';
import MarketplacePage from '../MarketplacePage/MarketplacePage';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value)
  }

  return (
    <>
      {/* Header */}
      <div>
        <NavigationBar />
        <div className="home-page">
          <div className="image-section">
            <div className='rounded-rectangle'></div>
            <div className="overlay-content">
              <h1>Welcome to Reuse Vandy!</h1>
              <input 
                type="text" 
                placeholder="What are you looking for today?"
                value={searchQuery}
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <MarketplacePage searchQuery={searchQuery} />
    </>
  );
};

export default HomePage;
