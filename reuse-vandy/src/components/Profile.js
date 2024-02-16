import React, { useState, useEffect } from 'react';
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';  // Import necessary storage functions
import { dbUsers, auth } from '../services/firebase.config';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  // eslint-disable-next-line
  const [userId, setUserId] = useState('');
  const [profileCompleted, setProfileCompleted] = useState(false);

  const collectionRef = collection(dbUsers, 'profiles');
  const storage = getStorage();  // Create a storage instance

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Redirect or handle case where user is not authenticated
          return;
        }

        setUserId(user.uid);

        // Fetch user profile from Firestore
        const q = query(collectionRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          const profileData = querySnapshot.docs[0].data();
          setName(profileData.name);
          setAge(profileData.age.toString());
          setBio(profileData.bio);
          setProfileCompleted(true);
          // TODO: set image
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [collectionRef]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const submitProfile = async (e) => {
    e.preventDefault();

    try {
      const user = auth.currentUser;
      if (!user) {
        // Redirect or handle case where user is not authenticated
        return;
      }

      //upload image to storage
      const storageRef = ref(storage);
      const imageRef = ref(storageRef, `profile_images/${name}-${Date.now()}`);
      await uploadBytes(imageRef, profileImage);

      // Get image URL
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image URL:', imageUrl);

      if (profileCompleted) {
        // Update existing profile
        const q = query(collectionRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const profileDocId = querySnapshot.docs[0].id;
        await updateDoc(doc(collectionRef, profileDocId), {
          name,
          age: parseInt(age),
          bio,
          imageUrl,
          timestamp: serverTimestamp(),
        });
      } else {
        // Add new profile
        await addDoc(collectionRef, {
          userId: user.uid,
          name,
          age: parseInt(age),
          bio,
          imageUrl,
          timestamp: serverTimestamp(),
        });

        // Mark profile as completed
        setProfileCompleted(true);
      }

      // reset values
      setName('');
      setAge('');
      setBio('');
      setProfileImage(null);
    } catch (err) {
      console.error('Error updating/adding profile:', err);
    }
  };

  return (
    <div className="profile-container">
      {profileCompleted ? (
      <div>
        <h1>Your Profile</h1>
        <p>Name: {name}</p>
        <p>Age: {age}</p>
        <p>Bio: {bio}</p>
        {/* Add profile image if available */}
        {/* TODO: Add image display */}
      </div>
    ) : (
      <div>
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
      </div>)}

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