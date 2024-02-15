import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import MarketplaceListing from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import SellItem from './components/SellItem/SellItem';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<MarketplaceListing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/marketplace" element={<MarketplaceListing />} />
        <Route path="/sell" element={<SellItem />} />
      </Routes>
    </div>
  );
}

export default App;

