// useAuthContext Hook
// Easy access to Auth Context throughout the app

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within an AuthProvider. Wrap your app with <AuthProvider>",
    );
  }

  return context;
};

export default useAuthContext;
