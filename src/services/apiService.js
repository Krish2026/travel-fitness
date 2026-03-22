// API Service Layer
// Centralized wrapper around Firebase operations
// Single point of contact for all API calls throughout the app

import * as authService from "../firebase/auth";
import * as courseService from "../firebase/courses";
import * as enrollmentService from "../firebase/enrollments";
import * as postService from "../firebase/posts";
import * as storageService from "../firebase/storage";
import { handleError } from "../utils/helpers";

const API = {
  // ===== AUTHENTICATION =====
  auth: {
    createUser: async (email, password, role, userData) => {
      try {
        return await authService.createUser(email, password, role, userData);
      } catch (err) {
        throw handleError(err, "Failed to create user");
      }
    },

    loginUser: async (email, password) => {
      try {
        return await authService.loginUser(email, password);
      } catch (err) {
        throw handleError(err, "Failed to login");
      }
    },

    logoutUser: async () => {
      try {
        return await authService.logoutUser();
      } catch (err) {
        throw handleError(err, "Failed to logout");
      }
    },

    subscribeToAuthState: (callback) => {
      try {
        return authService.subscribeToAuthState(callback);
      } catch (err) {
        throw handleError(err, "Failed to subscribe to auth state");
      }
    },

    updateUserProfile: async (uid, updates) => {
      try {
        return await authService.updateUserProfile(uid, updates);
      } catch (err) {
        throw handleError(err, "Failed to update profile");
      }
    },

    verifyTrainerPassword: async (email, password) => {
      try {
        return await authService.verifyTrainerPassword(email, password);
      } catch (err) {
        throw handleError(err, "Failed to verify password");
      }
    },
  },

  // ===== COURSES =====
  courses: {
    createCourse: async (trainerUid, courseData) => {
      try {
        return await courseService.createCourse(trainerUid, courseData);
      } catch (err) {
        throw handleError(err, "Failed to create course");
      }
    },

    getTrainerCourses: async (trainerUid) => {
      try {
        return await courseService.getTrainerCourses(trainerUid);
      } catch (err) {
        throw handleError(err, "Failed to fetch trainer courses");
      }
    },

    addLesson: async (trainerUid, courseId, lessonData) => {
      try {
        return await courseService.addLesson(trainerUid, courseId, lessonData);
      } catch (err) {
        throw handleError(err, "Failed to add lesson");
      }
    },

    getCourseLessons: async (trainerUid, courseId) => {
      try {
        return await courseService.getCourseLessons(trainerUid, courseId);
      } catch (err) {
        throw handleError(err, "Failed to fetch lessons");
      }
    },
  },

  // ===== ENROLLMENTS =====
  enrollments: {
    enrollInCourse: async (userId, trainerUid, courseId) => {
      try {
        return await enrollmentService.enrollInCourse(
          userId,
          trainerUid,
          courseId,
        );
      } catch (err) {
        throw handleError(err, "Failed to enroll in course");
      }
    },

    updateLessonProgress: async (userId, trainerUid, courseId, lessonId) => {
      try {
        return await enrollmentService.updateLessonProgress(
          userId,
          trainerUid,
          courseId,
          lessonId,
        );
      } catch (err) {
        throw handleError(err, "Failed to update lesson progress");
      }
    },

    calculateCourseProgress: async (userId, trainerUid, courseId) => {
      try {
        return await enrollmentService.calculateCourseProgress(
          userId,
          trainerUid,
          courseId,
        );
      } catch (err) {
        throw handleError(err, "Failed to calculate progress");
      }
    },

    addHealthStatEntry: async (userId, stat) => {
      try {
        return await enrollmentService.addHealthStatEntry(userId, stat);
      } catch (err) {
        throw handleError(err, "Failed to add health stat");
      }
    },
  },

  // ===== POSTS & MESSAGING =====
  posts: {
    sendChatMessage: async (courseId, userId, message) => {
      try {
        return await postService.sendChatMessage(courseId, userId, message);
      } catch (err) {
        throw handleError(err, "Failed to send message");
      }
    },

    createPost: async (courseId, userId, postData) => {
      try {
        return await postService.createPost(courseId, userId, postData);
      } catch (err) {
        throw handleError(err, "Failed to create post");
      }
    },

    getCoursePosts: async (courseId) => {
      try {
        return await postService.getCoursePosts(courseId);
      } catch (err) {
        throw handleError(err, "Failed to fetch posts");
      }
    },

    likePost: async (courseId, postId, userId) => {
      try {
        return await postService.likePost(courseId, postId, userId);
      } catch (err) {
        throw handleError(err, "Failed to like post");
      }
    },

    addPostComment: async (courseId, postId, userId, comment) => {
      try {
        return await postService.addPostComment(
          courseId,
          postId,
          userId,
          comment,
        );
      } catch (err) {
        throw handleError(err, "Failed to add comment");
      }
    },
  },

  // ===== STORAGE =====
  storage: {
    uploadFile: async (path, file, onProgress) => {
      try {
        return await storageService.uploadFile(path, file, onProgress);
      } catch (err) {
        throw handleError(err, "Failed to upload file");
      }
    },

    uploadVideo: async (path, video, onProgress) => {
      try {
        return await storageService.uploadVideo(path, video, onProgress);
      } catch (err) {
        throw handleError(err, "Failed to upload video");
      }
    },

    uploadProfilePicture: async (userId, image, onProgress) => {
      try {
        return await storageService.uploadProfilePicture(
          userId,
          image,
          onProgress,
        );
      } catch (err) {
        throw handleError(err, "Failed to upload profile picture");
      }
    },

    uploadPostMedia: async (courseId, postId, media, onProgress) => {
      try {
        return await storageService.uploadPostMedia(
          courseId,
          postId,
          media,
          onProgress,
        );
      } catch (err) {
        throw handleError(err, "Failed to upload post media");
      }
    },
  },
};

export default API;
