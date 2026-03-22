// Trainer Navigator
// Tab-based navigation for authenticated trainer users

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Trainer screens
import ManageCoursesScreen from "../screens/trainer/ManageCoursesScreen";
import ManageStudentsScreen from "../screens/trainer/ManageStudentsScreen";
import EarningsScreen from "../screens/trainer/EarningsScreen";
import MessageCenterScreen from "../screens/trainer/MessageCenterScreen";
import ProfileSettingsScreen from "../screens/trainer/ProfileSettingsScreen";

// Detail screens
import CreateCourseScreen from "../screens/trainer/CreateCourseScreen";
import EditCourseScreen from "../screens/trainer/EditCourseScreen";
import StudentDetailScreen from "../screens/trainer/StudentDetailScreen";
import StudentProgressScreen from "../screens/trainer/StudentProgressScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function CoursesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="ManageCoursesScreen"
        component={ManageCoursesScreen}
        options={{ title: "My Courses" }}
      />
      <Stack.Screen
        name="CreateCourse"
        component={CreateCourseScreen}
        options={{ title: "Create Course" }}
      />
      <Stack.Screen
        name="EditCourse"
        component={EditCourseScreen}
        options={{ title: "Edit Course" }}
      />
    </Stack.Navigator>
  );
}

function StudentsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="ManageStudentsScreen"
        component={ManageStudentsScreen}
        options={{ title: "My Students" }}
      />
      <Stack.Screen
        name="StudentDetail"
        component={StudentDetailScreen}
        options={{ title: "Student Details" }}
      />
      <Stack.Screen
        name="StudentProgress"
        component={StudentProgressScreen}
        options={{ title: "Student Progress" }}
      />
    </Stack.Navigator>
  );
}

function EarningsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="EarningsScreen"
        component={EarningsScreen}
        options={{ title: "Earnings" }}
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

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="ProfileSettingsScreen"
        component={ProfileSettingsScreen}
        options={{ title: "Profile" }}
      />
    </Stack.Navigator>
  );
}

export default function TrainerNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Courses":
              iconName = focused ? "list" : "list-outline";
              break;
            case "Students":
              iconName = focused ? "people" : "people-outline";
              break;
            case "Earnings":
              iconName = focused ? "cash" : "cash-outline";
              break;
            case "Messages":
              iconName = focused ? "chatbubble" : "chatbubble-outline";
              break;
            case "Profile":
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
        name="Courses"
        component={CoursesStack}
        options={{ title: "Courses" }}
      />
      <Tab.Screen
        name="Students"
        component={StudentsStack}
        options={{ title: "Students" }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsStack}
        options={{ title: "Earnings" }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageStack}
        options={{ title: "Messages" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}
