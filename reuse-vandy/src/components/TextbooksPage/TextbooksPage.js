import React from 'react';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import NavigationBar from '../NavigationBar/NavigationBar';

const TextbooksPage = () => {
    return (
        <>
          <NavigationBar />
          <MarketplacePage category={"Textbooks"} />
        </>
      );
};

export default TextbooksPage;