// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjVRGi-_hJqdxjPA9d2jodIG4y7Aj7X0I",
  authDomain: "reuse-vandy-e1cdd.firebaseapp.com",
  projectId: "reuse-vandy-e1cdd",
  storageBucket: "reuse-vandy-e1cdd.appspot.com",
  messagingSenderId: "650685764806",
  appId: "1:650685764806:web:a1886c5af8acab243af3c7",
  measurementId: "G-5DSM14JWXR"
};

const app = initializeApp(firebaseConfig);

// Export the Firestore instance for Marketplace listings
const dbMarketplaceListings = getFirestore(app);

// Export the Firestore instance for Todo items
const dbTodos = getFirestore(app);

// Export the Firestore instance for Profile items
const dbUsers = getFirestore(app);

// Export the Firestore instance for Messages
const dbMessages = getFirestore(app);

// Export the Firestore instance for User Profiles
const dbProfiles = getFirestore(app);

//const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);

// Initialize Firebase Auth provider
const provider = new GoogleAuthProvider();

// whenever a user interacts with the provider, we force them to select an account
provider.setCustomParameters({   
  prompt : "select_account "
});

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export { dbMarketplaceListings, dbTodos, dbUsers, db, storage, dbProfiles, dbMessages }; // auth?
