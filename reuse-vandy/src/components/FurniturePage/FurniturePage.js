import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import MarketplacePage from '../MarketplacePage/MarketplacePage';

const FurniturePage = () => {
  return (
    <>
      <NavigationBar />
      <MarketplacePage category={"Furniture"} />
    </>
  );
};

export default FurniturePage;