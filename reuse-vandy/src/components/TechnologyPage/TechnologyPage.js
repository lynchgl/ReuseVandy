import React from 'react';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import NavigationBar from '../NavigationBar/NavigationBar';

const TechnologyPage = () => {
    return (
        <>
          <NavigationBar />
          <MarketplacePage category={"Technology"} />
        </>
      );
};

export default TechnologyPage;