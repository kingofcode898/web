import { addDoc, collection, getDoc, doc, query, where, getDocs, updateDoc, deleteDoc, orderBy, limit } from "firebase/firestore";
import { firestore, storage} from "../firebaseConfig";
import { getStorage, ref, uploadBytesResumable,getDownloadURL ,deleteObject} from "firebase/storage";
import Post from "../components/postComponent";
import { Timestamp } from "firebase/firestore";


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

export const deletePost = async (postID,userId) => {
  try {
    const postPath = `Posts/${postID}`;
    const postDocRef = doc(firestore, postPath);

    const userDoc= doc(firestore, `Users/${user}`)
    
    // Get the post document
    const postSnapshot = await getDoc(postDocRef);
    
    if (!postSnapshot.exists()) {
      throw new Error("Post not found.");
    }

    const postData = postSnapshot.data();
    const photoUrls = postData.photoUrls; // Assuming 'photos' is the array of URLs

    const getStoragePathFromUrl = (url) => {
      const startIndex = url.indexOf("/o/") + 3;
      const endIndex = url.indexOf("?alt=");
      return decodeURIComponent(url.substring(startIndex, endIndex));
    };

    
    const deletePhotoPromises = photoUrls.map(async (url) => {
      const storagePath = getStoragePathFromUrl(url); // Extract the storage path
      const photoRef = ref(storage, storagePath); // Get the reference to the file
      await deleteObject(photoRef).then(() => {
        console.log("Photo deleted: " + storagePath)
      }).catch((error) =>{
        console.log("Error deleting the photo" + error)
      }); // Delete the file
    });

    // Wait for all photos to be deleted
    await Promise.all(deletePhotoPromises);

    // Now delete the post document
    await deleteDoc(postDocRef);

  

    console.log("Post and associated photos successfully deleted.");
  } catch (error) {
    console.error("Error deleting post or photos:", error);
  }
};

export const getPost = async (authorUsername, timestamp) => {
  try {
    const authorInfo = await findUserWUsername(authorUsername);
    const authorpfp = authorInfo[1].profilePictureUrl;

    const timestampFirestore = Timestamp.fromMillis(timestamp)

    console.log(timestampFirestore)

    const q = query(
      collection(firestore, "Posts"),
      where("author", "==", authorUsername),
      where("createdAt", "<=",timestampFirestore ), // Ensure timestamp is a Date object
      orderBy("createdAt", "desc"), // Order by timestamp descending
      limit(1)
    );

    const result = await getDocs(q);

    if (!result.empty) {
      const postDoc = result.docs[0];
      return [postDoc.id, postDoc.data(), authorpfp];
    } else {
      console.log('No post found before the given timestamp for the author.');
      return undefined;
    }

  } catch (error) {
    console.error('Error getting post:', error.message);
    throw error;
  }
};

export const getUserPosts = async (userID) => {
  try {
    // Create a query to get posts where the userId matches
    const q = query(
      collection(firestore, "Posts"),
      where("userId", "==", userID), // Ensure this matches the field name exactly
      orderBy("createdAt", "desc")   // Order posts by creation date in descending order
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Map through the documents and collect the data into an array
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return posts;
  } catch (error) {
    console.error('Error getting user posts: ', error);
    throw error;
  }
};
/**
 * Toggles the like status of a post for a given user. If the user has already liked the post,
 * it will remove the like (unlike). If the user has not liked the post yet, it will add a like.
 * 
 * The function performs the following actions:
 * 1. Checks whether the user has already liked the post by querying the `Likes` collection.
 * 2. If the user has liked the post, it removes the like and decrements the post's like count.
 * 3. If the user has not liked the post, it adds a new like entry and increments the post's like count.
 * 
 * @param {string} postID - The unique identifier of the post being liked/unliked.
 * @param {string} userID - The unique identifier of the user performing the like/unlike action.
 * 
 * @throws Will throw an error if there is an issue accessing the database or updating records.
 * 
 * @example
 * // Example usage:
 * toggleLike("12345", "user_abc")
 *   .then(() => console.log("Like toggled successfully"))
 *   .catch((error) => console.error("Error toggling like:", error));
 * 
 * @returns {Promise<void>} A promise that resolves when the like/unlike operation is complete.
 */
export const toggleLike = async (postID, userID) => {
  try {
    const likesDocRef = doc(firestore, `Likes/${postID}_${userID}`); // Use a composite ID for like tracking
    const postDocRef = doc(firestore, `Posts/${postID}`);

    const likeSnapshot = await getDoc(likesDocRef);
    
    if (likeSnapshot.exists()) {
      // User has already liked the post, so we unlike it
      await deleteDoc(likesDocRef); // Remove like record
      await updateDoc(postDocRef, {
        likesCount: increment(-1)  // Decrease like count
      });
      console.log("Post unliked.");
    } else {
      // User has not liked the post, so we like it
      await re(likesDocRef, {
        userID: userID,
        postID: postID,
        timestamp: new Date().toISOString()
      });
      await updateDoc(postDocRef, {
        likesCount: increment(1)  // Increase like count
      });
      console.log("Post liked.");
    }
  } catch (error) {
    console.error("Error toggling like:", error);
  }
};

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

