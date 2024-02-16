import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Import necessary storage functions
import { dbUsers } from '../services/firebase.config';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);

  const collectionRef = collection(dbUsers, 'profiles');
  const storage = getStorage();  // Create a storage instance

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const submitProfile = async (e) => {
    e.preventDefault();

    try {
      //upload image to storage
      const storageRef = ref(storage);
      const imageRef = ref(storageRef, `profile_images/${name}-${Date.now()}`);
      await uploadBytes(imageRef, profileImage);

      // Get image URL
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image URL:', imageUrl);

      // Add profile to Firestore with image URL
      await addDoc(collectionRef, {
        name,
        age: parseInt(age),
        bio,
        imageUrl,
        timestamp: serverTimestamp(),
      });
      setName('');
      setAge('');
      setBio('');
      setProfileImage(null);
    } catch (err) {
      console.error('Error adding profile:', err);
    }
  };

  return (
    <div className="profile-container">
      <h1>Fill out your profile</h1>
      <form onSubmit={submitProfile}>
        <div className="form-group">
          <label htmlFor="imageInput">Photo:</label>
          <input
            type="file"
            className="form-control-file"
            id="imageInput"
            accept="image/*"
            onChange={(e) => handleImageUpload(e)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="nameInput">Name:</label>
          <input
            type="text"
            className="form-control"
            id="nameInput"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="ageInput">Age:</label>
          <input
            type="number"
            className="form-control"
            id="ageInput"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="bioInput">Bio:</label>
          <textarea
            className="form-control"
            id="bioInput"
            rows="3"
            placeholder="Enter your bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>

      {/* Button to navigate to another page */}
      <div className="top-right-button">
        <Link to="/Marketplace">
          <button className="btn btn-secondary">Go to Marketplace</button>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
