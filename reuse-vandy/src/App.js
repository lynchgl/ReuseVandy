import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MarketplaceListing from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import SellItem from './components/SellItem/SellItem';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import ProfilePage from './components/ProfilePage/ProfilePage'
import Profile from './components/Profile/Profile'

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route index element={<MarketplaceListing />} />
        <Route path='/' element={<MarketplaceListing />} />
        <Route path="/marketplace" element={<MarketplaceListing />} />
        <Route path="/sell" element={<SellItem />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profilepage" element={<ProfilePage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;

