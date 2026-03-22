// useAuth Hook - Authentication Logic with AsyncStorage Persistence

import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUser,
  loginUser,
  logoutUser,
  subscribeToAuthState,
  updateUserProfile,
} from "../firebase/auth";

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Subscribe to auth state changes
        const unsubscribe = subscribeToAuthState((authUser) => {
          setUser(authUser);
          setLoading(false);

          // Save user to AsyncStorage for offline access
          if (authUser) {
            AsyncStorage.setItem(
              "@travel_fitness_user",
              JSON.stringify(authUser),
            ).catch((err) => console.warn("AsyncStorage save error:", err));
          } else {
            AsyncStorage.removeItem("@travel_fitness_user").catch((err) =>
              console.warn("AsyncStorage remove error:", err),
            );
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Auth initialization error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    const subscription = initializeAuth();
    return () => {
      subscription?.then((unsub) => unsub?.());
    };
  }, []);

  /**
   * Sign up a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role (client or trainer)
   * @param {object} userData - Additional user data
   * @returns {Promise<object>} User object
   */
  const signUp = useCallback(async (email, password, role, userData) => {
    setError(null);
    setLoading(true);
    try {
      const newUser = await createUser(email, password, role, userData);
      setUser(newUser);
      setLoading(false);
      return newUser;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Log in a user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<object>} User object
   */
  const login = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const authUser = await loginUser(email, password);
      setUser(authUser);
      setLoading(false);
      return authUser;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Log out current user
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  /**
   * Update user profile
   * @param {object} updates - Fields to update
   * @returns {Promise<void>}
   */
  const updateProfile = useCallback(
    async (updates) => {
      if (!user) throw new Error("No user logged in");

      setError(null);
      try {
        await updateUserProfile(user.uid, updates);
        // Update local state
        setUser({ ...user, ...updates });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [user],
  );

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    signUp,
    login,
    logout,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
  };
};

export default useAuth;
