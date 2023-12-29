import { addDoc, collection, getDoc, doc} from "firebase/firestore";
import { firestore } from "../firebaseConfig";


// Import the user collection
const userCollection = collection(firestore, 'Users');

// Adds user to the database
export const addUserDb = async (username, email, password) => {
  try {
    const newDoc = await addDoc(userCollection, {
      username: username,
      email: email,
      password: password,
      followers: 0
    });

    console.log('user succesfully added to firestore database!')
    return newDoc
  } catch (error) {
    console.error("Error adding user to database:", error);
    throw error;
  }
};


//Find a doc and returns the json version of the data
export const getUserDocument = async (userID) => {
  try {
    console.log(userID)
    const path = "Users/" + userID;
    const userDocRef = doc(firestore, path);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
        console.log(JSON.stringify(userDoc.data()))
        return userDoc.data();
    }
  } catch (error) {
    console.log(error);
  }
};
