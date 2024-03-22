import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';
import { dbMarketplaceListings, auth } from '../../services/firebase.config';
import ListingCard from '../ListingCard/ListingCard';
import './MarketplacePage.css';

const MarketplacePage = ({ categories, searchQuery, currentUserOnly, favorites }) => {
  const [listings, setListings] = useState([]);
  
  useEffect(() => {
    const fetchListings = async () => {
      try {
        let q = query(collection(dbMarketplaceListings, 'listings'));
        console.log("Query:", q);

        const user = auth.currentUser;
        if (currentUserOnly) {
          if (user) {
            q = query(q, where('userId', '==', user.uid), orderBy('timestamp', 'desc'));
          } else {
            // Redirect or handle case where user is not authenticated
            return;
          }
        } else if (favorites) {
          // Ignore favorites if currentUserOnly is true
          q = query(collection(dbMarketplaceListings, 'listings'), where('favorites', 'array-contains', user.uid), orderBy('timestamp', 'desc'));
        } else if (categories) {
          q = query(q, where('category', 'in', categories), orderBy('timestamp', 'desc'));
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
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    // Call fetchListings when the component mounts
    fetchListings();
  }, [categories, searchQuery, currentUserOnly, favorites]); 

  return (
    <div className="container mt-4">
      <div className="row">
        {listings.map(({ title, category, price, id, imageUrl }) => (
          <div className="col-md-4 mb-3" key={id}>
            <ListingCard
              id={id}
              title={title}
              category={category}
              price={price}
              image={imageUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
