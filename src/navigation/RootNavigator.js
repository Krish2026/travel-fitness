// Root Navigator
// Conditional rendering based on loading and authentication state

import React from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { useAuthContext } from "../hooks";
import AuthNavigator from "./AuthNavigator";
import ClientNavigator from "./ClientNavigator";
import TrainerNavigator from "./TrainerNavigator";

export default function RootNavigator() {
  const { isAuthenticated, loading, user } = useAuthContext();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        user?.role === "trainer" ? (
          <TrainerNavigator />
        ) : (
          <ClientNavigator />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
