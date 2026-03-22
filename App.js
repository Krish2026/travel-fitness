import React from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "./src/context/AuthContext";
import { ErrorProvider } from "./src/context/ErrorContext";
import RootNavigator from "./src/navigation/RootNavigator";

export default function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </AuthProvider>
    </ErrorProvider>
  );
}
