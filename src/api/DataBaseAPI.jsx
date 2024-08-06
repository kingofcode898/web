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
      followers: [],
      num_following: 0, 
      following: [],
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

/*This will be the function that the user n*/
export const addFollow = async (currrentUsername, FollowUser) => 
  {
    try {
      //find the main user 
      currentUserInfo = await findUserWUsername(currrentUsername)
      UserToBeFollowed = await findUserWUsername(FollowUser)
      //for main user add the following person in their follwing 
      
      //for the UTBF add the user in their followers 
      //increase both by one
    } catch (error) {
      console.error("Error in the follow process: ", error.message)
      throw error
    }
}

export const addComment = async (postPath, comment) => {
  try {
    comment = addDoc(collection(firestore, postPath + '/Comments/'), comment);
    return comment;
  
  } catch (error) {
    console.error("error adding a comment: ", error.message)
    throw error
  }
}
  

/*function that is called when a user logs in. It finds the document that has the same 
  the same email as the provided one in the login */
  export const findUserWEmail = async (email) => {
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

  export const findUserWUsername = async (username) => {
    try {
      // Finds the document where the username matches the given username
      const q = query(
        collection(firestore, "Users"),
        where("username", "==", username)
      );
  
      const userDocs = await getDocs(q);
  
      if (!userDocs.empty) {
        const userDoc = userDocs.docs[0];
        return [userDoc.id, userDoc.data()];
      } else {
        console.log("Couldn't find that user");
        return null;
      }
    } catch (error) {
      console.error(error);
    }
  };
  

/*This function takes in the userEmail and finds their information based on that*/
export const createPostinDB = async (userEmail, content) => {
  try {
    const userDoc = await findUserWEmail(userEmail)
    const userData = userDoc[1]
    const userPostPath  = "Users/" + userDoc[0] + "/Posts"; 
    let date_created = new Date(Date.now());
    let formatted_date = date_created.toLocaleString();

    const Post = await addDoc(collection(firestore, userPostPath), {
        author: userData.username,
        id: (parseInt(userData.posts_created) + 1), 
        date_created: formatted_date,
        content: content,
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

/*  This function takes in the userID and the Id of the post, The UserID is the users
    document in the database while the postID is what gets queryed for. The post ID
    increment up from zero. There froer the most recent ones are the ones at the top 
    of the list. */
export const getPost = async (UserID, ID) => {
  try {
      const UserPostsPath = "Users/" + UserID + "/Posts"

      const q = query(
        collection(firestore, UserPostsPath),
        where("id", "==", ID)
      );
  
      const result = await getDocs(q);
      const postDoc = result[0]
      console.log(postDoc.data())
      return postDoc.data()

  } catch (error) {
    console.error('Error getting post:', error.message);
    throw error;
  }
};

  //plural version 
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