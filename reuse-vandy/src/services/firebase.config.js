// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBjVRGi-_hJqdxjPA9d2jodIG4y7Aj7X0I",
  authDomain: "reuse-vandy-e1cdd.firebaseapp.com",
  projectId: "reuse-vandy-e1cdd",
  storageBucket: "reuse-vandy-e1cdd.appspot.com",
  messagingSenderId: "650685764806",
  appId: "1:650685764806:web:a1886c5af8acab243af3c7",
  measurementId: "G-5DSM14JWXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);


export const db = getFirestore(app);