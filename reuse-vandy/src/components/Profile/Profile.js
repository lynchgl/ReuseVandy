import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { dbUsers, auth } from '../../services/firebase.config';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth'
import './Profile.css';
import MarketplacePage from '../MarketplacePage/MarketplacePage';

const Profile = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [qrCode, setQrCode] = useState(null); // State for QR code
  const [profileCompleted, setProfileCompleted] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [favorites, setFavorites] = useState([]); // Add favorites state
  const collectionRef = collection(dbUsers, 'profiles');
  const storage = getStorage();
  const [activeTab, setActiveTab] = useState('listings');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  }

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
          setQrCode(profileData.qrCodeUrl);
          setProfileCompleted(true);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          console.log("User:", user);
          const userRef = doc(dbUsers, 'profiles', user.uid); // Reference to user's profile document
          console.log("User Ref:", userRef);
          const userSnapshot = await getDoc(userRef); // Retrieve the profile document
          console.log("User Snapshot:", userSnapshot);
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data(); // Extract user data
            console.log("User Data:", userData);
            setFavorites(userData.favorites || []); // Set favorites from user data, or an empty array if not present
          }
        }
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };


    fetchProfile();
    fetchFavorites(); // Call fetchFavorites

  }, [collectionRef]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
  };

  const handleQrCodeUpload = (e) => {
    const file = e.target.files[0];
    setQrCode(file); // Set QR code
  };

  const submitProfile = async (e) => {
    console.log('Submit button clicked');
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

      //upload qr code to storage
      const qrRef = ref(storageRef, `qr_codes/${name}-${Date.now()}`);
      await uploadBytes(qrRef, qrCode);

      // Get image URL
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image URL:', imageUrl);

      // Get qr code URL
      const qrCodeUrl = await getDownloadURL(qrRef);
      console.log('QR Code: ', qrCodeUrl);

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
          qrCodeUrl,
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
          qrCodeUrl,
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
      setQrCode(null);
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

  // FIXME - favorites tab currently displays all listings
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          {profileCompleted ? (
            <>
              <div className="profile-info">
                <div className="profile-details">
                  <div className="profile-details-left">
                    <img src={profileImage} alt="Profile" className="profile-img" />
                    <p>Name: {name}</p>
                    <p>Age: {age}</p>
                    <p>Bio: {bio}</p>
                   
                  </div>
                  <div className="profile-details-right">
                    <img src={qrCode} alt="QR Code" className="qr-code-img" />
                  </div>
                </div>
                <Link to="/marketplace">
                  <button onClick={handleLogout} className="btn btn-secondary">Log Out</button>
                </Link>
              </div>
              <div className="tabs">
                <button
                  className={activeTab === 'listings' ? 'active' : ''}
                  onClick={() => handleTabChange('listings')}
                >
                  Your Listings
                </button>
                <button
                  className={activeTab === 'favorites' ? 'active' : ''}
                  onClick={() => handleTabChange('favorites')}
                >
                  Your Favorites
                </button>
              </div>
              <div className="tab-content">
                {activeTab === 'listings' && <MarketplacePage currentUserOnly />}
                {activeTab === 'favorites' && <MarketplacePage favorites={favorites} />}
              </div>
            </>
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
                  <label htmlFor="qrCodeInput">Venmo QR Code:</label>
                  <input
                    type="file"
                    className="form-control-file"
                    id="imageInput"
                    accept="image/*"
                    onChange={(e) => handleQrCodeUpload(e)}
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;