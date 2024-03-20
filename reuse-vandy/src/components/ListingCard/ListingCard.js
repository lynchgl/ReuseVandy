import React, { useState, useEffect } from 'react';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import blankStar from '../../images/empty-star.webp';
import filledStar from '../../images/filled star.png';
import { dbMarketplaceListings, auth } from '../../services/firebase.config';
import './ListingCard.css';
import EditMarketplaceListing from '../EditMarketplaceListing/EditMarketplaceListing';
import { Modal, Button } from 'react-bootstrap'; // Import modal components from Bootstrap


const ListingCard = ({ title, category, price, id, timestamp, userId, userNames, currentUser, onDelete, image }) => {
    const categories = ['Furniture', 'Decorations', 'Appliances', 'Kitchen', 'Clothing', 'Jewelry', 'Textbooks', 'Other books', 'Technology', 'Other']
    
    const [showModal, setShowModal] = useState(false);

    const handleContactClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const [isFavorite, setIsFavorite] = useState(false); // State to track if listing is a favorite
    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const user = auth.currentUser;
                if (user) {
                    // Fetch the document from Firestore
                    const listingRef = doc(dbMarketplaceListings, 'listings', id);
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
    }, [id]);

    const toggleFavorite = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                // Update the Firestore document with the new favorite status
                const listingRef = doc(dbMarketplaceListings, 'listings', id);
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
        <div className="col-md-4 mb-3" key={id}>
            <div className="card h-100">
                {image && <img src={image} className="card-img-top" alt="Listing" />} {/* Render image if it exists */}
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">
                        <strong>Category:</strong> {category} {/* Use category directly */}
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
                    <div className="mt-auto">
                        {currentUser && currentUser.uid === userId && (
                            <>
                                <EditMarketplaceListing
                                    listing={{ title, category, price, id, timestamp }}
                                    categories={categories} // Pass the categories array here
                                />
                                <button
                                    type="button"
                                    className = "btn btn-danger btn-action"
                                    onClick={() => onDelete(id)}
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                    <div className="mt-auto">
                        <img
                            src={isFavorite ? filledStar : blankStar}
                            alt="Star"
                            className="favorite-button"
                            onClick={toggleFavorite}
                        />
                    </div>
                    <div className="position-absolute bottom-0 start-0 p-2">
                    {currentUser && currentUser.uid !== userId && (
    <>
        {  <div className="row">
                            <div className="col-auto me-2">
                                <button
                                    type="button"
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: '#e6b800'}}
                                        onClick={handleContactClick}

                                >
                                    Contact Seller
                                </button>
                            </div>
                            {/* <div className="col-auto">
                                <button
                                    type="button"
                                    className="btn btn-sm"
                                    style={{
                                        backgroundColor: '#e6b800'}}
                                    onClick={() => {}}
                                >
                                    Add to Cart
                                </button>
                            </div> */}
                        </div>}
    </>
)}
                      
                    </div>
                </div>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Contact Seller</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Add your contact message form or text here */}
                    <p>Write your message to the seller here.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleCloseModal}>
                        Send Message
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListingCard;
