// Client Navigator
// Tab-based navigation for authenticated client users

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Client screens
import ExploreCoursesScreen from "../screens/client/ExploreCoursesScreen";
import MyCouresesScreen from "../screens/client/MyCoursesScreen";
import MessageCenterScreen from "../screens/client/MessageCenterScreen";
import AccountSettingsScreen from "../screens/client/AccountSettingsScreen";

// Detail screens
import CourseDetailScreen from "../screens/client/CourseDetailScreen";
import LearnScreen from "../screens/client/LearnScreen";
import ProgressScreen from "../screens/client/ProgressScreen";
import ProfileScreen from "../screens/client/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ExploreCoursesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="ExploreCoursesScreen"
        component={ExploreCoursesScreen}
        options={{ title: "Explore Courses" }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: "Course Details" }}
      />
    </Stack.Navigator>
  );
}

function MyCoursesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="MyCoursesScreen"
        component={MyCouresesScreen}
        options={{ title: "My Courses" }}
      />
      <Stack.Screen
        name="Learn"
        component={LearnScreen}
        options={{ title: "Learn" }}
      />
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: "Progress" }}
      />
    </Stack.Navigator>
  );
}

function MessageStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="MessageCenterScreen"
        component={MessageCenterScreen}
        options={{ title: "Messages" }}
      />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="AccountSettingsScreen"
        component={AccountSettingsScreen}
        options={{ title: "Account Settings" }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Profile" }}
      />
    </Stack.Navigator>
  );
}

export default function ClientNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Explore":
              iconName = focused ? "compass" : "compass-outline";
              break;
            case "MyCourses":
              iconName = focused ? "book" : "book-outline";
              break;
            case "Messages":
              iconName = focused ? "chatbubble" : "chatbubble-outline";
              break;
            case "Account":
              iconName = focused ? "person" : "person-outline";
              break;
            default:
              iconName = "home";
          }

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Explore"
        component={ExploreCoursesStack}
        options={{ title: "Explore" }}
      />
      <Tab.Screen
        name="MyCourses"
        component={MyCoursesStack}
        options={{ title: "My Courses" }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={{ title: "Messages" }}
      />
      <Tab.Screen
        name="Account"
        component={AccountStack}
        options={{ title: "Account" }}
      />
    </Tab.Navigator>
  );
}
