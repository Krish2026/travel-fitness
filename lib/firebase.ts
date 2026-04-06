import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  Auth,
  User,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  Firestore,
  orderBy,
  limit as firestoreLimit,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  FirebaseStorage,
} from "firebase/storage";
import * as FileSystem from "expo-file-system";
import { TrainerSettings, UserLevelInfo, LevelUpEvent } from "@/lib/types";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

// Auth Functions
export async function signup(
  email: string,
  password: string,
  role: "client" | "trainer",
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
}

// Complete signup flow for new clients - creates profile first, then auth
export async function signupNewClient(
  email: string,
  password: string,
  profileData: {
    name: string;
    weight: number;
    height: number;
    age: number;
    gender: "male" | "female" | "other";
    bodyFatPercentage: number;
    musclePercentage: number;
    goalWeight: number;
    goalDescription: string;
    trainerId: string;
    profilePicture?: string;
  },
): Promise<User> {
  let userId: string | null = null;

  try {
    // Step 1: Create auth account first
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    userId = userCredential.user.uid;

    // Step 2: Create the profile using the new user's UID
    await createClientProfile(userId, email, profileData);

    return userCredential.user;
  } catch (error) {
    // If profile creation fails, delete the auth user to maintain consistency
    if (userId && auth.currentUser?.uid === userId) {
      try {
        await auth.currentUser.delete();
      } catch (deleteError) {
        console.error(
          "Failed to delete auth user after profile creation error:",
          deleteError,
        );
      }
    }
    throw error;
  }
}

// Complete signup flow for new trainers - creates profile first, then auth
export async function signupNewTrainer(
  email: string,
  password: string,
  profileData: {
    name: string;
    bio: string;
    specialties: string[];
    themeColor: string;
    profilePicture?: string;
  },
): Promise<User> {
  let userId: string | null = null;

  try {
    // Step 1: Create auth account first
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );
    userId = userCredential.user.uid;

    // Step 2: Create the profile using the new user's UID
    await createTrainerProfile(userId, email, profileData);

    return userCredential.user;
  } catch (error) {
    // If profile creation fails, delete the auth user to maintain consistency
    if (userId && auth.currentUser?.uid === userId) {
      try {
        await auth.currentUser.delete();
      } catch (deleteError) {
        console.error(
          "Failed to delete auth user after profile creation error:",
          deleteError,
        );
      }
    }
    throw error;
  }
}

export async function login(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  return userCredential.user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// User Profile Functions
export async function createClientProfile(
  userId: string,
  email: string,
  data: {
    name: string;
    weight: number;
    height: number;
    age: number;
    gender: "male" | "female" | "other";
    bodyFatPercentage: number;
    musclePercentage: number;
    goalWeight: number;
    goalDescription: string;
    trainerId: string;
    profilePicture?: string;
  },
): Promise<void> {
  const clientRef = doc(db, "clients", userId);
  await setDoc(clientRef, {
    id: userId,
    role: "client",
    email,
    name: data.name,
    weight: data.weight,
    height: data.height,
    age: data.age,
    gender: data.gender,
    bodyFatPercentage: data.bodyFatPercentage,
    musclePercentage: data.musclePercentage,
    goalWeight: data.goalWeight,
    goalDescription: data.goalDescription,
    trainerId: data.trainerId,
    enrolledCourses: [],
    profilePicture: data.profilePicture || "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Create initial health entry
  const healthEntryRef = doc(collection(db, "health_entries"));
  await setDoc(healthEntryRef, {
    id: healthEntryRef.id,
    clientId: userId,
    weight: data.weight,
    height: data.height,
    bodyFatPercentage: data.bodyFatPercentage,
    musclePercentage: data.musclePercentage,
    timestamp: Date.now(),
    notes: "Initial health entry",
    progressPercentage: 0,
  });
}

export async function createTrainerProfile(
  userId: string,
  email: string,
  data: {
    name: string;
    bio: string;
    specialties: string[];
    themeColor: string;
    profilePicture?: string;
  },
): Promise<void> {
  const trainerRef = doc(db, "trainers", userId);
  await setDoc(trainerRef, {
    id: userId,
    role: "trainer",
    email,
    name: data.name,
    bio: data.bio,
    specialties: data.specialties,
    themeColor: data.themeColor,
    isVerified: false, // Will be verified by admin later
    profilePicture: data.profilePicture || "",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function getClientProfile(userId: string) {
  const docRef = doc(db, "clients", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function getTrainerProfile(userId: string) {
  const docRef = doc(db, "trainers", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function getTrainerById(trainerId: string) {
  const docRef = doc(db, "trainers", trainerId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// Storage Functions
export async function uploadProfilePicture(
  userId: string,
  imageUri: string,
): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `profile_pictures/${userId}`);
    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
}

export async function uploadPostMedia(
  trainerId: string,
  mediaUri: string,
  mediaType: "image" | "video",
): Promise<string> {
  try {
    const response = await fetch(mediaUri);
    const blob = await response.blob();
    const timestamp = Date.now();

    const storageRef = ref(
      storage,
      `posts/${trainerId}/${timestamp}_${mediaType}`,
    );
    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error(`Error uploading ${mediaType}:`, error);
    throw error;
  }
}

export async function uploadHealthEntryPhoto(
  userId: string,
  entryId: string,
  imageUri: string,
): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `health_entries/${userId}/${entryId}`);
    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error uploading health entry photo:", error);
    throw error;
  }
}

export async function deleteImage(storagePath: string): Promise<void> {
  try {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting image:", error);
    throw error;
  }
}

// Course Functions
export async function createCourse(
  trainerId: string,
  data: {
    title: string;
    description: string;
    thumbnail?: string;
    lessons: Array<{
      title: string;
      description: string;
      videoUrl: string;
      duration: number;
      checklist: Array<{ text: string; order: number }>;
      order: number;
    }>;
  },
): Promise<string> {
  const courseRef = doc(collection(db, "courses"));
  const lessons = data.lessons.map((lesson, index) => ({
    id: `lesson_${index}`,
    title: lesson.title,
    description: lesson.description,
    videoUrl: lesson.videoUrl,
    duration: lesson.duration,
    checklist: lesson.checklist.map((item, itemIndex) => ({
      id: `checklist_${itemIndex}`,
      text: item.text,
      completed: false,
      order: item.order,
    })),
    order: index,
  }));

  await setDoc(courseRef, {
    id: courseRef.id,
    trainerId,
    title: data.title,
    description: data.description,
    thumbnail: data.thumbnail || "",
    lessons,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  return courseRef.id;
}

export async function getCourse(courseId: string) {
  const docRef = doc(db, "courses", courseId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function getCoursesForTrainer(trainerId: string) {
  const q = query(
    collection(db, "courses"),
    where("trainerId", "==", trainerId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}

export async function updateCourseProgress(
  clientId: string,
  courseId: string,
  lessonId: string,
  checklistProgress: Array<{
    itemId: string;
    completed: boolean;
    completedAt?: number;
  }>,
  completedAt?: number,
): Promise<void> {
  const progressRef = doc(
    db,
    "client_progress",
    `${clientId}_${courseId}_${lessonId}`,
  );
  await setDoc(
    progressRef,
    {
      clientId,
      courseId,
      lessonId,
      viewedAt: Date.now(),
      checklistProgress,
      completedAt,
    },
    { merge: true },
  );
}

export async function getCourseProgress(
  clientId: string,
  courseId: string,
  lessonId: string,
) {
  const docRef = doc(
    db,
    "client_progress",
    `${clientId}_${courseId}_${lessonId}`,
  );
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// Post Functions
export async function createPost(
  trainerId: string,
  data: {
    type: "video" | "image" | "text";
    content: string;
    caption?: string;
    media: Array<{ url: string; type: "image" | "video" }>;
    hashtags: string[];
    taggedUsers: string[];
    location?: string;
  },
): Promise<string> {
  const postRef = doc(collection(db, "posts"));
  await setDoc(postRef, {
    id: postRef.id,
    trainerId,
    type: data.type,
    content: data.content,
    caption: data.caption,
    media: data.media,
    hashtags: data.hashtags,
    taggedUsers: data.taggedUsers,
    location: data.location,
    timestamp: Date.now(),
    likes: 0,
    comments: [],
  });

  return postRef.id;
}

export async function getPostsForTrainer(trainerId: string) {
  const q = query(
    collection(db, "posts"),
    where("trainerId", "==", trainerId),
    orderBy("timestamp", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}

// Get trainer's clients for tagging
export async function getTrainerClients(trainerId: string): Promise<
  Array<{
    id: string;
    name: string;
    profilePicture?: string;
  }>
> {
  const q = query(
    collection(db, "clients"),
    where("trainerId", "==", trainerId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id,
      name: data.name,
      profilePicture: data.profilePicture,
    };
  });
}

// Search posts by hashtag
export async function getPostsByHashtag(hashtag: string) {
  const q = query(
    collection(db, "posts"),
    where("hashtags", "array-contains", hashtag.toLowerCase()),
    orderBy("timestamp", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}

// Get user profile by ID (client or trainer)
export async function getUserProfile(userId: string): Promise<{
  id: string;
  name: string;
  profilePicture?: string;
  role: "client" | "trainer";
} | null> {
  // Try to get as client first
  const clientRef = doc(db, "clients", userId);
  const clientSnap = await getDoc(clientRef);

  if (clientSnap.exists()) {
    const data = clientSnap.data();
    return {
      id: data.id,
      name: data.name,
      profilePicture: data.profilePicture,
      role: "client",
    };
  }

  // Try as trainer
  const trainerRef = doc(db, "trainers", userId);
  const trainerSnap = await getDoc(trainerRef);

  if (trainerSnap.exists()) {
    const data = trainerSnap.data();
    return {
      id: data.id,
      name: data.name,
      profilePicture: data.profilePicture,
      role: "trainer",
    };
  }

  return null;
}

// Message Functions
export async function sendMessage(
  senderId: string,
  senderName: string,
  content: string,
): Promise<void> {
  const messageRef = doc(collection(db, "messages"));
  await setDoc(messageRef, {
    id: messageRef.id,
    conversationId: "default", // Single trainer conversation
    senderId,
    senderName,
    content,
    type: "text",
    timestamp: Date.now(),
  });
}

export async function getMessages(msgLimit: number = 50) {
  const q = query(
    collection(db, "messages"),
    where("conversationId", "==", "default"),
    orderBy("timestamp", "desc"),
    firestoreLimit(msgLimit),
  );

  try {
    const snap = await getDocs(q);
    return snap.docs.reverse().map((doc) => doc.data());
  } catch {
    // Fallback if orderBy fails
    const allRef = collection(db, "messages");
    const allSnap = await getDocs(allRef);
    return allSnap.docs
      .map((doc) => doc.data())
      .filter((msg: any) => msg.conversationId === "default")
      .sort((a: any, b: any) => a.timestamp - b.timestamp)
      .slice(-msgLimit);
  }
}

// Calendar Functions
export async function createCalendarEvent(
  userId: string,
  data: {
    type:
      | "weigh_in"
      | "course_completion"
      | "lesson_completion"
      | "session_booking";
    title: string;
    description?: string;
    date: number;
    time?: string;
    relatedEntity?: { entityType: string; entityId: string };
  },
): Promise<void> {
  const eventRef = doc(collection(db, "calendar_events"));
  await setDoc(eventRef, {
    id: eventRef.id,
    userId,
    type: data.type,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    relatedEntity: data.relatedEntity,
  });
}

export async function getCalendarEventsForUser(userId: string) {
  const q = query(
    collection(db, "calendar_events"),
    where("userId", "==", userId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}

// Health Entry Functions
export async function createHealthEntry(
  userId: string,
  data: {
    type: "weight" | "measurement";
    weight?: { value: number; unit: "kg" | "lbs" };
    measurement?: {
      type: "chest" | "waist" | "hips" | "arms" | "thighs";
      value: number;
      unit: "cm" | "in";
    };
    notes?: string;
  },
): Promise<void> {
  const entryRef = doc(collection(db, "health_entries"));
  await setDoc(entryRef, {
    id: entryRef.id,
    userId,
    type: data.type,
    weight: data.weight,
    measurement: data.measurement,
    notes: data.notes,
    date: new Date(),
  });
}

export async function getHealthEntriesForUser(userId: string) {
  const q = query(
    collection(db, "health_entries"),
    where("userId", "==", userId),
    orderBy("date", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}

// Course Enrollment Functions
export async function enrollCourse(
  userId: string,
  courseId: string,
): Promise<void> {
  const enrollmentRef = doc(collection(db, "enrollments"));
  await setDoc(enrollmentRef, {
    id: enrollmentRef.id,
    userId,
    courseId,
    enrolledAt: new Date(),
    progress: 0,
    completedLessons: [],
  });
}

export async function getUserCourseEnrollments(userId: string) {
  const q = query(collection(db, "enrollments"), where("userId", "==", userId));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}

export async function getAllCourses() {
  const q = query(collection(db, "courses"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => doc.data());
}

// Posts Feed Functions
export async function getPostsFeed(limit: number = 20) {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"),
    firestoreLimit(limit),
  );
  try {
    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data());
  } catch {
    // Fallback if orderBy fails
    const allRef = collection(db, "posts");
    const allSnap = await getDocs(allRef);
    return allSnap.docs
      .map((doc) => doc.data())
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);
  }
}

// Profile Update Functions
export async function updateUserProfile(
  userId: string,
  data: {
    name?: string;
    bio?: string;
    age?: number;
    height?: number;
    heightUnit?: "cm" | "ft";
    fitnessLevel?: "beginner" | "intermediate" | "advanced";
    specialties?: string[];
    profilePicture?: string;
    goals?: string[];
  },
): Promise<void> {
  const clientRef = doc(db, "clients", userId);
  const trainerRef = doc(db, "trainers", userId);

  // Try to update client profile first, then trainer
  try {
    await setDoc(clientRef, data, { merge: true });
  } catch {
    try {
      await setDoc(trainerRef, data, { merge: true });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  }
}

// Progress/Stats Functions
export async function getProgressData(userId: string) {
  // Get health entries
  const healthEntriesRef = query(
    collection(db, "health_entries"),
    where("userId", "==", userId),
  );
  const healthSnap = await getDocs(healthEntriesRef);
  const healthEntries = healthSnap.docs.map((doc) => doc.data());

  // Get enrollments
  const enrollmentsRef = query(
    collection(db, "enrollments"),
    where("userId", "==", userId),
  );
  const enrollSnap = await getDocs(enrollmentsRef);
  const enrollments = enrollSnap.docs.map((doc) => doc.data());

  return {
    healthEntries,
    enrollments,
    statistics: {
      totalHealthEntries: healthEntries.length,
      totalCoursesEnrolled: enrollments.length,
      completedCourses: enrollments.filter((e: any) => e.progress >= 100)
        .length,
    },
  };
}

// Trainer Settings Functions
export async function updateTrainerSettings(
  trainerId: string,
  data: Partial<TrainerSettings>,
): Promise<void> {
  const settingsRef = doc(db, "trainer_settings", trainerId);
  await setDoc(settingsRef, data, { merge: true });
}

export async function getTrainerSettings(
  trainerId: string,
): Promise<TrainerSettings | null> {
  const settingsRef = doc(db, "trainer_settings", trainerId);
  const snap = await getDoc(settingsRef);
  return snap.exists() ? (snap.data() as TrainerSettings) : null;
}

// Admin Functions (for testing)
export async function getAllUsers() {
  const clientsRef = collection(db, "clients");
  const trainersRef = collection(db, "trainers");

  const clientsSnap = await getDocs(clientsRef);
  const trainersSnap = await getDocs(trainersRef);

  return {
    clients: clientsSnap.docs.map((doc) => doc.data()),
    trainers: trainersSnap.docs.map((doc) => doc.data()),
  };
}

// Storage Functions
export async function uploadVideoToFirebase(
  videoUri: string,
  fileName: string,
  onProgress?: (progress: number) => void,
): Promise<string> {
  try {
    // Read the file
    const base64 = await FileSystem.readAsStringAsync(videoUri, {
      encoding: "base64",
    });

    // Convert base64 to blob
    const blob = await fetch(`data:video/mp4;base64,${base64}`).then((res) =>
      res.blob(),
    );

    // Create a unique filename
    const timestamp = Date.now();
    const storagePath = `videos/${timestamp}_${fileName}`;

    // Create reference and upload
    const storageRef = ref(storage, storagePath);
    const uploadTask = await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(uploadTask.ref);

    return downloadURL;
  } catch (error) {
    console.error("Error uploading video:", error);
    throw error;
  }
}

export async function uploadImageToFirebase(
  imageUri: string,
  fileName: string,
  folder: string = "images",
): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: "base64",
    });

    const blob = await fetch(`data:image/jpeg;base64,${base64}`).then((res) =>
      res.blob(),
    );

    const timestamp = Date.now();
    const storagePath = `${folder}/${timestamp}_${fileName}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = await uploadBytes(storageRef, blob);

    return await getDownloadURL(uploadTask.ref);
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function deleteFileFromStorage(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

// Level-Up System Functions
function calculateUserLevel(completedCoursesCount: number): number {
  // Level 1 = 0 courses, Level 2 = 1 course, Level 3 = 2 courses, etc.
  return Math.max(1, completedCoursesCount + 1);
}

export async function completeLesson(
  clientId: string,
  courseId: string,
  lessonId: string,
): Promise<void> {
  try {
    const progressRef = doc(
      db,
      "clients",
      clientId,
      "course_progress",
      courseId,
    );
    const snap = await getDoc(progressRef);

    if (snap.exists()) {
      const data = snap.data();
      const lessonsCompleted = Math.min(
        (data.lessonsCompleted || 0) + 1,
        data.totalLessons || 1,
      );
      const completionPercentage = Math.round(
        (lessonsCompleted / (data.totalLessons || 1)) * 100,
      );

      await setDoc(
        progressRef,
        {
          lessonsCompleted,
          completionPercentage,
          lastLessonCompletedAt: Date.now(),
        },
        { merge: true },
      );

      // If course is complete, trigger course completion
      if (completionPercentage === 100) {
        await completeCourse(clientId, courseId);
      }
    }
  } catch (error) {
    console.error("Error completing lesson:", error);
    throw error;
  }
}

export async function completeCourse(
  clientId: string,
  courseId: string,
): Promise<void> {
  try {
    // Update course progress
    const progressRef = doc(
      db,
      "clients",
      clientId,
      "course_progress",
      courseId,
    );
    await setDoc(
      progressRef,
      {
        completedAt: Date.now(),
        completionPercentage: 100,
      },
      { merge: true },
    );

    // Get client profile
    const clientRef = doc(db, "clients", clientId);
    const clientSnap = await getDoc(clientRef);

    if (clientSnap.exists()) {
      const clientData = clientSnap.data();
      const completedCourses = clientData.completedCourses || [];

      // Add course to completed list if not already there
      if (!completedCourses.includes(courseId)) {
        completedCourses.push(courseId);

        const oldLevel = calculateUserLevel(completedCourses.length - 1);
        const newLevel = calculateUserLevel(completedCourses.length);

        // Update client profile with new level and completed courses
        await setDoc(
          clientRef,
          {
            completedCourses,
            userLevel: newLevel,
            lastLevelUpAt:
              newLevel > oldLevel ? Date.now() : clientData.lastLevelUpAt,
          },
          { merge: true },
        );

        // Create level-up event if level increased
        if (newLevel > oldLevel) {
          await createLevelUpEvent(clientId, oldLevel, newLevel);
        }
      }
    }
  } catch (error) {
    console.error("Error completing course:", error);
    throw error;
  }
}

export async function getUserLevelInfo(
  clientId: string,
): Promise<UserLevelInfo | null> {
  try {
    const clientRef = doc(db, "clients", clientId);
    const snap = await getDoc(clientRef);

    if (!snap.exists()) {
      return null;
    }

    const data = snap.data();
    const completedCourses = data.completedCourses || [];
    const completedCount = completedCourses.length;
    const currentLevel = calculateUserLevel(completedCount);
    const nextLevelRequirement = currentLevel; // Need completedCount+1 courses for next level
    const progressToNextLevel = Math.round(
      ((completedCount % 1) * 100) as number,
    );

    return {
      userId: clientId,
      currentLevel,
      completedCourses: completedCount,
      nextLevelRequirement,
      progressToNextLevel: Math.min(100, progressToNextLevel),
      totalCompletedCourses: completedCourses,
      lastLevelUpAt: data.lastLevelUpAt,
      levelUpHistory: data.levelUpHistory || [],
    };
  } catch (error) {
    console.error("Error getting user level info:", error);
    return null;
  }
}

export async function createLevelUpEvent(
  userId: string,
  oldLevel: number,
  newLevel: number,
): Promise<void> {
  try {
    const eventId = `level_up_${userId}_${Date.now()}`;
    const eventRef = doc(db, "level_up_events", eventId);

    const levelUpEvent: LevelUpEvent = {
      id: eventId,
      userId,
      previousLevel: oldLevel,
      newLevel,
      timestamp: Date.now(),
      message: `🎉 Congratulations! You've reached Level ${newLevel}!`,
      read: false,
    };

    await setDoc(eventRef, levelUpEvent);

    // Also add to user's levelUpHistory
    const clientRef = doc(db, "clients", userId);
    const clientSnap = await getDoc(clientRef);

    if (clientSnap.exists()) {
      const data = clientSnap.data();
      const levelUpHistory = data.levelUpHistory || [];
      levelUpHistory.push({
        level: newLevel,
        achievedAt: Date.now(),
      });

      await setDoc(
        clientRef,
        {
          levelUpHistory: levelUpHistory.slice(-10), // Keep last 10 level-ups
        },
        { merge: true },
      );
    }
  } catch (error) {
    console.error("Error creating level-up event:", error);
    throw error;
  }
}

export async function getLevelUpEvents(
  userId: string,
): Promise<LevelUpEvent[]> {
  try {
    const q = query(
      collection(db, "level_up_events"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      firestoreLimit(20),
    );

    const snap = await getDocs(q);
    return snap.docs.map((doc) => doc.data() as LevelUpEvent);
  } catch (error) {
    console.error("Error getting level-up events:", error);
    return [];
  }
}
