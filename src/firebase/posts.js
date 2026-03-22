// Firebase Messaging & Posts Operations

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import { handleError } from "../utils/helpers";

/**
 * Send a message in course community chat
 * @param {string} courseId - Course ID
 * @param {string} userId - User ID of sender
 * @param {string} displayName - Display name of sender
 * @param {string} message - Message content
 * @returns {Promise<string>} Message ID
 */
export const sendChatMessage = async (
  courseId,
  userId,
  displayName,
  message,
) => {
  try {
    const messagesRef = collection(
      firestore,
      "courses",
      courseId,
      "chatMessages",
    );

    const docRef = await addDoc(messagesRef, {
      userId,
      displayName,
      message,
      timestamp: serverTimestamp(),
      edited: false,
    });

    return docRef.id;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Get chat messages for a course
 * @param {string} courseId - Course ID
 * @param {number} messageLimit - Number of messages to fetch (default 50)
 * @returns {Promise<array>} Array of message objects
 */
export const getCourseChatMessages = async (courseId, messageLimit = 50) => {
  try {
    const messagesRef = collection(
      firestore,
      "courses",
      courseId,
      "chatMessages",
    );
    const q = query(
      messagesRef,
      orderBy("timestamp", "asc"),
      limit(messageLimit),
    );

    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });

    return messages;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Create a post in course (trainer only)
 * @param {string} courseId - Course ID
 * @param {string} userId - Trainer's user ID
 * @param {string} displayName - Trainer's display name
 * @param {object} postData - Post data (caption, type, mediaUrl, hashtags, tags, location)
 * @returns {Promise<string>} Post ID
 */
export const createPost = async (courseId, userId, displayName, postData) => {
  try {
    const postsRef = collection(firestore, "courses", courseId, "posts");

    const docRef = await addDoc(postsRef, {
      userId,
      displayName,
      caption: postData.caption || "",
      type: postData.type || "text", // 'text', 'image', 'video'
      mediaUrl: postData.mediaUrl || "",
      hashtags: postData.hashtags || [],
      taggedUsers: postData.taggedUsers || [],
      location: postData.location || "",
      likes: [],
      comments: [],
      timestamp: serverTimestamp(),
      edited: false,
    });

    return docRef.id;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Get posts for a course
 * @param {string} courseId - Course ID
 * @param {number} postLimit - Number of posts to fetch (default 20)
 * @returns {Promise<array>} Array of post objects
 */
export const getCoursePosts = async (courseId, postLimit = 20) => {
  try {
    const postsRef = collection(firestore, "courses", courseId, "posts");
    const q = query(postsRef, orderBy("timestamp", "desc"), limit(postLimit));

    const querySnapshot = await getDocs(q);
    const posts = [];
    querySnapshot.forEach((doc) => {
      posts.push({ id: doc.id, ...doc.data() });
    });

    return posts;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Get a single post
 * @param {string} courseId - Course ID
 * @param {string} postId - Post ID
 * @returns {Promise<object>} Post object
 */
export const getPost = async (courseId, postId) => {
  try {
    const postRef = doc(firestore, "courses", courseId, "posts", postId);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      return { id: postSnap.id, ...postSnap.data() };
    }
    return null;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Like a post
 * @param {string} courseId - Course ID
 * @param {string} postId - Post ID
 * @param {string} userId - User ID liking the post
 * @returns {Promise<void>}
 */
export const likePost = async (courseId, postId, userId) => {
  try {
    const postRef = doc(firestore, "courses", courseId, "posts", postId);
    await updateDoc(postRef, {
      likes: arrayUnion(userId),
    });
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Add comment to a post
 * @param {string} courseId - Course ID
 * @param {string} postId - Post ID
 * @param {string} userId - User ID commenting
 * @param {string} displayName - Commenter's display name
 * @param {string} text - Comment text
 * @returns {Promise<void>}
 */
export const addPostComment = async (
  courseId,
  postId,
  userId,
  displayName,
  text,
) => {
  try {
    const comment = {
      userId,
      displayName,
      text,
      timestamp: serverTimestamp(),
    };

    const postRef = doc(firestore, "courses", courseId, "posts", postId);
    await updateDoc(postRef, {
      comments: arrayUnion(comment),
    });
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Delete a post (trainer only)
 * @param {string} courseId - Course ID
 * @param {string} postId - Post ID
 * @returns {Promise<void>}
 */
export const deletePost = async (courseId, postId) => {
  try {
    const postRef = doc(firestore, "courses", courseId, "posts", postId);
    await deleteDoc(postRef);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export default {
  sendChatMessage,
  getCourseChatMessages,
  createPost,
  getCoursePosts,
  getPost,
  likePost,
  addPostComment,
  deletePost,
};
