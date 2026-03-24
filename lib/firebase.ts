import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  Auth,
  User,
} from 'firebase/auth';
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
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, Storage } from 'firebase/storage';

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
export const storage: Storage = getStorage(app);

// Auth Functions
export async function signup(
  email: string,
  password: string,
  role: 'client' | 'trainer'
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function login(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
    gender: 'male' | 'female' | 'other';
    bodyFatPercentage: number;
    musclePercentage: number;
    goalWeight: number;
    goalDescription: string;
    trainerId: string;
    profilePicture?: string;
  }
): Promise<void> {
  const clientRef = doc(db, 'clients', userId);
  await setDoc(clientRef, {
    id: userId,
    role: 'client',
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
    profilePicture: data.profilePicture || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // Create initial health entry
  const healthEntryRef = doc(collection(db, 'health_entries'));
  await setDoc(healthEntryRef, {
    id: healthEntryRef.id,
    clientId: userId,
    weight: data.weight,
    height: data.height,
    bodyFatPercentage: data.bodyFatPercentage,
    musclePercentage: data.musclePercentage,
    timestamp: Date.now(),
    notes: 'Initial health entry',
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
  }
): Promise<void> {
  const trainerRef = doc(db, 'trainers', userId);
  await setDoc(trainerRef, {
    id: userId,
    role: 'trainer',
    email,
    name: data.name,
    bio: data.bio,
    specialties: data.specialties,
    themeColor: data.themeColor,
    isVerified: false, // Will be verified by admin later
    profilePicture: data.profilePicture || '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
}

export async function getClientProfile(userId: string) {
  const docRef = doc(db, 'clients', userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function getTrainerProfile(userId: string) {
  const docRef = doc(db, 'trainers', userId);
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
  const docRef = doc(db, 'trainers', trainerId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

// Storage Functions
export async function uploadProfilePicture(userId: string, imageUri: string): Promise<string> {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();

    const storageRef = ref(storage, `profile_pictures/${userId}`);
    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}

export async function uploadPostMedia(
  trainerId: string,
  mediaUri: string,
  mediaType: 'image' | 'video'
): Promise<string> {
  try {
    const response = await fetch(mediaUri);
    const blob = await response.blob();
    const timestamp = Date.now();

    const storageRef = ref(storage, `posts/${trainerId}/${timestamp}_${mediaType}`);
    await uploadBytes(storageRef, blob);

    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error(`Error uploading ${mediaType}:`, error);
    throw error;
  }
}

// Admin Functions (for testing)
export async function getAllUsers() {
  const clientsRef = collection(db, 'clients');
  const trainersRef = collection(db, 'trainers');

  const clientsSnap = await getDocs(clientsRef);
  const trainersSnap = await getDocs(trainersRef);

  return {
    clients: clientsSnap.docs.map((doc) => doc.data()),
    trainers: trainersSnap.docs.map((doc) => doc.data()),
  };
}
