// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { dbUsers, auth } from '../../services/firebase.config'
import { signOut } from 'firebase/auth'

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          // Redirect or handle case where user is not authenticated
          return;
        }

        // Fetch user profile from Firestore
        const q = query(collection(dbUsers, 'profiles'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
          const profileData = querySnapshot.docs[0].data();
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedOut(true);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loggedOut) {
    window.location.href = '/';
    return null;
  }

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <h1>Your Profile</h1>
      <img src={profile.imageUrl} alt="Profile" />
      <p>Name: {profile.name}</p>
      <p>Age: {profile.age}</p>
      <p>Bio: {profile.bio}</p>
      {/* Add more details as needed */}

      {/* Button to navigate to edit profile page */}
      {/* <Link to="/edit-profile">
        <button className="btn btn-primary">Edit Profile</button>
      </Link> */}
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default ProfilePage;
