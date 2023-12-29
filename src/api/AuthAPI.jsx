// AuthAPI.js
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const RegisterAPI = async (email, password) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);

    return response; // or handle the case when the user is not present
  } catch (err) {
    console.error(err);
    return err;
  }
};

export const LoginAPI = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password);

    // Optionally, you can return only the necessary user information
    const userInformation = {
      uid: response.user.uid,
      email: response.user.email,
    };

    return response
  } catch (err) {
    console.error(err);
    return err;
  }
};


