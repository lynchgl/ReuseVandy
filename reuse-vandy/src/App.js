import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import SellItem from './components/SellItem/SellItem';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Profile from './components/Profile/Profile'
import FurniturePage from './components/FurniturePage/FurniturePage';
import ClothingPage from './components/ClothingPage/ClothingPage';
import TechnologyPage from './components/TechnologyPage/TechnologyPage';
import TextbooksPage from './components/TextbooksPage/TextbooksPage';
import TrendingPage from './components/TrendingPage/TrendingPage';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path='/' element={<HomePage />} />
        <Route path="/marketplace" element={<HomePage />} />
        <Route path="/sell" element={<SellItem />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/furniture" element={<FurniturePage />} />
        <Route path="/clothing" element={<ClothingPage />} />
        <Route path="/technology" element={<TechnologyPage />} />
        <Route path="/textbooks" element={<TextbooksPage />} />
        <Route path="/trending" element={<TrendingPage />} />
      </Routes>
    </div>
  );
}

export default App;

