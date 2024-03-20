import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { dbMarketplaceListings, auth } from '../../services/firebase.config';
import ListingCard from '../ListingCard/ListingCard';

const Cart = () => {
  const [favoriteListings, setFavoriteListings] = useState([]);

  useEffect(() => {
    const fetchFavoriteListings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.log('User is not authenticated');
          return;
        }
  
        // Query the favorites collection for the current user's favorites
        const q = query(collection(dbMarketplaceListings, 'favorites'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
  
        console.log('Query Result:', querySnapshot);
  
        const favoriteListingsData = [];
        querySnapshot.forEach(doc => {
          const favoriteData = doc.data();
          // Log favoriteData to see its structure
          console.log('Favorite Data:', favoriteData);
          // Check if the favoriteData matches the expected structure and process accordingly
          // Adjust the logic based on the actual structure of the documents in Firestore
        });
        setFavoriteListings(favoriteListingsData);
      } catch (error) {
        console.error('Error fetching favorite listings:', error);
      }
    };
    
    fetchFavoriteListings();
  }, []);
  

  return (
    <div>
      <h1>Favorite Listings ({favoriteListings.length})</h1>
      <div className="container mt-4">
        <div className="row">
          {favoriteListings.map(({ id, title, category, price, timestamp, userId, imageUrl }) => (
            <div className="col-md-4 mb-3" key={id}>
              <ListingCard
                id={id}
                title={title}
                category={category}
                price={price}
                timestamp={timestamp}
                userId={userId}
                image={imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;
