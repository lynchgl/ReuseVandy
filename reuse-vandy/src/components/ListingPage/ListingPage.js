import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { dbMarketplaceListings } from '../../services/firebase.config';
import { useParams } from 'react-router-dom';
import './ListingPage.css'


const ListingPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const listingRef = doc(dbMarketplaceListings, 'listings', id);
                const snapshot = await getDoc(listingRef);
                if (snapshot.exists()) {
                    setListing(snapshot.data());
                } else {
                    console.log('Listing not found.');
                }
            } catch (error) {
                console.error('Error fetching listing:', error);
            }
        };

        fetchListing();
    }, [id]);

    if (!listing) {
        return <div>Loading...</div>;
    }

    return (
        <div className="listing-container">
            <div className="image-container">
                <img src={listing.imageUrl} alt="Listing" className="listing-image" />
            </div>
            <div className="details-container">
                <h2>{listing.title}</h2>
                <p>Category: {listing.category}</p>
                <p>Price: ${listing.price}</p>
                {/* Add more details here */}
            </div>
        </div>
    );
};

export default ListingPage;
