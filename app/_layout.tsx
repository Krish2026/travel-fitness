import { useEffect } from "react";
import { Stack, router, SplashScreen } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { ActivityIndicator, View } from "react-native";
import { theme } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

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

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/auth/role-select");
      }
    }
  }, [isLoading, isAuthenticated]);

  // While loading, show a splash screen
  if (isLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
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
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
