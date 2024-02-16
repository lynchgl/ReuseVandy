// ProfilePage.js
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { dbUsers, auth } from '../services/firebase.config';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

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
    </div>
  );
};

export default ProfilePage;
