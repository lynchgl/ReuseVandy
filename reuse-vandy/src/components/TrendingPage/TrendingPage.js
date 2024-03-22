import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import MarketplacePage from '../MarketplacePage/MarketplacePage';

const TrendingPage = () => {
  return (
    <>
      <NavigationBar />
      <MarketplacePage trending={true} />
    </>
  );
};

export default TrendingPage;