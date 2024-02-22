import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../services/firebase.config.js';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { Navigate, Link } from 'react-router-dom';
import './SignUp.css'; // Import SignUp.css file for styling
import hideIcon from '../../images/hide password.png'
import showIcon from '../../images/show password.png'

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileCreated, setProfileCreated] = useState(false);
  const [passwordLengthValid, setPasswordLengthValid] = useState(false);
  const [passwordUpperCaseValid, setPasswordUpperCaseValid] = useState(false);
  const [passwordNumberValid, setPasswordNumberValid] = useState(false);
  const [passwordSpecialCharValid, setPasswordSpecialCharValid] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Check if email ends with "@vanderbilt.edu"
    if (!email.endsWith('@vanderbilt.edu')) {
      setError('Email must end with "@vanderbilt.edu"');
      return;
    }

    // Check for invalid characters in the password
    const invalidCharsRegex = /[^A-Za-z\d@$!%*?&\s]/;
    if (invalidCharsRegex.test(password)) {
      setError('Password contains invalid characters. Only letters, numbers, and the following special characters are allowed: @$!%*?&');
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!password.match(passwordRegex)) {
      setError('Password must be at least 12 characters long and contain at least one uppercase letter, one number, and one special character.');
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
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
      setProfileCreated(true);

    } catch (error) {
      setError(error.message); // Set the error message in state
      console.error('Error creating user:', error.message);
    }
    setProfileCreated(true);
  };

  if (profileCreated) {
    return <Navigate to="/profile" />;
  }

  const updatePasswordValidity = (password) => {
    setPasswordLengthValid(password.length >= 12);
    setPasswordUpperCaseValid(/[A-Z]/.test(password));
    setPasswordNumberValid(/\d/.test(password));
    setPasswordSpecialCharValid(/[!@#$%%^&*]/.test(password));
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {error && <div className="error-message">{error}</div>} {/* Display error if exists */}
      {success && <div className="success-message">{success}</div>} {/* Display success if exists */}

      <form onSubmit={handleSignUp}>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label>Password:</label>
        <div className="password-input-container">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              updatePasswordValidity(e.target.value);
            }}
            required
          />
          <button
            type="button"
            className="password-toggle-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            <img src={showPassword ? hideIcon : showIcon} alt={showPassword ? 'Hide' : 'Show'} />
          </button>
        </div>

        <div className="password-restrictions">
          <div className={`restriction-message ${passwordLengthValid ? 'valid' : 'invalid'}`}>
            {passwordLengthValid ? '✓' : '✕'} Password must be at least 12 characters long.
          </div>
          <div className={`restriction-message ${passwordUpperCaseValid ? 'valid' : 'invalid'}`}>
            {passwordUpperCaseValid ? '✓' : '✕'} Password must contain at least one uppercase letter.
          </div>
          <div className={`restriction-message ${passwordNumberValid ? 'valid' : 'invalid'}`}>
            {passwordNumberValid ? '✓' : '✕'} Password must contain at least one number.
          </div>
          <div className={`restriction-message ${passwordSpecialCharValid ? 'valid' : 'invalid'}`}>
            {passwordSpecialCharValid ? '✓' : '✕'} Password must contain at least one special character (!@#$%^&*).
          </div>
        </div>

        <label>Confirm Password:</label>
        <div className="password-input-container">
          <input
            type={showConfirmedPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="password-toggle-icon"
            onClick={() => setShowConfirmedPassword(!showConfirmedPassword)}
          >
            <img src={showPassword ? hideIcon : showIcon} alt={showPassword ? 'Hide' : 'Show'} />
          </button>
        </div>

        <button type="submit">Sign Up</button>

        <p className="small-text">Already have an account? <Link to="/signin">Sign In</Link></p>
      </form>
    </div>
  );
};

export default SignUp;
