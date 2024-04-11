import React, { useState, useEffect } from 'react';
import { doc, getDoc, query, collection, where, getDocs, deleteDoc, updateDoc, addDoc } from 'firebase/firestore';
import { dbMarketplaceListings, dbProfiles, auth } from '../../services/firebase.config';
import { useParams } from 'react-router-dom';
import { Spinner, Modal, Button } from 'react-bootstrap';
import NavigationBar from '../NavigationBar/NavigationBar';
import EditMarketplaceListing from '../EditMarketplaceListing/EditMarketplaceListing';
import { dbMessages } from '../../services/firebase.config';

import Favorites from '../Favorites/Favorites'
import './ListingPage.css'


const ListingPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isSold, setIsSold] = useState(false);
    const [messageContent, setMessageContent] = useState("");

    const categories = ['Furniture', 'Decorations', 'Appliances', 'Kitchen', 'Clothing', 'Jewelry', 'Textbooks', 'Other books', 'Technology', 'Other']

    const handleContactClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

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
                    setIsSold(snapshot.data().sold);

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

    const handleToggleSold = async () => {
        try {
            const listingRef = doc(dbMarketplaceListings, 'listings', id);
            await updateDoc(listingRef, { sold: !isSold }); // Toggle the sold status
            setIsSold(!isSold); // Update the local state
        } catch (error) {
            console.error('Error updating sold status:', error);
        }
    };

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

    const handleMessageChange = (event) => {
        setMessageContent(event.target.value);
    };

    
    const handleMessageSend = async () => {
        try {
            // Create a new message object
            const newMessage = {
                content: messageContent,
                senderId: currentUser.uid, // Assuming you have the sender's ID
                receiverId: listing.userId, // Assuming you have the receiver's ID
                timestamp: new Date(), // Assuming you want to timestamp the message
            };
    
            // Add the new message to the Firestore collection
            await addDoc(collection(dbMessages, 'messages'), newMessage);
    
            // Log a success message
            console.log('Message sent:', newMessage);
    
            // Close the modal
            handleCloseModal();
        } catch (error) {
            console.error('Error sending message:', error);
        }
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
                    {currentUser && currentUser.uid !== listing.userId && listing.sold && <p className="sold-indicator">This item has been sold</p>}
                    <p>Category: {listing.category}</p>
                    <p>Price: ${listing.price}</p>
                    <p>Listed on: {formatDate(listing.timestamp)}</p>
                    <p>Listed By: {userName}</p>

                    <div className="mt-auto">
                        <div className="favorite-button-container-2">
                            <Favorites listingId={id} />
                            <span>Add to Favorites</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        {currentUser && currentUser.uid !== listing.userId && (
                            <>
                                {<div className="row">
                                    <div className="col-auto me-2">
                                        <button
                                            type="button"
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: '#e6b800'
                                            }}
                                            onClick={handleContactClick}

                                        >
                                            Contact Seller
                                        </button>
                                    </div>
                                </div>}
                            </>
                        )}
                    </div>

                    {/* Edit and Delte buttons */}
                    {currentUser.uid === listing.userId && (
                        <>
                            <div>
                                <button
                                    className="sold-button"
                                    onClick={handleToggleSold}
                                    style={{
                                        backgroundColor: isSold ? '#dc3545' : '#32CD32',
                                        color: 'white',
                                        padding: '10px 20px',
                                        border: 'none',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {isSold ? 'Sold!' : 'Mark as Sold'}
                                </button>
                            </div>
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
               {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Seller</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <textarea
                        value={messageContent}
                        onChange={handleMessageChange}
                        className="form-control"
                        placeholder="Write your message to the seller here."
                        rows={4}
                    ></textarea>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                    <Button variant="primary" onClick={handleMessageSend}>Send Message</Button>
                </Modal.Footer>
            </Modal>
            </div>
        </>
    );
};

export default ListingPage;
