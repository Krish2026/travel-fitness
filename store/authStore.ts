import { create } from "zustand";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ClientProfile, TrainerProfile } from "@/lib/types";

interface AuthStore {
  user: ClientProfile | TrainerProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  userId: string | null;
  userRole: "client" | "trainer" | null;
  lastLoginTimestamp: number | null;

  // Actions
  setUser: (user: ClientProfile | TrainerProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  saveUserSession: (user: ClientProfile | TrainerProfile) => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  userId: null,
  userRole: null,
  lastLoginTimestamp: null,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      userId: user?.id || null,
      userRole: user?.role || null,
    });
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  saveUserSession: async (user: ClientProfile | TrainerProfile) => {
    try {
      const sessionData = {
        userId: user.id,
        userRole: user.role,
        lastLoginTimestamp: Date.now(),
        userProfile: user,
      };
      await AsyncStorage.setItem("userSession", JSON.stringify(sessionData));
    } catch (error) {
      console.error("Error saving user session:", error);
    }
  },

  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      // First, try to load persisted session
      const savedSession = await AsyncStorage.getItem("userSession");
      let persistedSessionData: {
        userId: string;
        userRole: "client" | "trainer";
        lastLoginTimestamp: number;
        userProfile: ClientProfile | TrainerProfile;
      } | null = null;

      if (savedSession) {
        try {
          persistedSessionData = JSON.parse(savedSession);
        } catch (parseError) {
          console.error("Error parsing saved session:", parseError);
        }
      }

      // Check if user is logged in via Firebase
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Try to get user profile from Firestore
        let userProfile: ClientProfile | TrainerProfile | null = null;

        const clientRef = doc(db, "clients", currentUser.uid);
        const clientSnap = await getDoc(clientRef);

        if (clientSnap.exists()) {
          userProfile = clientSnap.data() as ClientProfile;
        } else {
          const trainerRef = doc(db, "trainers", currentUser.uid);
          const trainerSnap = await getDoc(trainerRef);

          if (trainerSnap.exists()) {
            userProfile = trainerSnap.data() as TrainerProfile;
          }
        }

        if (userProfile) {
          // Save the session to AsyncStorage
          const sessionData = {
            userId: currentUser.uid,
            userRole: userProfile.role,
            lastLoginTimestamp: Date.now(),
            userProfile: userProfile,
          };
          await AsyncStorage.setItem(
            "userSession",
            JSON.stringify(sessionData),
          );

          set({
            user: userProfile,
            isAuthenticated: true,
            userId: currentUser.uid,
            userRole: userProfile.role,
            lastLoginTimestamp: Date.now(),
            isLoading: false,
          });
        } else {
          // User exists in Auth but no profile - shouldn't happen, logout
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            userId: null,
            userRole: null,
          });
        }
      } else {
        // Not logged in to Firebase, check if there's a persisted session
        if (persistedSessionData) {
          set({
            user: persistedSessionData.userProfile,
            isAuthenticated: false, // Not fully authenticated without Firebase
            userId: persistedSessionData.userId,
            userRole: persistedSessionData.userRole,
            lastLoginTimestamp: persistedSessionData.lastLoginTimestamp,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            userId: null,
            userRole: null,
            lastLoginTimestamp: null,
          });
        }
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({
        error: error instanceof Error ? error.message : "Authentication error",
        isLoading: false,
      });

      // Try to load persisted session as fallback
      try {
        const savedSession = await AsyncStorage.getItem("userSession");
        if (savedSession) {
          const sessionData = JSON.parse(savedSession);
          set({
            user: sessionData.userProfile,
            userId: sessionData.userId,
            userRole: sessionData.userRole,
            lastLoginTimestamp: sessionData.lastLoginTimestamp,
          });
        }
      } catch (cacheError) {
        console.error("Error loading cached session:", cacheError);
      }
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await auth.signOut();
      // Clear all session-related storage
      await AsyncStorage.removeItem("userSession");
      await AsyncStorage.removeItem("userProfile"); // For backward compatibility
      set({
        user: null,
        isAuthenticated: false,
        userId: null,
        userRole: null,
        lastLoginTimestamp: null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Error logging out:", error);
      set({
        error: error instanceof Error ? error.message : "Logout failed",
        isLoading: false,
      });
    }
  },
}));
