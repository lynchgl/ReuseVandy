import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { dbMarketplaceListings, auth } from '../../services/firebase.config';
import './SellItem.css';

const SellItemPage = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const categories = ['Home', 'Clothes', 'Books', 'Jewelry', 'Electronics', 'Toys', 'Other'];

  
  const submitListing = async (e) => {
    e.preventDefault();

    try {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        throw new Error('Invalid price. Please enter a valid number.');
      }

      const user = auth.currentUser;

      if (!user) {
        throw new Error('Please sign in before listing an item.');
      }

      await addDoc(collection(dbMarketplaceListings, 'listings'), {
        title,
        price: parsedPrice,
        category,
        userId: user.uid, // Associate the listing with the user ID
        timestamp: serverTimestamp(),
      });
      setTitle('');
      setPrice('');
      setCategory('');
      window.location.href = '/';
    } catch (err) {
      console.error('Error adding listing:', err);
      setError(err.message);
    }
  };

  return (
    <div className="sell-item-page">
      <h1>Sell an Item</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if exists */}
      <form onSubmit={submitListing}>
        <div className="form-group">
          <label htmlFor="titleInput">Title:</label>
          <input
            type="text"
            id="titleInput"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="priceInput">Price:</label>
          <div className="price-input-wrapper">
            <span className="dollar-sign">$</span>
            <input
              type="number"
              id="priceInput"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="categoryInput">Category:</label>
          <select
            id="categoryInput"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SellItemPage;
