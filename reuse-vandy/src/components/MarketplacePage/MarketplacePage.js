import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { dbMarketplaceListings, dbUsers, auth } from '../../services/firebase.config';
import ListingCard from '../ListingCard/ListingCard';
import './MarketplacePage.css'; // Import the CSS file for styling

const MarketplacePage = ({ category }) => {
  const [listings, setListings] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [currentUser, setCurrentUser] = useState(null); // Initialize currentUser state

  useEffect(() => {
    const fetchListings = async () => {
      try {
        let q;
        if (category) {
          // If category prop is provided, fetch listings with the specified category
          q = query(collection(dbMarketplaceListings, 'listings'), where('category', '==', category), orderBy('timestamp', 'desc'));
        } else {
          // If category prop is not provided, fetch all listings
          q = query(collection(dbMarketplaceListings, 'listings'), orderBy('timestamp', 'desc'));
        }
        
        const querySnapshot = await getDocs(q);
        const listingsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setListings(listingsData);

        const userIds = listingsData.map((listing) => listing.userId).filter(Boolean);
        await fetchUserNames(userIds);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    // Call fetchListings when the component mounts
    fetchListings();

    // Set currentUser when auth state changes
    const authUnsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    return () => {
      authUnsubscribe();
    };
  }, [category]); // Update listings when category changes

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

  const deleteListing = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this listing?')) {
        await deleteDoc(doc(dbMarketplaceListings, 'listings', id));
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {listings.map(({ title, category, price, timestamp, userId, id }) => (
          <div className="col-md-4 mb-3" key={id}>
            <ListingCard
              id={id}
              title={title}
              category={category}
              price={price}
              timestamp={timestamp}
              userId={userId}
              userNames={userNames}
              currentUser={currentUser}
              onDelete={deleteListing} // Pass deleteListing function to ListingCard
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;