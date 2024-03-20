import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import { dbMarketplaceListings, dbUsers, auth } from '../../services/firebase.config';
import ListingCard from '../ListingCard/ListingCard';
import './MarketplacePage.css';

const MarketplacePage = ({ category, searchQuery, currentUserOnly, favorites }) => {
  const [listings, setListings] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Set currentUser when auth state changes
    const authUnsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    const fetchListings = async () => {
      try {
        let q = query(collection(dbMarketplaceListings, 'listings'));
        console.log("Query:", q);

        if (currentUserOnly) {
          const user = auth.currentUser;
          if (user) {
            q = query(q, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
          } else {
            // Redirect or handle case where user is not authenticated
            return;
          }
        } else if (favorites && favorites.length > 0) {
          // Ignore favorites if currentUserOnly is true
          q = query(q, orderBy('timestamp', 'desc'));
        } else if (category) {
          q = query(q, where('category', '==', category), orderBy('timestamp', 'desc'));
        } else {
          q = query(q, orderBy('timestamp', 'desc'));
        }

        const querySnapshot = await getDocs(q);
        console.log("Query Snapshot:", querySnapshot);
        const listingsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        console.log("Listings Data:", listingsData);

        // Filter listings based on search query
        const filteredListings = searchQuery ? listingsData.filter(listing => listing.title.toLowerCase().includes(searchQuery.toLowerCase())) : listingsData;

        setListings(filteredListings);

        const userIds = filteredListings.map((listing) => listing.userId).filter(Boolean);
        await fetchUserNames(userIds);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    // Call fetchListings when the component mounts
    fetchListings();

    return () => {
      authUnsubscribe();
    };
  }, [category, searchQuery, currentUserOnly, favorites]); 

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

  return (
    <div className="container mt-4">
      <div className="row">
        {listings.map(({ title, category, price, timestamp, userId, id, imageUrl }) => (
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
              image={imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
