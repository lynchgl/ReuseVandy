import React, { useState, useEffect } from 'react';
import { collection, doc, deleteDoc, onSnapshot, orderBy, query, where, getDocs } from 'firebase/firestore';
import EditMarketplaceListing from '../EditMarketplaceListing';
import { dbMarketplaceListings, dbUsers, auth } from '../../services/firebase.config';
import './HomePage.css'
import NavigationBar from '../NavigationBar/NavigationBar';

const Marketplace = () => {
  const [marketplaceListings, setMarketplaceListings] = useState([]);
  const categories = ['Home', 'Clothes', 'Books', 'Jewelry', 'Electronics', 'Toys', 'Other'];

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(dbMarketplaceListings, 'listings'), orderBy('timestamp', 'desc')), // Apply orderBy here
      (snapshot) => {
        const updatedListings = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        console.log("Updated Listings:", updatedListings);
        setMarketplaceListings(updatedListings);
      }
    );
    
    return () => {
      unsubscribe();
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

  const user = auth.currentUser;

  // fetches usernames for all users that have items listed
  const [userNames, setUserNames] = useState({});
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
          {marketplaceListings.map(({ title, category, price, id, timestamp, userId }) => (
            <div className="col-md-4 mb-3" key={id}>
              <div className="card h-100">
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{title}</h5>
                  <p className="card-text">
                    <strong>Category:</strong> {category}
                    <br />
                    <strong>Price:</strong> ${price}
                    <br />
                    {timestamp && timestamp.seconds && (
                      <small className="text-muted">
                        <i>{new Date(timestamp.seconds * 1000).toLocaleString()}</i>
                      </small>
                    )}
                    {userId && userNames[userId] && <p className="text-muted">Listed by: {userNames[userId]}</p>}
                  </p>
                  <div className="mt-auto">
                    {user && user.uid === userId && (
                      <>
                    <EditMarketplaceListing listing={{ title, category, price, id, timestamp }} categories={categories} />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteListing(id)}
                    >
                      Delete
                    </button>
                    </>
          )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Marketplace;