import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Profile from './components/Profile';
import MarketplaceListing from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import SellItem from './components/SellItem/SellItem';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path='/' element={<MarketplaceListing />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/marketplace" element={<MarketplaceListing />} />
        <Route path="/sell" element={<SellItem />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;

