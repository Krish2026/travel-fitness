// Auth Context Provider
// Provides authentication state globally throughout the app

import React, { createContext, useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUser,
  loginUser,
  logoutUser,
  subscribeToAuthState,
  updateUserProfile,
} from "../firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth on app startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for user in AsyncStorage first (faster)
        const cachedUser = await AsyncStorage.getItem("@travel_fitness_user");
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
          setIsAuthenticated(true);
        }

        // Subscribe to Firebase auth state changes
        const unsubscribe = subscribeToAuthState((authUser) => {
          setUser(authUser);
          setIsAuthenticated(!!authUser);
          setError(null);
          setLoading(false);

          // Update AsyncStorage when auth state changes
          if (authUser) {
            AsyncStorage.setItem(
              "@travel_fitness_user",
              JSON.stringify(authUser),
            ).catch((err) => console.warn("AsyncStorage error:", err));
          } else {
            AsyncStorage.removeItem("@travel_fitness_user").catch((err) =>
              console.warn("AsyncStorage error:", err),
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

  const signUp = useCallback(async (email, password, role, userData) => {
    setError(null);
    setLoading(true);
    try {
      const newUser = await createUser(email, password, role, userData);
      setUser(newUser);
      setIsAuthenticated(true);
      setLoading(false);
      return newUser;
    } catch (err) {
      const errorMessage = err.message || "Sign up failed";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const signIn = useCallback(async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      const authUser = await loginUser(email, password);
      setUser(authUser);
      setIsAuthenticated(true);
      setLoading(false);
      return authUser;
    } catch (err) {
      const errorMessage = err.message || "Sign in failed";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    } catch (err) {
      const errorMessage = err.message || "Sign out failed";
      setError(errorMessage);
      setLoading(false);
      throw err;
    }
  }, []);

  const updateProfile = useCallback(
    async (updates) => {
      if (!user) throw new Error("No user logged in");

      setError(null);
      try {
        await updateUserProfile(user.uid, updates);
        setUser({ ...user, ...updates });
      } catch (err) {
        const errorMessage = err.message || "Update failed";
        setError(errorMessage);
        throw err;
      }
    },
    [user],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    signUp,
    signIn,
    signOut,
    updateProfile,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
