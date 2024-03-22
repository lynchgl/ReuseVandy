import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import blankStar from '../../images/empty-star.webp';
import filledStar from '../../images/filled star.png';
import { dbMarketplaceListings, auth } from '../../services/firebase.config';
import './Favorites.css'


const Favorites = ({ listingId }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    // Fetch the document from Firestore
                    const listingRef = doc(dbMarketplaceListings, 'listings', listingId);
                    const snapshot = await getDoc(listingRef);
                    if (snapshot.exists()) {
                        // Check if the current user has favorited this listing
                        const favorites = snapshot.data().favorites || [];
                        const isUserFavorite = favorites.includes(user.uid);
                        setIsFavorite(isUserFavorite);
                    }
                }
            } catch (error) {
                console.error('Error fetching favorite status:', error);
            }
        };

        fetchFavoriteStatus();
    }, [listingId]);

    const toggleFavorite = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                // Update the Firestore document with the new favorite status
                const listingRef = doc(dbMarketplaceListings, 'listings', listingId);
                const snapshot = await getDoc(listingRef);
                if (snapshot.exists()) {
                    const favorites = snapshot.data().favorites || [];
                    const updatedFavorites = isFavorite
                        ? favorites.filter(uid => uid !== user.uid)
                        : [...favorites, user.uid];
                    await updateDoc(listingRef, {
                        favorites: updatedFavorites
                    });
                    setIsFavorite(!isFavorite); // Toggle favorite state
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    return (
        <img
            src={isFavorite ? filledStar : blankStar}
            alt="Star"
            className="favorite-button"
            onClick={toggleFavorite}
        />
    );
}

export default Favorites;