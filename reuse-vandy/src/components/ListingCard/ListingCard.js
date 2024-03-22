import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase.config';
import './ListingCard.css';
import { Modal, Button } from 'react-bootstrap'; // Import modal components from Bootstrap
import { Link } from 'react-router-dom'
import Favorites from '../Favorites/Favorites';


const ListingCard = ({ id, title, category, price, userId, currentUser, image }) => {
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Update the isLoggedIn state based on the user's presence
        });

        return () => unsubscribe();
    }, []);

    const handleContactClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="col-md-4 mb-3" key={id}>
            <div className="card h-100">
                <Link to={`/listing/${id}`} className="card-link">
                    {image && <img src={image} className="card-img-top" alt="Listing" />} {/* Render image if it exists */}
                </Link>
                <div className="card-body d-flex flex-column">
                    <Link to={`/listing/${id}`} className="card-link">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">
                            <strong>Category:</strong> {category} {/* Use category directly */}
                            <br />
                            <strong>Price:</strong> ${price}
                            <br />
                        </p>
                    </Link>
                    {isLoggedIn && (
                        <div className="favorite-button-container">
                            <Favorites listingId={id} />
                        </div>
                    )}
                    <div className="position-absolute bottom-0 start-0 p-2">
                        {currentUser && currentUser.uid !== userId && (
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
