import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { dbMarketplaceListings } from '../../services/firebase.config';
import { useParams } from 'react-router-dom';


const ListingPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                console.log('Fetching listing with ID:', id);
                const listingRef = doc(dbMarketplaceListings, 'listings', id);
                console.log('Listing reference:', listingRef);
                const snapshot = await getDoc(listingRef);
                console.log('Snapshot:', snapshot);
                if (snapshot.exists()) {
                    console.log('Listing data:', snapshot.data());
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
        <div>
            <h2>{listing.title}</h2>
            <p>Category: {listing.category}</p>
            <p>Price: ${listing.price}</p>
            {/* Add more details here */}
        </div>
    );
};

export default ListingPage;
