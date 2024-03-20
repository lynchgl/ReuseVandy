import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import { useLocation } from 'react-router-dom';

const CategoryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.getAll('name'); // Get all values for 'name' parameter

  return (
    <>
      <NavigationBar />
      <MarketplacePage categories={category} /> {/* Pass categories as a list */}
    </>
  );
};

export default CategoryPage;
