import React from 'react';
import EditMarketplaceListing from '../EditMarketplaceListing/EditMarketplaceListing';
import './ListingCard.css'

const ListingCard = ({ title, category, price, id, timestamp, userId, userNames, currentUser, onDelete, image }) => {
    const categories = ['Furniture', 'Decorations', 'Appliances', 'Kitchen', 'Clothing', 'Jewelry', 'Textbooks', 'Other books', 'Technology', 'Other']
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
                </div>
            </div>
        </div>
    );
};

export default ListingCard;
