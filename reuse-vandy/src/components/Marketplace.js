import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import EditMarketplaceListing from './EditMarketplaceListing';
import { dbMarketplaceListings } from '../services/firebase.config';
import '../styles/styles.css';
import { Link } from 'react-router-dom';

const Marketplace = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [marketplaceListings, setMarketplaceListings] = useState([]);

  const collectionRef = collection(dbMarketplaceListings, 'listings');

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
      const updatedListings = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log("Updated Listings:", updatedListings);
      setMarketplaceListings(updatedListings);
    });
  
    return () => {
      // Unsubscribe from real-time updates when the component unmounts
      unsubscribe();
    };
  }, [collectionRef]);


  const submitListing = async (e) => {
    e.preventDefault();
  
    try {
      // Check if the price is a valid number
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error('Invalid price. Please enter a valid number.');
      }
  
      await addDoc(collectionRef, {
        title,
        price: parsedPrice,
        category,
        timestamp: serverTimestamp(),
      });
      setTitle(''); // Clear the input after submission
      setPrice('');
      setCategory('');
      // No need to reload the entire page; real-time updates will handle it
    } catch (err) {
      console.error('Error adding listing:', err);
    }
  };
  
const deleteListing = async (id) => {
  try {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      const documentRef = doc(dbMarketplaceListings, 'listings', id);
      await deleteDoc(documentRef);
      // No need to reload the entire page; real-time updates will handle it
    }
  } catch (err) {
    console.error('Error deleting listing:', err);
  }
};

return (
    <>
      {/* Header */}
      <header className="bg-warning text-dark p-3 d-flex justify-content-between">
        {/* Button to navigate to another page */}
        <div className="top-right-button">
          <Link to="/Todo">
            <button className="btn btn-primary">Back</button>
          </Link>
        </div>
        <h1>Reuse Vandy</h1>
        <div></div> {/* This empty div is for spacing, adjust it as needed */}
      </header>

      {/* Main content */}
      <div className="container mt-4">
        <button
          data-bs-toggle="modal"
          data-bs-target="#addModal"
          type="button"
          className="btn btn-warning mb-3"
        >
          Add Listing
        </button>
        <div className="row">
          {marketplaceListings.map(({ title, category, price, id, timestamp }) => (
            <div className="col-md-4 mb-3" key={id}>
              <div className="card h-100"> {/* Added 'h-100' class for a fixed height */}
                <div className="card-body d-flex flex-column"> {/* Added 'd-flex flex-column' for a column layout */}
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
                  </p>
                  <div className="mt-auto"> {/* Added 'mt-auto' for pushing the buttons to the bottom */}
                    <EditMarketplaceListing listing={{ title, category, price, id, timestamp }} />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteListing(id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Listing Modal */}
      <div className="modal fade" id="addModal" tabIndex="-1" aria-labelledby="addModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <form onSubmit={submitListing}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="addModalLabel">
                  Add Listing
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="titleInput" className="form-label">Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="titleInput"
                    placeholder="Enter title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="priceInput" className="form-label">Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    id="priceInput"
                    placeholder="Enter price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="categoryInput" className="form-label">Category:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryInput"
                    placeholder="Enter category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Create New Listing
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Marketplace;