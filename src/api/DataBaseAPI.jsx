import { addDoc, collection, getDoc, doc, query, where, getDocs, updateDoc, } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'; // Import your Firebase Storage configuration
import { firestore, storage} from "../firebaseConfig";

// Import the user collection
const userCollection = collection(firestore, "Users");

// Adds user to the database
export const addUserDb = async (username, email, password) => {
  try {
    const newUser = await addDoc(userCollection, {
      username: username,
      email: email,
      password: password,
      num_followers: 0,
      followers: {},
      num_following: 0, 
      following: {},
      posts_created: 0
    });
     doc(firestore, newUser.path)
    console.log("user succesfully added to firestore database!");
    return newUser;

  } catch (error) {
    console.error("Error adding user to database:", error);
    throw error;
  }
};


export const createPostinDB = async (userEmail, content, ID) => {
  try {
    const userDoc = findUser(userEmail)
    const userData = userDoc[1]
    userDocPath  = userDoc[0]; 
    doc = collection('users').doc(userDoc).collection("posts").addDoc({
        author: userData.username,
        id: (userData.posts_created + 1), 
        date_created: Date.now().toString(),
        content: content ,
        likes: 0
    })

    userData.posts_created += 1; 

    return ;
  } catch (error) {
    console.error('Error creating post in the database:', error.message);
    throw error;
  }
};

export const getPost = async (userEmail, ID) => {
  try {
      CurrentUserPosts = collection('users').doc(findUser(userEmail[0])).collection("posts")
      const q = query(CurrentUserPosts,where("id", "==", ID) )
      const Posts = getDocs(q)

      if (!Posts.empty) {
        // Since you're querying by email, there might be multiple documents matching the condition.
        // If you expect only one, you can access the first document in the query snapshot.
        const currentPost = Posts.docs[0];
        console.log(JSON.stringify(userDoc.data()));
        return [currentPost];
      }
    }
      catch (error){
        console.error('Error adding like to post in database:',error.message )
        throw error;
      }
    }
     


export const addFollwing = async () =>{
  //to do
}

export const addFollower = async () => {
  //to do
}



export const storePhoto = async (photo) => {
    try {
      // Create a storage reference with a unique name
      const storageRef = ref(storage, `photos/${Date.now()}_${photo.name}`);
  
      // Upload the file
      const uploadTask = uploadBytesResumable(storageRef, photo);
  
      // Get the download URL once the upload is complete
      const snapshot = await uploadTask;
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // You can use the downloadURL to save it in the database or use it as needed
      console.log('File available at', downloadURL);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading photo:', error.message);
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

export const getFirstThreeDocuments = async (collectionName) => {
  try {
    const collectionRef = collection(db, collectionName);
    const querySnapshot = await getDocs(query(collectionRef));

    const documents = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      documents.push({ id: doc.id, ...data });
    });

    return documents;
  } catch (error) {
    console.error('Error getting documents: ', error);
    throw error;
  }
};

updateDoc()