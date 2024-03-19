// Profile.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { dbMarketplaceListings, dbUsers, auth } from '../../services/firebase.config';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth'
import ListingCard from '../ListingCard/ListingCard'; // Import the ListingCard component
import EditMarketplaceListing from '../EditMarketplaceListing'; // Import the EditMarketplaceListing component
import './Profile.css';

const Profile = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const collectionRef = collection(dbUsers, 'profiles');
  const storage = getStorage();
  const [userListings, setUserListings] = useState([]);
  const [userNames, setUserNames] = useState({});
  const [currentUser, setCurrentUser] = useState(null); // Initialize currentUser state

  useEffect(() => {
    const fetchUserListings = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Redirect or handle case where user is not authenticated
          return;
        }

        // Fetch user's listings from Firestore
        const q = query(collection(dbMarketplaceListings, 'listings'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const listingsData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setUserListings(listingsData);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchUserListings();
  }, []);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Redirect or handle case where user is not authenticated
          return;
        }

        // Fetch user profile from Firestore
        const q = query(collectionRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          const profileData = querySnapshot.docs[0].data();
          setName(profileData.name);
          setAge(profileData.age.toString());
          setBio(profileData.bio);
          setProfileImage(profileData.imageUrl);
          setProfileCompleted(true);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedOut(true);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const deleteListing = async (id) => {
    try {
      if (window.confirm('Are you sure you want to delete this listing?')) {
        await deleteDoc(doc(dbMarketplaceListings, 'listings', id));
      }
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  return (
    <div className={profileCompleted ? "profile-page" : "profile-container"}>
      {profileCompleted ? (
        <div>
          <h1>Your Profile</h1>
          <img src={profileImage} alt="Profile" />
          <p>Name: {name}</p>
          <p>Age: {age}</p>
          <p>Bio: {bio}</p>
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

      {/* Display user listings */}
      {profileCompleted && (
        <div>
          <h2>Your Listings</h2>
          <div className="row">
            {userListings.map(listing => (
              <div className="col-md-4 mb-3" key={listing.id}>
                <ListingCard
                  id={listing.id}
                  title={listing.title}
                  category={listing.category}
                  price={listing.price}
                  timestamp={listing.timestamp} // Ensure timestamp is passed as a plain object
                  userId={listing.userId}
                  userNames={userNames}
                  currentUser={currentUser}
                  onDelete={deleteListing} // Pass deleteListing function to ListingCard
                />
                {/* Add edit and delete buttons */}
                {currentUser && currentUser.uid === listing.userId && (
                  <div>
                    <EditMarketplaceListing
                      listing={listing}
                      categories={['Furniture', 'Clothing', 'Technology', 'Textbooks', 'Other']}
                    />
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => deleteListing(listing.id)}
                    > Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Button to navigate to another page */}
      {profileCompleted && (
        <div className="top-right-button">
          <Link to="/marketplace">
          <button onClick={handleLogout} className="btn btn-secondary">Log Out</button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Profile;
