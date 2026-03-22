// Error Context
// Centralized error state management for the entire app

import React, { createContext, useState, useCallback } from "react";

export const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [errorHistory, setErrorHistory] = useState([]);

  const addError = useCallback((errorMessage, errorType = "general") => {
    const timestamp = new Date();
    const errorObj = { message: errorMessage, type: errorType, timestamp };

    setError(errorObj);
    setErrorHistory((prev) => [...prev, errorObj].slice(-10)); // Keep last 10 errors
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearErrorHistory = useCallback(() => {
    setErrorHistory([]);
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        error,
        errorHistory,
        addError,
        clearError,
        clearErrorHistory,
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
};
