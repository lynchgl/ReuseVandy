import React, { useState } from 'react';
import { signInWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { auth, signInWithGooglePopup } from '../../services/firebase.config';
import { Link } from 'react-router-dom';
import googleSignIn from '../../images/google-signin.png'
import './SignIn.css'; // Import the CSS file for styling

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [firstTime, setFirstTime] = useState(null);

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
      const response = await signInWithGooglePopup();

      const { email } = response.user;

      // check if new user
      const creationTime = response.user.metadata.creationTime
      const lastLogIn = response.user.metadata.lastSignInTime

      if (!email || !email.endsWith('@vanderbilt.edu')) {
        setError('Email must end with @vanderbilt.edu');

        const user = auth.currentUser;

        deleteUser(user).then(() => {
          console.log("User deleted!");
        })

        auth.signOut();
      } else if (creationTime === lastLogIn) {
        console.log("This is a new user")
        setFirstTime("This is a first time user!")
      } else {
        setSuccess('Sign-in successful!');
      }
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

  if (firstTime) {
    window.location.href = '/profile';
    return null;
  }

  return (
    <div className="signin-container">
      <h2 className="signin-title">Sign In to Reuse Vandy</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error if exists */}
      {success && <div className="success-message">{success}</div>} {/* Display success if exists */}

      <div>
        <img 
          className='google-signin-image'
          src={googleSignIn} 
          alt="Sign in with Google" 
          onClick={logGoogleUser} 
        />
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
