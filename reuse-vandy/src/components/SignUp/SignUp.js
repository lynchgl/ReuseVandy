// SignUp.js

import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../services/firebase.config.js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();

     // Check if email ends with "@vanderbilt.edu"
     if (!email.endsWith('@vanderbilt.edu')) {
      setError('Email must end with "@vanderbilt.edu"');
      return;
    }

    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      await addDoc(collection(db, 'users'), {
        userId: user.uid,
        email: user.email,
        name: '',
        age: null,
        bio: '',
        imageUrl: '',
        timestamp: serverTimestamp(),
      });
      
      setSuccess('Sign-up successful!'); // Set success message in state
      setError(null); // Reset error state

    } catch (error) {
      setError(error.message); // Set the error message in state
      console.error('Error creating user:', error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>} {/* Display error if exists */}
      {success && <div style={{ color: 'green' }}>{success}</div>} {/* Display success if exists */}
      
      <form onSubmit={handleSignUp}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
