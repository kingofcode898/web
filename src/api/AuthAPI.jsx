import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export const RegisterAPI = async (email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);
    return response;
  } catch (err) {
    console.error('Error in registration:', err);
    return err;
  }
};

export const LoginAPI = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    return response;
  } catch (err) {
    console.error('Error in login:', err);
    return false;
  }
};

export const GoogleSignInAPI = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const response = await signInWithPopup(auth, provider);
    return response;
  } catch (err) {
    console.error('Error in Google Sign-In:', err);
    return false;
  }
};

export const logoutAPI = () => {
  
}