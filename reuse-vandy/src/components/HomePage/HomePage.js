import React from 'react';
import './HomePage.css';
import NavigationBar from '../NavigationBar/NavigationBar';
import MarketplacePage from '../MarketplacePage/MarketplacePage';

const HomePage = () => {
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
              <input type="text" placeholder="What are you looking for today?" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <MarketplacePage />
    </>
  );
};

export default HomePage;
