// AuthAPI.js
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebaseConfig';

export const RegisterAPI = async (email, password, username) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);

    if (response.user) {
      // Store additional user data in Firestore
      await firestore.collection('users').doc(response.user.uid).set({
        email: response.user.email,
        username: username,
        password: response.user.password
      });

      return response;
    }

    return null; // or handle the case when the user is not present
  } catch (err) {
    console.error(err);
    return err;
  }
};
