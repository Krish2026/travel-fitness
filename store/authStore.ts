import { create } from 'zustand';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ClientProfile, TrainerProfile } from '@/lib/types';

interface AuthStore {
  user: ClientProfile | TrainerProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  userId: string | null;

  // Actions
  setUser: (user: ClientProfile | TrainerProfile | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeAuth: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
  userId: null,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      userId: user?.id || null,
    });
  },

  setIsLoading: (loading) => set({ isLoading: loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  initializeAuth: async () => {
    try {
      set({ isLoading: true });

      // Check if user is logged in via Firebase
      const currentUser = auth.currentUser;

      if (currentUser) {
        // Try to get user profile from Firestore
        let userProfile: ClientProfile | TrainerProfile | null = null;

        const clientRef = doc(db, 'clients', currentUser.uid);
        const clientSnap = await getDoc(clientRef);

        if (clientSnap.exists()) {
          userProfile = clientSnap.data() as ClientProfile;
        } else {
          const trainerRef = doc(db, 'trainers', currentUser.uid);
          const trainerSnap = await getDoc(trainerRef);

          if (trainerSnap.exists()) {
            userProfile = trainerSnap.data() as TrainerProfile;
          }
        }

        if (userProfile) {
          set({
            user: userProfile,
            isAuthenticated: true,
            userId: currentUser.uid,
            isLoading: false,
          });

          // Store in AsyncStorage for offline access
          await AsyncStorage.setItem('userProfile', JSON.stringify(userProfile));
        } else {
          // User exists in Auth but no profile - shouldn't happen, logout
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        // Check if there's a cached user session
        const cachedProfile = await AsyncStorage.getItem('userProfile');
        if (cachedProfile) {
          const profile = JSON.parse(cachedProfile);
          set({
            user: profile,
            isAuthenticated: false, // Not fully authenticated without Firebase
            userId: profile.id,
            isLoading: false,
          });
        } else {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        error: error instanceof Error ? error.message : 'Authentication error',
        isLoading: false,
      });

      // Try to load cached profile as fallback
      try {
        const cachedProfile = await AsyncStorage.getItem('userProfile');
        if (cachedProfile) {
          const profile = JSON.parse(cachedProfile);
          set({ user: profile, userId: profile.id });
        }
      } catch (cacheError) {
        console.error('Error loading cached profile:', cacheError);
      }
    }
  },

  logout: async () => {
    try {
      set({ isLoading: true });
      await auth.signOut();
      await AsyncStorage.removeItem('userProfile');
      set({
        user: null,
        isAuthenticated: false,
        userId: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error logging out:', error);
      set({
        error: error instanceof Error ? error.message : 'Logout failed',
        isLoading: false,
      });
    }
  },
}));
