import {
  addDoc,
  collection,
  getDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
  increment,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { firestore, storage } from "../firebaseConfig";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
const bcrypt = require('bcrypt');

const userCollection = collection(firestore, "Users");
const postCollection = collection(firestore, "Posts");

// Adds a user to the database with secure password handling
export const addUserDb = async (username, email, password) => {
  try {
    // Hash the password before storing (you'll need to implement hashPassword)
    const hashedPassword = await hashPassword(password);

    const newUserRef = doc(userCollection);
    await setDoc(newUserRef, {
      username,
      email,
      password: hashedPassword,
      num_followers: 0,
      followers: [],
      num_following: 0,
      following: [],
      posts_created: 0,
      profilePictureUrl: "",
      bio: "",
      createdAt: Timestamp.now(),
    });

    console.log("User successfully added to Firestore database!");
    return newUserRef;
  } catch (error) {
    console.error("Error adding user to database:", error);
    throw error;
  }
};

// Function that allows a user to follow another user
export const addFollow = async (currentUsername, followUsername) => {
  try {
    // Find the current user and the user to be followed
    const [currentUserId, currentUserData] = await findUserByUsername(currentUsername);
    const [followUserId, followUserData] = await findUserByUsername(followUsername);

    if (!currentUserId || !followUserId) {
      throw new Error("User not found.");
    }

    // Update following for the current user
    const currentUserRef = doc(firestore, `Users/${currentUserId}`);
    await updateDoc(currentUserRef, {
      num_following: increment(1),
      following: [...currentUserData.following, followUserId],
    });

    // Update followers for the user to be followed
    const followUserRef = doc(firestore, `Users/${followUserId}`);
    await updateDoc(followUserRef, {
      num_followers: increment(1),
      followers: [...followUserData.followers, currentUserId],
    });

    console.log(`${currentUsername} is now following ${followUsername}`);
  } catch (error) {
    console.error("Error in the follow process:", error.message);
    throw error;
  }
};

// Function called when a user logs in, finds the user by email
export const findUserByEmail = async (email) => {
  try {
    const q = query(userCollection, where("email", "==", email));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      return [userDoc.id, userDoc.data()];
    } else {
      console.log("No matching user found.");
      return null;
    }
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

// Finds the user by username
export const findUserByUsername = async (username) => {
  try {
    const q = query(userCollection, where("username", "==", username));
    const userDocs = await getDocs(q);

    if (!userDocs.empty) {
      const userDoc = userDocs.docs[0];
      return [userDoc.id, userDoc.data()];
    } else {
      console.log("User not found.");
      return null;
    }
  } catch (error) {
    console.error("Error finding user by username:", error);
    throw error;
  }
};

// Creates a new post in the database
export const createPostInDB = async (userId, caption, photoUrls, authorUsername) => {
  try {
    const userRef = doc(firestore, `Users/${userId}`);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
      throw new Error("User not found.");
    }

    const userData = userSnapshot.data();
    const newPostRef = doc(postCollection);
    const newPost = {
      userId,
      caption,
      photoUrls,
      likesCount: 0,
      commentsCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      num_key: (userData.posts_created || 0) + 1,
      author: authorUsername,
    };

    await setDoc(newPostRef, newPost);

    // Increment the user's post count
    await updateDoc(userRef, {
      posts_created: increment(1),
    });

    console.log("Post created and user post count updated successfully!");
    return newPostRef.id;
  } catch (error) {
    console.error("Error creating post or updating user post count:", error);
    throw error;
  }
};

// Uploads a picture for a post
export const uploadPostPicture = async (filename, file) => {
  try {
    const storageRef = ref(storage, `PostPhotos/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    return await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error during upload:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading post picture:", error);
    throw error;
  }
};

// Adds a comment to a post
export const addComment = async (postId, authorName , userId, content) => {
  try {
    const commentRef = doc(collection(firestore, "Comments"));
    const newComment = {
      postId,
      authorName, 
      userId, 
      content,
      likesCount: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(commentRef, newComment);

    // Update the comment count in the post document
    const postRef = doc(firestore, `Posts/${postId}`);
    await updateDoc(postRef, {
      commentsCount: increment(1),
    });

    console.log("Comment added successfully!");
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

// Deletes a post and associated photos
export const deletePost = async (postId, userId) => {
  try {
    const postRef = doc(firestore, `Posts/${postId}`);
    const postSnapshot = await getDoc(postRef);

    if (!postSnapshot.exists()) {
      throw new Error("Post not found.");
    }

    const postData = postSnapshot.data();
    const photoUrls = postData.photoUrls;

    // Delete photos from storage
    const deletePhotoPromises = photoUrls.map(async (url) => {
      const photoRef = ref(storage, url);
      await deleteObject(photoRef);
    });

    await Promise.all(deletePhotoPromises);

    // Delete the post document
    await deleteDoc(postRef);

    // Decrement the user's post count
    const userRef = doc(firestore, `Users/${userId}`);
    await updateDoc(userRef, {
      posts_created: increment(-1),
    });

    console.log("Post and associated photos successfully deleted.");
  } catch (error) {
    console.error("Error deleting post or photos:", error);
    throw error;
  }
};

/**
 * 
 * @param {String } authorUsername 
 * @param {Timestamp} timestamp 
 * @returns object {postId , postData, authoProfilepic}
 */
export const getPost = async (authorUsername, timestamp) => {
  try {
    const [authorId, authorData] = await findUserByUsername(authorUsername);

    if (!authorId) {
      throw new Error("Author not found.");
    }

    const q = query(
      postCollection,
      where("author", "==", authorUsername),
      where("createdAt", "<=", Timestamp.fromMillis(timestamp)),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const result = await getDocs(q);

    if (!result.empty) {
      const postDoc = result.docs[0];
      return {
        postId: postDoc.id,
        postData: postDoc.data(),
        authorProfilePicture: authorData.profilePictureUrl,
      };
    } else {
      console.log("No post found before the given timestamp for the author.");
      return null;
    }
  } catch (error) {
    console.error("Error getting post:", error.message);
    throw error;
  }
};

// Retrieves all posts made by a user
export const getUserPosts = async (userId) => {
  try {
    const q = query(
      postCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const posts = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return posts;
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

// Toggles the like status of a post for a given user
export const toggleLike = async (postId, userId, username) => {
  try {
    const likeDocRef = doc(firestore, `Likes/${postId}_${userId}`);
    const postRef = doc(firestore, `Posts/${postId}`);
    const likeSnapshot = await getDoc(likeDocRef);

    if (likeSnapshot.exists()) {
      // User has already liked the post; remove the like
      await deleteDoc(likeDocRef);
      await updateDoc(postRef, {
        likesCount: increment(-1),
      });
      console.log("Post unliked.");
    } else {
      // User has not liked the post; add a like
      await setDoc(likeDocRef, {
        userId,
        username,
        postId,
        timestamp: Timestamp.now(),
      });
      await updateDoc(postRef, {
        likesCount: increment(1),
      });
      console.log("Post liked.");
    }
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// Updates the user's bio
export const updateUserBio = async (userId, newBio) => {
  try {
    const userRef = doc(firestore, `Users/${userId}`);
    await updateDoc(userRef, { bio: newBio });
    console.log("User bio updated successfully.");
  } catch (error) {
    console.error("Error updating user bio:", error);
    throw error;
  }
};

// Uploads a profile picture and updates the user's profile picture URL
export const uploadProfilePicture = async (filename, file, userId) => {
  try {
    const storageRef = ref(storage, `UserProfilePictures/${filename}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const downloadURL = await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error during upload:", error);
          reject(error);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", url);
          resolve(url);
        }
      );
    });

    const userRef = doc(firestore, `Users/${userId}`);
    await updateDoc(userRef, { profilePictureUrl: downloadURL });

    console.log("Profile picture URL saved to Firestore");
    return downloadURL;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};




const hashPassword = async (password) => {
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
};

const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    throw error;
  }
};

module.exports = { hashPassword, comparePasswords };
export const getPostComments = async (postId) => {
  try {
    const q = query(
      postCollection,
      where("postId", "==", postId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const comments = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return comments;
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

export const getUsersByIds = async (ids) => {
  if (!ids || ids.length === 0) {
    return [];
  }

  const usersRef = collection(firestore, 'Users');
  const users = [];

  // Firestore 'in' queries can handle up to 10 items at a time
  const chunkSize = 10;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    const q = query(usersRef, where('username', 'in', chunk));
    try {
      const querySnapshot = await getDocs(q);
      const chunkUsers = querySnapshot.docs.map((doc) => doc.data());
      users.push(...chunkUsers);
    } catch (error) {
      console.error('Error fetching users by IDs:', error);
      throw error;
    }
  }

  return users;
};
