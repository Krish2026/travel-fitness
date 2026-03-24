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
  FirebaseStorage,
} from "firebase/storage";

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

export async function getUserProfile(userId: string) {
  const clientProfile = await getClientProfile(userId);
  if (clientProfile) return clientProfile;

  const trainerProfile = await getTrainerProfile(userId);
  if (trainerProfile) return trainerProfile;

  return null;
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
