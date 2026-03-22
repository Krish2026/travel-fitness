// useError Hook
// Easy access to Error Context throughout the app

import { useContext } from "react";
import { ErrorContext } from "../context/ErrorContext";

export const useError = () => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error(
      "useError must be used within an ErrorProvider. Wrap your app with <ErrorProvider>",
    );
  }

  return context;
};

export default useError;
