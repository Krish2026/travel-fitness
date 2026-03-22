// Firebase Course Operations

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  doc,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { firestore } from "../config/firebase";
import { handleError } from "../utils/helpers";

/**
 * Create a new course
 * @param {string} trainerId - Trainer's user ID
 * @param {object} courseData - Course data (name, description, image)
 * @returns {Promise<string>} Course ID
 */
export const createCourse = async (trainerId, courseData) => {
  try {
    const coursesRef = collection(firestore, "courses");
    const docRef = await addDoc(coursesRef, {
      trainerId,
      name: courseData.name,
      description: courseData.description,
      imageUrl: courseData.imageUrl || "",
      lessons: [],
      enrolledUsers: [],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Add course ID to trainer's courses array
    await updateTrainerCourses(trainerId, docRef.id, "add");

    return docRef.id;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Update trainer's courses array
 * @param {string} trainerId - Trainer's user ID
 * @param {string} courseId - Course ID to add/remove
 * @param {string} action - "add" or "remove"
 * @returns {Promise<void>}
 */
const updateTrainerCourses = async (trainerId, courseId, action) => {
  try {
    const trainerRef = doc(firestore, "users", trainerId);
    if (action === "add") {
      await updateDoc(trainerRef, {
        courses: arrayUnion(courseId),
      });
    } else if (action === "remove") {
      await updateDoc(trainerRef, {
        courses: arrayRemove(courseId),
      });
    }
  } catch (error) {
    console.error("Error updating trainer courses:", error);
  }
};

/**
 * Get all courses for a trainer
 * @param {string} trainerId - Trainer's user ID
 * @returns {Promise<array>} Array of course objects
 */
export const getTrainerCourses = async (trainerId) => {
  try {
    const q = query(
      collection(firestore, "courses"),
      where("trainerId", "==", trainerId),
    );
    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    return courses;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Get a single course by ID
 * @param {string} courseId - Course ID
 * @returns {Promise<object>} Course object
 */
export const getCourse = async (courseId) => {
  try {
    const courseRef = doc(firestore, "courses", courseId);
    const courseSnap = await getDoc(courseRef);
    if (courseSnap.exists()) {
      return { id: courseSnap.id, ...courseSnap.data() };
    }
    return null;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Update course details
 * @param {string} courseId - Course ID
 * @param {object} updates - Fields to update
 * @returns {Promise<void>}
 */
export const updateCourse = async (courseId, updates) => {
  try {
    const courseRef = doc(firestore, "courses", courseId);
    await updateDoc(courseRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Add a lesson to a course
 * @param {string} courseId - Course ID
 * @param {object} lessonData - Lesson data (title, description, videoUrl, checklist)
 * @returns {Promise<string>} Lesson ID
 */
export const addLesson = async (courseId, lessonData) => {
  try {
    const lessonsRef = collection(firestore, "courses", courseId, "lessons");
    const docRef = await addDoc(lessonsRef, {
      title: lessonData.title,
      description: lessonData.description || "",
      videoUrl: lessonData.videoUrl || "",
      checklist: lessonData.checklist || [],
      order: lessonData.order || 0,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Get all lessons for a course
 * @param {string} courseId - Course ID
 * @returns {Promise<array>} Array of lesson objects
 */
export const getCourseLessons = async (courseId) => {
  try {
    const lessonsRef = collection(firestore, "courses", courseId, "lessons");
    const querySnapshot = await getDocs(lessonsRef);
    const lessons = [];
    querySnapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() });
    });
    return lessons.sort((a, b) => a.order - b.order);
  } catch (error) {
    throw new Error(handleError(error));
  }
};

/**
 * Delete a course
 * @param {string} courseId - Course ID
 * @param {string} trainerId - Trainer's user ID
 * @returns {Promise<void>}
 */
export const deleteCourse = async (courseId, trainerId) => {
  try {
    const courseRef = doc(firestore, "courses", courseId);
    await deleteDoc(courseRef);
    await updateTrainerCourses(trainerId, courseId, "remove");
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export default {
  createCourse,
  getTrainerCourses,
  getCourse,
  updateCourse,
  addLesson,
  getCourseLessons,
  deleteCourse,
};
