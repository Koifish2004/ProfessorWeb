// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "grademyprof-d35a4.firebaseapp.com",
  projectId: "grademyprof-d35a4",
  storageBucket: "grademyprof-d35a4.firebasestorage.app",
  messagingSenderId: "511570494587",
  appId: "1:511570494587:web:d8d41b1b2b795d8368cede",
  measurementId: "G-3M5ZCGW90N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
