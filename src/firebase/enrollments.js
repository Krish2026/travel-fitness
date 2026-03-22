// Firebase Enrollment & Progress Operations

import {
  doc,
  updateDoc,
  getDoc,
  query,
  collection,
  where,
  getDocs,
  arrayUnion,
  arrayRemove,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import { handleError } from "../utils/helpers";

/**
 * Enroll a client in a course
 * @param {string} userId - Client's user ID
 * @param {string} courseId - Course ID
 * @returns {Promise<void>}
 */
export const enrollInCourse = async (userId, courseId) => {
  try {
    // Add course to user's enrolledCourses
    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, {
      enrolledCourses: arrayUnion({
        courseId,
        enrolledAt: serverTimestamp(),
      }),
    });

    // Add user to course's enrolledUsers
    const courseRef = doc(firestore, "courses", courseId);
    await updateDoc(courseRef, {
      enrolledUsers: arrayUnion(userId),
    });
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Check if user is enrolled in a course
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @returns {Promise<boolean>} True if enrolled
 */
export const isEnrolledInCourse = async (userId, courseId) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const enrolledCourses = userSnap.data().enrolledCourses || [];
      return enrolledCourses.some((e) => e.courseId === courseId);
    }
    return false;
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return false;
  }
};

/**
 * Get user's enrolled courses
 * @param {string} userId - User ID
 * @returns {Promise<array>} Array of enrolled course objects
 */
export const getUserEnrolledCourses = async (userId) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().enrolledCourses || [];
    }
    return [];
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Track lesson completion for a user
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {string} lessonId - Lesson ID
 * @param {array} checklist - Completed checklist items
 * @returns {Promise<void>}
 */
export const updateLessonProgress = async (
  userId,
  courseId,
  lessonId,
  checklist,
) => {
  try {
    const progressRef = doc(
      firestore,
      "users",
      userId,
      "courseProgress",
      courseId,
      "lessonProgress",
      lessonId,
    );

    await setDoc(progressRef, {
      completed: checklist.every((item) => item.completed),
      checklistProgress: checklist,
      lastUpdated: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Get lesson progress for a user
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {string} lessonId - Lesson ID
 * @returns {Promise<object>} Lesson progress object
 */
export const getLessonProgress = async (userId, courseId, lessonId) => {
  try {
    const progressRef = doc(
      firestore,
      "users",
      userId,
      "courseProgress",
      courseId,
      "lessonProgress",
      lessonId,
    );
    const progressSnap = await getDoc(progressRef);

    return progressSnap.exists() ? progressSnap.data() : null;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Calculate course progress percentage
 * @param {string} userId - User ID
 * @param {string} courseId - Course ID
 * @param {number} totalLessons - Total lessons in course
 * @returns {Promise<number>} Progress percentage (0-100)
 */
export const calculateCourseProgress = async (
  userId,
  courseId,
  totalLessons,
) => {
  try {
    if (totalLessons === 0) return 0;

    const progressRef = collection(
      firestore,
      "users",
      userId,
      "courseProgress",
      courseId,
      "lessonProgress",
    );

    const querySnapshot = await getDocs(progressRef);
    const completedLessons = querySnapshot.docs.filter(
      (doc) => doc.data().completed,
    ).length;

    return Math.round((completedLessons / totalLessons) * 100);
  } catch (error) {
    console.error("Error calculating progress:", error);
    return 0;
  }
};

/**
 * Add health stat entry for user
 * @param {string} userId - User ID
 * @param {object} statData - Stat data (weight, bodyFatPercentage, etc.)
 * @returns {Promise<void>}
 */
export const addHealthStatEntry = async (userId, statData) => {
  try {
    const statsRef = doc(firestore, "users", userId, "stats", "entries");
    const userRef = doc(firestore, "users", userId);

    // Get existing stats to maintain history
    const userSnap = await getDoc(userRef);
    const existingEntries = userSnap.data().progressEntries || [];

    // Add new entry
    const newEntry = {
      ...statData,
      timestamp: serverTimestamp(),
    };

    // Update user's progressEntries array
    await updateDoc(userRef, {
      progressEntries: arrayUnion(newEntry),
      stats: statData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Get user's health stat history
 * @param {string} userId - User ID
 * @returns {Promise<array>} Array of stat entries
 */
export const getUserHealthStats = async (userId) => {
  try {
    const userRef = doc(firestore, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().progressEntries || [];
    }
    return [];
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Update user level based on completed items
 * @param {string} userId - User ID
 * @param {number} completedCount - Number of completed checklist items
 * @returns {Promise<void>}
 */
export const updateUserLevel = async (userId, completedCount) => {
  try {
    // Level up every 10 completed items
    const newLevel = Math.floor(completedCount / 10) + 1;

    const userRef = doc(firestore, "users", userId);
    await updateDoc(userRef, {
      level: newLevel,
      completedChecklistItems: arrayUnion(completedCount),
    });
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export default {
  enrollInCourse,
  isEnrolledInCourse,
  getUserEnrolledCourses,
  updateLessonProgress,
  getLessonProgress,
  calculateCourseProgress,
  addHealthStatEntry,
  getUserHealthStats,
  updateUserLevel,
};
