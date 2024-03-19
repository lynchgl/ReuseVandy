import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { dbMarketplaceListings, dbUsers, auth } from '../../services/firebase.config';
import ListingCard from '../ListingCard/ListingCard';

const FurniturePage = () => {
  const [furnitureListings, setFurnitureListings] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [currentUser, setCurrentUser] = useState(null); // Initialize currentUser state

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(dbMarketplaceListings, 'listings'), where('category', '==', 'Furniture')),
      async (snapshot) => {
        const furnitureListingsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setFurnitureListings(furnitureListingsData);

        const userIds = furnitureListingsData.map((listing) => listing.userId).filter(Boolean);
        await fetchUserNames(userIds);
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
        {furnitureListings.map(({ title, category, price, timestamp, userId, id }) => (
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

export default FurniturePage;
