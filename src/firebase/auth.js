// Firebase Authentication Service

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../config/firebase";
import { USER_ROLES } from "../utils/constants";
import { handleError } from "../utils/helpers";

/**
 * Create a new user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} role - User role (client or trainer)
 * @param {object} userData - Additional user data (name, age, gender, etc.)
 * @returns {Promise<object>} User object with uid and role
 */
export const createUser = async (email, password, role, userData) => {
  try {
    // Create authentication user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { uid } = userCredential.user;

    // Update display name
    await updateProfile(userCredential.user, {
      displayName: userData.name || "",
    });

    // Create user document in Firestore
    const userDocRef = doc(firestore, "users", uid);
    const userDocument = {
      uid,
      email,
      role,
      displayName: userData.name || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userData,
    };

    if (role === USER_ROLES.CLIENT) {
      // Client-specific fields
      userDocument.profileComplete = false;
      userDocument.stats = {
        currentWeight: userData.currentWeight || 0,
        goalWeight: userData.goalWeight || 0,
        height: userData.height || 0,
        age: userData.age || 0,
        gender: userData.gender || "",
        bodyFatPercentage: userData.bodyFatPercentage || 0,
        musclePercentage: userData.musclePercentage || 0,
      };
      userDocument.goalDescription = userData.goalDescription || "";
      userDocument.enrolledCourses = [];
      userDocument.level = 1;
      userDocument.progressEntries = [];
    } else if (role === USER_ROLES.TRAINER) {
      // Trainer-specific fields
      userDocument.specialty = userData.specialty || "";
      userDocument.bio = userData.bio || "";
      userDocument.profilePictureUrl = userData.profilePictureUrl || "";
      userDocument.courses = [];
      userDocument.settings = {
        themeColor: "#FF6B6B",
        communityChatEnabled: true,
      };
    }

    await setDoc(userDocRef, userDocument);

    return { uid, email, role, displayName: userData.name };
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} User object with uid, email, and role
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const { uid } = userCredential.user;

    // Get user role from Firestore
    const userDocRef = doc(firestore, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      throw new Error("User profile not found");
    }

    const userData = userDocSnap.data();
    return {
      uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
      role: userData.role,
    };
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<object>} Current user object or null
 */
export const getCurrentUser = async () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(firestore, "users", firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            resolve({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              ...userDocSnap.data(),
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(null);
      }
      unsubscribe();
    });
  });
};

/**
 * Listen to authentication state changes
 * @param {function} callback - Callback function to call with user object
 * @returns {function} Unsubscribe function
 */
export const subscribeToAuthState = (callback) => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        const userDocRef = doc(firestore, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          callback({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            ...userDocSnap.data(),
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        callback(null);
      }
    } else {
      callback(null);
    }
  });

  return unsubscribe;
};

/**
 * Update user profile in Firestore
 * @param {string} uid - User ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, updates) => {
  try {
    const userDocRef = doc(firestore, "users", uid);
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: new Date(),
    });
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Verify trainer password (for Phase 1 only)
 * @param {string} password - Password to verify
 * @returns {boolean} True if password is correct
 */
export const verifyTrainerPassword = (password) => {
  const trainerPassword =
    process.env.EXPO_PUBLIC_TRAINER_PASSWORD || "trainer123";
  return password === trainerPassword;
};

export default {
  createUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  subscribeToAuthState,
  updateUserProfile,
  verifyTrainerPassword,
};
