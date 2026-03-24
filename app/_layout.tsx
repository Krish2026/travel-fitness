import { useEffect } from "react";
import { Stack, router, SplashScreen } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { ActivityIndicator, View } from "react-native";
import { theme } from "@/theme";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "auth/role-select",
};

export default function RootLayout() {
  const { isLoading, isAuthenticated } = useAuthStore();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        await initializeAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        SplashScreen.hideAsync();
      }
    };

    bootstrapAsync();
  }, []);

  // While loading, show a splash screen
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Stack>
      {!isAuthenticated ? (
        // Auth Stack
        <>
          <Stack.Screen
            name="auth/role-select"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/signup"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/trainer-password"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="auth/create-profile"
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        // App Stack
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      )}
    </Stack>
  );
}
