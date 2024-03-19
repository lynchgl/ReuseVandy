import React from 'react';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import NavigationBar from '../NavigationBar/NavigationBar';

const ClothingPage = () => {
    return (
        <>
          <NavigationBar />
          <MarketplacePage category={"Clothing"} />
        </>
      );
};

export default ClothingPage;