import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import MarketplaceListing from './components/Marketplace';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/profile" element={<Profile />} />
        <Route path="/marketplace" element={<MarketplaceListing />} />
      </Routes>
    </div>
  );
}

export default App;
