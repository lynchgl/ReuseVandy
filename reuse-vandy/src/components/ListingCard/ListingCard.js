import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc } from 'firebase/firestore'; // Only import addDoc for Firestore
import { dbMessages, auth } from '../../services/firebase.config';
import { Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; // Import Modal and Button from react-bootstrap
import Favorites from '../Favorites/Favorites';
import './ListingCard.css';

const ListingCard = ({ id, title, category, price, image, currentUser, listing }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [messageContent, setMessageContent] = useState("");
    const [showModal, setShowModal] = useState(false); // State variable to control modal visibility

    // Check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return () => unsubscribe();
    }, []);

    // Handle changes in message content
    const handleMessageChange = (event) => {
        setMessageContent(event.target.value);
    };

    // Handle opening and closing of modal
    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleMessageSend = async () => {
        try {
            if (!currentUser || !currentUser.uid) {
                console.error('Current user not available or missing uid');
                return;
            }
            const messageData = {
                senderId: currentUser.uid,
                receiverId: listing.userId,
                content: messageContent,
                timestamp: new Date(),
                listingId: id
            };
            await addDoc(dbMessages, messageData);
            handleCloseModal(); // Close modal after sending message
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    

    return (
        <div className="col-md-4 mb-3" key={id}>
            <div className="card h-100">
                <Link to={`/listing/${id}`} className="card-link">
                    {image && <img src={image} className="card-img-top" alt="Listing" />}
                </Link>
                <div className="card-body d-flex flex-column">
                    <Link to={`/listing/${id}`} className="card-link">
                        <h5 className="card-title">{title}</h5>
                        <p className="card-text">
                            <strong>Category:</strong> {category} <br />
                            <strong>Price:</strong> ${price} <br />
                        </p>
                    </Link>
                    {isLoggedIn && (
                        <div className="favorite-button-container">
                            <Favorites listingId={id} />
                        </div>
                    )}
                    <Button variant="primary" onClick={handleOpenModal}>Contact Seller</Button>
                </div>
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
        </div>
    );
};

export default ListingCard;