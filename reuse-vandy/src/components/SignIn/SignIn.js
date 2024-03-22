import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGooglePopup } from '../../services/firebase.config';
import { Link } from 'react-router-dom';
import './SignIn.css'; // Import the CSS file for styling

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Sign-in successful!'); // Set success message in state
    } catch (error) {
      setError(error.message); // Set the error message in state
      console.error('Error signing in:', error.message);
    }
  };

  const logGoogleUser = async () => {
    try {
      await signInWithGooglePopup();
      setSuccess('Sign-in successful!'); // Set success message in state
    } catch (error) {
      setError(error.message); // Set the error message in state
      console.error('Error signing in with Google:', error.message);
    }
  };

  // Render home page if sign-in is successful, redirect to home page
  if (success) {
    window.location.href = '/';
    return null;
  }

  return (
    <div className="signin-container">
      <h2 className="signin-title">Sign In to Reuse Vandy</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error if exists */}
      {success && <div className="success-message">{success}</div>} {/* Display success if exists */}

      <div>
        <button onClick={logGoogleUser}>Sign In With Google</button>
      </div>

      <form className="signin-form" onSubmit={handleSignIn}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

        <button type="submit">Sign In</button>

        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default SignIn;
