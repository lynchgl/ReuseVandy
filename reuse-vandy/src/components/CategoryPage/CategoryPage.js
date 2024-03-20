import React from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import MarketplacePage from '../MarketplacePage/MarketplacePage';
import { useLocation } from 'react-router-dom';

const CategoryPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get('name') || '';

  return (
    <>
      <NavigationBar />
      <MarketplacePage category={category} />
    </>
  );
};

export default CategoryPage;
