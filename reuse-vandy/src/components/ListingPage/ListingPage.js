import React, { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { dbMarketplaceListings } from '../../services/firebase.config';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar';
import './ListingPage.css'


const ListingPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

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
            } finally {
                setLoading(false); // Set loading to false after fetching data
            }
        };

        fetchListing();
    }, [id]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!listing) {
        return <div>Listing not found.</div>;
    }

    return (
        <>
            <NavigationBar />
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
        </>
    );
};

export default ListingPage;
