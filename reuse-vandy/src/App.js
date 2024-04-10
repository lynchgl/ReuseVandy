import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import Header from './components/Header/Header';
import SellItem from './components/SellItem/SellItem';
import SignIn from './components/SignIn/SignIn';
import SignUp from './components/SignUp/SignUp';
import Profile from './components/Profile/Profile'
import TrendingPage from './components/TrendingPage/TrendingPage';
import CategoryPage from './components/CategoryPage/CategoryPage';
import ListingPage from './components/ListingPage/ListingPage';
import Messaging from './components/Messaging/Messaging';

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
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/message" element={<Messaging />} />
        <Route path="/listing/:id" element={<ListingPage />} />
      </Routes>
    </div>
  );
}

export default App;

