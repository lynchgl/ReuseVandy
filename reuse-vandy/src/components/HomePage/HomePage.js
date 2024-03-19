import React, { useState, useEffect } from 'react';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where, getDocs } from 'firebase/firestore';
import { dbMarketplaceListings, dbUsers, auth } from '../../services/firebase.config';
import './HomePage.css';
import NavigationBar from '../NavigationBar/NavigationBar';
import ListingCard from '../ListingCard/ListingCard';

const Marketplace = () => {
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [currentUser, setCurrentUser] = useState(null); // Initialize currentUser state

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(dbMarketplaceListings, 'listings'), orderBy('timestamp', 'desc')),
      (snapshot) => {
        const updatedListings = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log("Updated Listings:", updatedListings);
        setMarketplaceListings(updatedListings);
      }
    );

    // Set currentUser when auth state changes
    const authUnsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const deleteListing = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this listing?')) {
        await deleteDoc(doc(dbMarketplaceListings, 'listings', id));
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  const fetchUserNames = async (userIds) => {
    const names = {};
    for (const userId of userIds) {
      const q = query(collection(dbUsers, 'profiles'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const profileData = querySnapshot.docs[0].data();
        names[userId] = profileData.name;
      }
    }
    setUserNames(names);
  };

  useEffect(() => {
    const userIds = marketplaceListings.map((listing) => listing.userId).filter(Boolean);
    fetchUserNames(userIds);
  }, [marketplaceListings]);

  return (
    <>
      {/* Header */}
      <div>
        <NavigationBar />
        <div className="home-page">
          <div className="image-section">
            <div className='rounded-rectangle'></div>
            <div className="overlay-content">
              <h1>Welcome to Reuse Vandy!</h1>
              <input type="text" placeholder="What are you looking for today?" />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mt-4">
        <div className="row">
          {marketplaceListings.map((listing) => (
            <ListingCard
              key={listing.id}
              {...listing}
              userNames={userNames}
              currentUser={currentUser}
              onDelete={deleteListing}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Marketplace;
