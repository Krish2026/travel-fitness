import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { AuthProvider } from "./src/context/AuthContext";
import { ErrorProvider } from "./src/context/ErrorContext";

function AppContent() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <StatusBar style="auto" />
      {/* Navigation will be added in Phase 0.4 */}
    </View>
  );
}

export default function App() {
  return (
    <ErrorProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorProvider>
  );
}
