import { SplashScreen, Tabs } from "expo-router";
import { useEffect } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Feather from "@expo/vector-icons/Feather";
import { theme } from "@/theme";

export const unstable_settings = {
  initialRouteName: "home",
};

export default function Layout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: true,
          headerShadowVisible: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="trainers"
        options={{
          title: "Trainers",
          headerShown: true,
          headerShadowVisible: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ size, color }) => (
            <FontAwesome5 name="dumbbell" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerShown: true,
          headerShadowVisible: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ size, color }) => (
            <MaterialIcons name="calendar-month" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: true,
          headerShadowVisible: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ size, color }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
