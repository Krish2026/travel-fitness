// Firebase Storage Operations

import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "../config/firebase";
import { handleError } from "../utils/helpers";

/**
 * Upload file to Firebase Storage with progress tracking
 * @param {string} path - Storage path (e.g., "courses/courseId/video")
 * @param {Blob} file - File to upload
 * @param {function} onProgress - Callback for progress updates
 * @returns {Promise<string>} Download URL of uploaded file
 */
export const uploadFile = (path, file, onProgress = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Progress callback
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          // Error callback
          reject(new Error(handleError(error)));
        },
        async () => {
          // Completion callback
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(new Error(handleError(error)));
          }
        },
      );
    } catch (error) {
      reject(new Error(handleError(error)));
    }
  });
};

/**
 * Upload video to Firebase Storage
 * @param {string} courseId - Course ID
 * @param {string} lessonId - Lesson ID
 * @param {Blob} videoFile - Video file to upload
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} Video download URL
 */
export const uploadVideo = async (
  courseId,
  lessonId,
  videoFile,
  onProgress = null,
) => {
  const path = `courses/${courseId}/lessons/${lessonId}/video_${Date.now()}`;
  return uploadFile(path, videoFile, onProgress);
};

/**
 * Upload profile picture to Firebase Storage
 * @param {string} userId - User ID
 * @param {Blob} imageFile - Image file to upload
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} Image download URL
 */
export const uploadProfilePicture = async (
  userId,
  imageFile,
  onProgress = null,
) => {
  const path = `profile_pictures/${userId}/profile_${Date.now()}`;
  return uploadFile(path, imageFile, onProgress);
};

/**
 * Upload post media to Firebase Storage
 * @param {string} courseId - Course ID
 * @param {string} postId - Post ID
 * @param {Blob} mediaFile - Media file to upload
 * @param {string} type - Media type (image or video)
 * @param {function} onProgress - Progress callback
 * @returns {Promise<string>} Media download URL
 */
export const uploadPostMedia = async (
  courseId,
  postId,
  mediaFile,
  type = "image",
  onProgress = null,
) => {
  const path = `courses/${courseId}/posts/${postId}/${type}_${Date.now()}`;
  return uploadFile(path, mediaFile, onProgress);
};

/**
 * Delete file from Firebase Storage
 * @param {string} path - Storage path
 * @returns {Promise<void>}
 */
export const deleteFile = async (path) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", handleError(error));
  }
};

/**
 * Compress video file before upload (basic implementation)
 * For production, consider using a proper video compression library
 * @param {Blob} videoFile - Video file to compress
 * @param {number} maxSizeMB - Maximum file size in MB (default 50)
 * @returns {Blob} Compressed video file
 */
export const compressVideo = (videoFile, maxSizeMB = 50) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // If file is already small enough, return as-is
  if (videoFile.size <= maxSizeBytes) {
    return videoFile;
  }

  // In a real app, use a library like ffmpeg-wasm or expo-video-thumbnails
  // For now, return the original file
  console.warn(
    "Video compression would be done with proper library in production",
  );
  return videoFile;
};

/**
 * Compress image file before upload
 * @param {Blob} imageFile - Image file to compress
 * @param {number} quality - Compression quality (0-1, default 0.8)
 * @param {number} maxWidthPx - Maximum width in pixels
 * @param {number} maxHeightPx - Maximum height in pixels
 * @returns {Promise<Blob>} Compressed image file
 */
export const compressImage = async (
  imageFile,
  quality = 0.8,
  maxWidthPx = 1024,
  maxHeightPx = 1024,
) => {
  try {
    // In a real app, use react-native-image-resizer or expo-image-manipulator
    // For now, return original if it's reasonable size
    if (imageFile.size < 2 * 1024 * 1024) {
      return imageFile;
    }

    console.warn(
      "Image compression would be done with proper library in production",
    );
    return imageFile;
  } catch (error) {
    console.error("Image compression error:", error);
    return imageFile;
  }
};

export default {
  uploadFile,
  uploadVideo,
  uploadProfilePicture,
  uploadPostMedia,
  deleteFile,
  compressVideo,
  compressImage,
};
