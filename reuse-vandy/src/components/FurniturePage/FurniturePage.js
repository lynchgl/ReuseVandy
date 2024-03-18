import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { dbMarketplaceListings, dbUsers } from '../../services/firebase.config';

const FurniturePage = () => {
  const [furnitureListings, setFurnitureListings] = useState([]);
  const [userNames, setUserNames] = useState({});

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

    return () => {
      unsubscribe();
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

  return (
    <div className="container mt-4">
      <div className="row">
        {furnitureListings.map(({ title, category, price, id, timestamp, userId }) => (
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FurniturePage;
