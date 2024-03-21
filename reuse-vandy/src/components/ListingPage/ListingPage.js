import React, { useState, useEffect } from 'react';
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { dbMarketplaceListings, dbProfiles } from '../../services/firebase.config';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar';
import './ListingPage.css'


const ListingPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserName = async (userId) => {
            try {
                const q = query(collection(dbProfiles, 'profiles'), where('userId', '==', userId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    // There should be only one document with the given userId
                    const userData = querySnapshot.docs[0].data();
                    return userData.name;
                } else {
                    console.log('User document not found.');
                    return null;
                }
            } catch (error) {
                console.error('Error fetching user document:', error);
                return null;
            }
        };
        

        const fetchListing = async () => {
            try {
                const listingRef = doc(dbMarketplaceListings, 'listings', id);
                const snapshot = await getDoc(listingRef);
                if (snapshot.exists()) {
                    setListing(snapshot.data());

                    const listingData = snapshot.data();
                    const userId = listingData.userId;
        
                    // Fetch user's name using the userId
                    const userName = await fetchUserName(userId);
                    if (userName !== null) {
                        setUserName(userName);
                    }
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

    const formatDate = (timestamp) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', options);
    };

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
                    <p>Listed on: {formatDate(listing.timestamp)}</p>
                    <p>Listed By: {userName}</p>
                </div>
            </div>
        </>
    );
};

export default ListingPage;
