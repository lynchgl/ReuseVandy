import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../services/firebase.config';
import './ListingCard.css';
import { Link } from 'react-router-dom'
import Favorites from '../Favorites/Favorites';


const ListingCard = ({ id, title, category, price, image }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // check if user is logged in
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user); // Update the isLoggedIn state based on the user's presence
        });

        return () => unsubscribe();
    }, []);

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
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
