import { addDoc, collection, getDoc, doc, query, where, getDocs,} from "firebase/firestore";
import { firestore } from "../firebaseConfig";

// Import the user collection
const userCollection = collection(firestore, "Users");

// Adds user to the database
export const addUserDb = async (username, email, password) => {
  try {
    const newDoc = await addDoc(userCollection, {
      username: username,
      email: email,
      password: password,
      followers: 0,
      following: 0
    });

    console.log("user succesfully added to firestore database!");
    return newDoc;
  } catch (error) {
    console.error("Error adding user to database:", error);
    throw error;
  }
};

/*function that is called when a user logs in. It finds the document that has the same 
  the same email as the provided one in the login */
  export const findUser = async (email) => {
    try {
      // Finds the document where the email matches the credential email
      const q = query(
        collection(firestore, "Users"),
        where("email", "==", email)
      );
  
      const userDocs = await getDocs(q);
  
      if (!userDocs.empty) {
        // Since you're querying by email, there might be multiple documents matching the condition.
        // If you expect only one, you can access the first document in the query snapshot.
        const userDoc = userDocs.docs[0];
  
        console.log(JSON.stringify(userDoc.data()));
        return [userDoc.id,userDoc.data()];
      } else {
        console.log("No matching document found.");
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };
  

//Find a doc and returns the json version of the data
export const getUserDocument = async (userID) => {
  try {
    console.log(userID);
    const path = "Users/" + userID;
    const userDocRef = doc(firestore, path);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      console.log(JSON.stringify(userDoc.data()));
      return userDoc.data();
    }
  } catch (error) {
    console.log(error);
  }
};
