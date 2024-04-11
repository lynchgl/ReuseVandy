import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import logo from '../../images/logo.png'
import profileIcon from '../../images/profile.png'; // Import profile icon
import messagingIcon from '../../images/message.png'; // Import message icon

import reuse from '../../images/reuse.png';
import './Header.css'
import { auth } from '../../services/firebase.config';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update the isLoggedIn state based on the user's presence
    });

    return () => unsubscribe();
  }, []);

  // Function to check if the current location is the sign-in page
  const isSignInPage = () => location.pathname === '/signin';
  const isSignUpPage = () => location.pathname === '/signup';

  return (
    <header className="header-container">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo" />
          <img src={reuse} alt="reuse" className="reuse" />
        </Link>
      </div>
      <div className="nav-container">
        {!isLoggedIn && !isSignInPage() && !isSignUpPage() && (
          <Link to="/signin">
            <button className="signin-button">Sign In</button>
          </Link>
        )}
        {isLoggedIn && (
          <>
            <Link to="/message">
              <img src={messagingIcon} alt="Message" className="icon message-icon" />
            </Link>
        
            <Link to="/profile">
              <img src={profileIcon} alt="Profile" className="icon" />
            </Link>
            
            
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
