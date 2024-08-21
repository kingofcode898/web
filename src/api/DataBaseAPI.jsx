import { addDoc, collection, getDoc, doc, query, where, getDocs, updateDoc, } from "firebase/firestore";
import { firestore, storage} from "../firebaseConfig";
import { getStorage, ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";

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

/*This will be the function that allows a user to follow*/
export const addFollow = async (currrentUsername, FollowUsername) => {
  try {
    // Find the main user and the user to be followed
    const currentUserInfo = await findUserWUsername(currrentUsername);
    const UserToBeFollowed = await findUserWUsername(FollowUsername); // aka UTBF

    // Paths to user documents
    const currentUserPath = "Users/" + currentUserInfo[0];
    const UTBFPath = "Users/" + UserToBeFollowed[0];

    // References to Firestore documents
    const currentUserRef = doc(firestore, currentUserPath);
    const UTBFRef = doc(firestore, UTBFPath);

    // Update following information for the current user
    const new_num_following = currentUserInfo[1].num_following + 1;
    const new_following = [...currentUserInfo[1].following, FollowUsername];

    // Update followers information for the user to be followed
    const new_num_followers = UserToBeFollowed[1].num_followers + 1;
    const new_followers = [...UserToBeFollowed[1].followers, currrentUsername];

    // Perform updates in Firestore
    await updateDoc(currentUserRef, { following: new_following, num_following: new_num_following });
    await updateDoc(UTBFRef, { followers: new_followers, num_followers: new_num_followers });

    console.log(`${currrentUsername} is now following ${FollowUsername}`);

  } catch (error) {
    console.error("Error in the follow process: ", error.message);
    throw error;
  }
};

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

  // Finds the document where the username matches the given username
  export const findUserWUsername = async (username) => {
    try {
      
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

export const getPostwUsername = async (username, postid) => {
  try {
    const userInfo = await findUserWUsername(username);
    const UserPostsPath = "Users/" + userInfo[0] + "/Posts";

    const q = query(
      collection(firestore, UserPostsPath),
      where("id", "==", postid)
    );

    const result = await getDocs(q);
    let postDoc = null;

    result.forEach((doc) => {
      postDoc = doc; // In case of multiple documents, it will store the last one
    });

    if (postDoc) {
      return postDoc.data();
    } else {
      console.log("No post found with the specified ID");
      return null;
    }
  } catch (error) {
    console.error("Error getting post:", error.message);
    throw error;
  }
};




export const getUserPosts = async (userDocID) => {
  try {
    const userDocPath = "Users/" + userDocID

    const userPostCollectionRef = collection(firestore, userDocPath + '/Posts');
    const querySnapshot = await getDocs(query(userPostCollectionRef));

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

export const deletePost = (postid, userID) => {
  const userPostCollection = userID
}

export const updateUserBio = (userID, newBio) => {
  const userRef = doc(firestore, 'Users/'+ userID)

  updateDoc(userRef, {bio : newBio})
}

/*this function recieves a photo and uploads it to the database where when
the user logs in again it will be there profile picture */
export const uploadProfilePicture = async (filename, file, userDocPath) => {
  const storage = getStorage();
  
  // Create the file metadata
  /** @type {any} */
  const metadata = {
    contentType: 'image/jpg'
  };
  
  // Upload file and metadata to the object 'profilePic/filename.jpg'
  const storageRef = ref(storage, 'UserProfilePictures/' + filename);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
      }
    }, 
    (error) => {
      console.error('Error during upload:', error);
    }, 
    async () => {
      // Upload completed successfully, now we can get the download URL
      try {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log('File available at', downloadURL);

        // Store the download URL in Firestore
        let userPath = "Users/" + userDocPath
        const userRef = doc(firestore, userPath);
        await updateDoc(userRef, { profilePictureUrl: downloadURL});

        console.log('Profile picture URL saved to Firestore');
        return downloadURL
      } catch (error) {
        console.error('Error saving profile picture URL:', error);
      }
    }
  );
}