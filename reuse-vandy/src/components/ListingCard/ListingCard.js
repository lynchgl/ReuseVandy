import React from 'react';
import EditMarketplaceListing from '../EditMarketplaceListing';

const ListingCard = ({ title, category, price, id, timestamp, userId, userNames, currentUser, onDelete }) => {
    const categories = ['Home', 'Clothes', 'Books', 'Jewelry', 'Electronics', 'Toys', 'Other'];
    return (
        <div className="col-md-4 mb-3" key={id}>
            <div className="card h-100">
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">
                        <strong>Category:</strong> {category}
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
                                    listing={{ title, category, price, id, timestamp }} // Pass the listing object here
                                    categories={categories}
                                />
                                <button
                                    type="button"
                                    className="btn btn-danger"
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
