import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase.config';
import { Link } from 'react-router-dom';
import Favorites from '../Favorites/Favorites';
import './ListingCard.css';

const ListingCard = ({ id, title, category, price, image, currentUser, listing }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="col-md-4 mb-3" key={id}>
            <div className="card h-100">
                {!isLoggedIn && (
                    <img src={image} className="card-img-top" alt="Listing" />
                )}
                {isLoggedIn && (
                    <Link to={`/listing/${id}`} className="card-link">
                        {image && <img src={image} className="card-img-top" alt="Listing" />}
                    </Link>
                )}
                <div className="card-body d-flex flex-column">
                    {!isLoggedIn && (
                        <div>
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">
                                <strong>Category:</strong> {category} <br />
                                <strong>Price:</strong> ${price} <br />
                            </p>
                        </div>
                    )}
                    {isLoggedIn && (
                        <Link to={`/listing/${id}`} className="card-link">
                            <h5 className="card-title">{title}</h5>
                            <p className="card-text">
                                <strong>Category:</strong> {category} <br />
                                <strong>Price:</strong> ${price} <br />
                            </p>
                        </Link>
                    )}
                    {isLoggedIn && (
                        <div className="favorite-button-container">
                            <Favorites listingId={id} />
                        </div>
                    )}
                    {/* <Button variant="primary" onClick={handleOpenModal}>Contact Seller</Button> */}
                </div>
                {/* <Modal show={showModal} onHide={handleCloseModal}>
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
                </Modal> */}
            </div>
        </div>
    );
};

export default ListingCard;