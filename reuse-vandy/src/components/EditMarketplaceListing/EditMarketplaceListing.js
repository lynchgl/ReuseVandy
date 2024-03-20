import React, { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { dbMarketplaceListings, auth } from '../../services/firebase.config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './EditMarketplaceListing.css'

const EditMarketplaceListing = ({ listing, categories }) => {
  const [editedListing, setEditedListing] = useState({ ...listing });
  const [image, setImage] = useState(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    try {
      const documentRef = doc(dbMarketplaceListings, 'listings', listing.id);
      const updates = {
        title: editedListing.title,
        price: editedListing.price,
        category: editedListing.category,
      };

      // If there's a new image, upload it and update the image URL
      if (image) {
        const storage = getStorage();
        const storageRef = ref(storage);
        const imageRef = ref(storageRef, `listing_images/${listing.id}-${Date.now()}`);
        await uploadBytes(imageRef, image);
        const imageUrl = await getDownloadURL(imageRef);
        updates.imageUrl = imageUrl;
      }

      await updateDoc(documentRef, updates);

      // Reload the page after saving changes
      window.location.reload();

    } catch (error) {
      console.error('Error updating listing:', error);
    }
  };

  const user = auth.currentUser;

  return (
    <>
      {user && (
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target={`#editModal-${listing.id}`}
        >
          Edit
        </button>
      )}
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
                  <select
                    className="form-select"
                    id={`categoryInput-${listing.id}`}
                    value={editedListing.category}
                    onChange={(e) => setEditedListing({ ...editedListing, category: e.target.value })}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor={`priceInput-${listing.id}`} className="form-label">Price:</label>
                  <input
                    type="file"
                    className="form-control"
                    id={`imageInput-${listing.id}`}
                    onChange={(e) => handleImageUpload(e)}
                  />
                </div>
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