import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { dbUsers } from '../services/firebase.config';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');

  const collectionRef = collection(dbUsers, 'profiles');

  const submitProfile = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collectionRef, {
        name,
        age: parseInt(age),
        bio,
        timestamp: serverTimestamp(),
      });
      setName('');
      setAge('');
      setBio('');
    } catch (err) {
      console.error('Error adding profile:', err);
    }
  };

  return (
    <div className="profile-container">
      <h1>Fill out your profile</h1>
      <form onSubmit={submitProfile}>
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
