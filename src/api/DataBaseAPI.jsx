import { addDoc, collection, getDoc, doc, query, where, getDocs, updateDoc, deleteDoc, } from "firebase/firestore";
import { firestore, storage} from "../firebaseConfig";
import { getStorage, ref, uploadBytesResumable,getDownloadURL } from "firebase/storage";
import Post from "../components/postComponent";


const userCollection = collection(firestore, "Users");
const postCollection = collection(firestore, "Posts")

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
  
 /**
 * This function takes in the user ID, caption, and an array of URLs that point to the photo content of the post.
 *
 * @param {string} userID - The ID of the user creating the post.
 * @param {string} caption - The caption for the post.
 * @param {Array<string>} photo_urls - An array of URLs pointing to the photo content of the post.
 * @returns {Promise<string|undefined>} The ID of the created post, or undefined if an error occurs.
 */
export const createPostinDB = async (userID, caption, photo_urls,authorUsername) => {
  try {
    const userRef = doc(firestore, "Users/" + userID);
    
    // Get the user's current data
    const userSnapshot = await getDoc(userRef);
    const userData = userSnapshot.data();
    
    const newPost = {
        userId: userID,
        caption: caption,
        photoUrls: photo_urls,
        likes: 0,
        commentsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        num_key: (userData.posts_created || 0) + 1, 
        author:authorUsername
      };
      // Increment the user's post count
      await updateDoc(userRef, {
        posts_created: (userData.posts_created || 0) + 1
      });
    

    
    let result = await addDoc(postCollection, newPost);

    console.log('Post created and user post count updated successfully!');
    return result.id;
  } catch (error) {
    console.error('Error creating post or updating user post count:', error);
  }
};
  export const uploadPostPicture = async (filename, file) => {
    const storage = getStorage();
  
    // Add more file types if needed
    const metadata = {
      contentType: file.type // Dynamically set the content type based on the uploaded file
    };
  
    // Set the path for storing the image in the 'PostPhotos' folder
    const storageRef = ref(storage, `PostPhotos/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
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
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log('File available at', downloadURL);
            resolve(downloadURL);  // Resolve with the download URL
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  };

export const addComment = async (postId, userId, content) => {
  try {
    // Reference to the comments collection
    const commentsRef = firestore.collection('comments');

    // Create a new comment document with an auto-generated ID
    const newComment = {
      postId: postId,           
      userId: userId,           
      content: content,         
      likes: 0,                 
      createdAt: new Date(),    
      updatedAt: new Date()    
    };

    // Add the comment to the collection
    await commentsRef.add(newComment);
    
    // Optionally, you could update the comment count in the post document
    const postRef = firestore.collection('posts').doc(postId);
    await postRef.update({
      commentsCount: firestore.FieldValue.increment(1)
    });

    console.log('Comment added successfully!');
  } catch (error) {
    console.error('Error adding comment:', error);
  }
};

export const deletePost = async (UserID, postID) => {
  try {
    const postPath = `Users/${UserID}/Posts/${postID}`;
    const postDoc = doc(firestore, postPath);

    await deleteDoc(postDoc); 
    
    updateDoc(firestore, "Users/" + UserID )
    
    console.log("Post successfully deleted.");
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};


/**
 * Retrieves a post by the author's username and the post's numerical key.
 * 
 * @param {string} authorUsername - The username of the post's author.
 * @param {number} key - The numerical key of the post.
 * @returns {Promise<Object|undefined>} The data of the post if found, or undefined if not found.
 */
export const getPost = async (authorUsername, key) => {
  try {
    const authorInfo =  await findUserWUsername(authorUsername) 
    
    const authorpfp = authorInfo[1].profilePictureUrl
    
    const q = query(
      collection(firestore, "Posts"),
      where("num_key", "==", key), 
      where("author", "==", authorUsername)
    );

    const result = await getDocs(q);

    // Ensure that there is at least one document in the result
    if (!result.empty) {
      const postDoc = result.docs[0]; // Access the first document
      return [postDoc.id, postDoc.data(), authorpfp]
    } else {
      console.log('No post found with the given key and author.');
      return undefined;
    }

  } catch (error) {
    console.error('Error getting post:', error.message);
    throw error;
  }
};


export const getUserPosts = async (userID) => {
  try {

    
    const querySnapshot = query(
      collection(firestore, "Posts"),
      where("userID", "==", user)
    );

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

/**
 * Adds a like to the given post using the post document ID 
 * @param {string} postID - the id for the post 
 * @param {boolean} add - the add or subtract  
 */
export const addLikeToPost = async (postID) => {
  const postRef = doc(firestore, "Posts/" + postID);
      
    // Get the user's current data
    const postInfo = await getDoc(postRef); 
  
    updateDoc(postRef, {
      likes : postInfo.data().likes + 1
    })
 
}
export const removeLikeToPost = async (postID ) => {
  const postRef = doc(firestore, "Posts/" + postID);
      
    // Get the user's current data
    const postInfo = await getDoc(postRef); 
  
  
    updateDoc(postRef, {
      likes : postInfo.data().likes - 1})

  
}

export const updateUserBio = (userID, newBio) => {
  const userRef = doc(firestore, 'Users/'+ userID)

  updateDoc(userRef, {bio : newBio})
}

/*this function recieves a photo and uploads it to the database where when
the user logs in again it will be there profile picture */
export const uploadProfilePicture = async (filename, file, userDocPath) => {
  const storage = getStorage();

  //add more file tyypes

  const metadata = {
    contentType: 'image/jpg'
  };
  
  const storageRef = ref(storage, 'UserProfilePictures/' + filename);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
  return new Promise((resolve, reject) => {
    uploadTask.on('state_changed',
      (snapshot) => {
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
        reject(error);
      }, 
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log('File available at', downloadURL);

          let userPath = "Users/" + userDocPath;
          const userRef = doc(firestore, userPath);
          await updateDoc(userRef, { profilePictureUrl: downloadURL });

          console.log('Profile picture URL saved to Firestore');
          resolve(downloadURL);  // Resolve with the download URL
        } catch (error) {
          console.error('Error saving profile picture URL:', error);
          reject(error);
        }
      }
    );
  });
};

