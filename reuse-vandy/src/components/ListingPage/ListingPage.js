import React, { useState, useEffect } from 'react';
import { doc, getDoc, query, collection, where, getDocs, deleteDoc } from 'firebase/firestore';
import { dbMarketplaceListings, dbProfiles, auth } from '../../services/firebase.config';
import { useParams } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar';
import EditMarketplaceListing from '../EditMarketplaceListing/EditMarketplaceListing';
import Favorites from '../Favorites/Favorites'
import './ListingPage.css'


const ListingPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const categories = ['Furniture', 'Decorations', 'Appliances', 'Kitchen', 'Clothing', 'Jewelry', 'Textbooks', 'Other books', 'Technology', 'Other']

    useEffect(() => {
        const authUnsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });

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

        return () => {
            authUnsubscribe();
        };

    }, [id]);

    const handleDelete = async (listingId) => {
        try {
            // Ask for confirmation before deleting
            const confirmed = window.confirm('Are you sure you want to delete this listing?');
            if (!confirmed) {
                return; // User canceled the deletion
            }

            // Reference to the listing document in Firestore
            const listingRef = doc(dbMarketplaceListings, 'listings', listingId);

            // Delete the document from Firestore
            await deleteDoc(listingRef);

            // Reload the page
            window.location.href = '/';
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    }

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

                        <div className="mt-auto">
                            <Favorites listingId={id} />
                        </div>

                    {/* Edit and Delte buttons */}
                    {currentUser.uid === listing.userId && (
                        <>
                            <EditMarketplaceListing
                                listing={{
                                    title: listing.title,
                                    category: listing.category,
                                    price: listing.price,
                                    id: id,
                                    timestamp: listing.timestamp
                                }}
                                categories={categories}
                            />
                            <button
                                type="button"
                                className="btn btn-danger btn-action"
                                onClick={() => handleDelete(id)}
                            >
                                Delete
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ListingPage;
