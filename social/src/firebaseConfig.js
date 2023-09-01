// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6L2ChHR7z5fC1xt8RsG6P7aK1mIbFjJQ",
  authDomain: "social-7ea6f.firebaseapp.com",
  projectId: "social-7ea6f",
  storageBucket: "social-7ea6f.appspot.com",
  messagingSenderId: "283683778684",
  appId: "1:283683778684:web:1b0215d63f7a1a9d1799f9",
  measurementId: "G-SFBY5DPWMM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth,app}