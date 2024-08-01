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




export const addFollwing = async (username) =>{
  try {
    const userDoc = await findUser(username)
    const userData = userDoc[1]
    const userDocPath = "Users/" + userDoc[0]
    const userDocRef = doc(firestore, userDocPath);
    const userDocData = await getDoc(userDocRef);
    const userDocDataData = userDocData.data()
    const userDocDataDataFollowing = userDocDataData.following

    if (userDocDataDataFollowing[CurrentUser.username] == null){
      updateDoc(doc(firestore,userDocPath), {
        num_following: parseInt(userData.num_following) + 1,
        following: {
          ...userDocDataDataFollowing,
          [CurrentUser.username]: CurrentUser.username
        }
      });
     console.log("following added"); 
    }
  } catch (error) {
    console.error('Error adding following:', error.message);
    throw error;
  }
}

export const addFollower = async (follower) => {
  try {
    const userDoc = await findUser(follower)
    const userData = userDoc[1]
    const userDocPath = "Users/" + userDoc[0]
    const userDocRef = doc(firestore, userDocPath);
    const userDocData = await getDoc(userDocRef);
    const userDocDataData = userDocData.data()
    const userDocDataDataFollowers = userDocDataData.followers

    if (userDocDataDataFollowers[CurrentUser.username] == null){
      updateDoc(doc(firestore,userDocPath), {
        num_followers: parseInt(userData.num_followers) + 1,
        followers: {
          ...userDocDataDataFollowers,
          [CurrentUser.username]: CurrentUser.username
        }
      });
    }
  } catch (error) {
    console.error('Error adding follower:', error.message);
    throw error;
  }
}

export const addComment = async (postPath, comment) => {
  comment = addDoc(collection(firestore, postPath + '/Comments/'), comment);
  return comment;
}
  

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
        // Since querying by email make it so that just the firts one is the one
        const userDoc = userDocs.docs[0];
        return [userDoc.id, userDoc.data()];
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
      //console.log(JSON.stringify(userDoc.data()));
      return userDoc.data();
    }
  } catch (error) {
    console.log(error);
  }
};


export const getUserPosts = async (userDocPath) => {
  try {
    const collectionRef = collection(firestore, userDocPath + '/Posts');
    const querySnapshot = await getDocs(query(collectionRef));

    const posts = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      posts.push({ ...data });
    });

    return posts;
  } catch (error) {
    console.error('Error getting user posts: ', error);
    throw error;
  }
};

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


export const createPostinDB = async (userEmail, content) => {
  try {
    const userDoc = await findUser(userEmail)
    const userData = userDoc[1]
    const userPostPath  = "Users/" + userDoc[0] + "/Posts"; 
    let date_created = new Date(Date.now());
    let formatted_date = date_created.toLocaleString();

    console.log(userPostPath)
    const Post = await addDoc(collection(firestore, userPostPath), {
        author: userData.username,
        id: (parseInt(userData.posts_created) + 1), 
        date_created: formatted_date,
        content: content ,
        likes: 0, 
        likedBy: [] 
    })
    updateDoc(doc(firestore,"Users/" + userDoc[0]), {
      posts_created: parseInt(userData.posts_created) + 1
    });
    console.log("Post succesfully added to firestore database!");

    return Post;
  } catch (error) {
    console.error('Error creating post in the database:', error.message);
    throw error;
  }
};


export const getPost = async (UserID, ID) => {
  try {
      const CurrentUserPosts = "Users/" + UserID + "/Posts" + ID
      const docRef = doc(firestore, CurrentUserPosts);

      return docRef;

  } catch (error) {
    console.error('Error getting post:', error.message);
    throw error;
  }
};