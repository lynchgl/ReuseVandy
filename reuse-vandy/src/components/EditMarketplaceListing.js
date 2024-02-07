import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { dbMarketplaceListings } from '../services/firebase.config';

const EditMarketplaceListing = ({ listing }) => {
  const [editedListing, setEditedListing] = useState({ ...listing });

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const documentRef = doc(dbMarketplaceListings, 'listings', listing.id);
      await updateDoc(documentRef, {
        title: editedListing.title,
        price: editedListing.price,
        category: editedListing.category,
      });

      // Close the modal or handle any other necessary actions
    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#editModal-${listing.id}`}
      >
        Edit
      </button>

      <div className="modal fade" id={`editModal-${listing.id}`} tabIndex="-1" aria-labelledby={`editModalLabel-${listing.id}`} aria-hidden="true">
        <div className="modal-dialog">
          <form className="d-flex" onSubmit={handleEdit}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`editModalLabel-${listing.id}`}>Edit Listing</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                {/* Add input fields for each editable field */}
                <div className="mb-3">
                  <label htmlFor={`titleInput-${listing.id}`} className="form-label">Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`titleInput-${listing.id}`}
                    value={editedListing.title}
                    onChange={(e) => setEditedListing({ ...editedListing, title: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor={`priceInput-${listing.id}`} className="form-label">Price:</label>
                  <input
                    type="number"
                    className="form-control"
                    id={`priceInput-${listing.id}`}
                    value={editedListing.price}
                    onChange={(e) => setEditedListing({ ...editedListing, price: parseFloat(e.target.value) })}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor={`categoryInput-${listing.id}`} className="form-label">Category:</label>
                  <input
                    type="text"
                    className="form-control"
                    id={`categoryInput-${listing.id}`}
                    value={editedListing.category}
                    onChange={(e) => setEditedListing({ ...editedListing, category: e.target.value })}
                  />
                </div>
                {/* Add more input fields for other editable fields */}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditMarketplaceListing;
