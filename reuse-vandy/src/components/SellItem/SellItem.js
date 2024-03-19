import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { dbMarketplaceListings, auth } from '../../services/firebase.config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './SellItem.css';

const SellItemPage = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [image, setImage] = useState(null)
  const categories = [
    { name: 'Home', subcategories: ['Furniture', 'Decorations', 'Appliances', 'Kitchen'] },
    { name: 'Apparel', subcategories: ['Clothing', 'Jewelry'] },
    { name: 'Books', subcategories: ['Textbooks', 'Other books'] },
    { name: 'Technology', subcategories: [] },
    { name: 'Other', subcategories: [] }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  }

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

      let imageUrl = '';
      if (image) {
        const storage = getStorage();
        const storageRef = ref(storage);
        const imageRef = ref(storageRef, 'listing_images/${title}-${Date.now()');
        await uploadBytes(imageRef, image);

        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(dbMarketplaceListings, 'listings'), {
        title,
        price: parsedPrice,
        category,
        userId: user.uid, // Associate the listing with the user ID
        imageUrl,
        timestamp: serverTimestamp(),
      });
      setTitle('');
      setPrice('');
      setCategory('');
      setSelectedMainCategory('');
      setImage(null);
      setError('');
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
            {categories.map((mainCategory, index) => (
              <optgroup key={index} label={mainCategory.name}>
                {mainCategory.subcategories.map((subcategory, subIndex) => (
                  <option key={subIndex} value={subcategory}>{subcategory}</option>
                ))}
                {mainCategory.subcategories.length === 0 && (
                  <option key={mainCategory.name} value={mainCategory.name}>{mainCategory.name}</option>
                )}
              </optgroup>
            ))}
          </select>
        </div>
        {/* Input field for image upload */}
        <div className="form-group">
          <label htmlFor="imageInput">Upload Image:</label>
          <input
            type="file"
            id="imageInput"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SellItemPage;
