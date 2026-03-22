// Account Settings Screen
// User account and profile management

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../hooks";

export default function AccountSettingsScreen({ navigation }) {
  const { user, signOut, loading } = useAuthContext();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setLoggingOut(false);
  };

  const menuItems = [
    {
      icon: "person",
      title: "Profile",
      subtitle: "View and edit your profile",
      onPress: () => navigation.navigate("Profile"),
    },
    {
      icon: "lock-closed",
      title: "Change Password",
      subtitle: "Update your password",
      onPress: () => {},
    },
    {
      icon: "heart",
      title: "Saved Courses",
      subtitle: "Your saved courses and wishlist",
      onPress: () => {},
    },
    {
      icon: "receipt",
      title: "Order History",
      subtitle: "View your purchases",
      onPress: () => {},
    },
    {
      icon: "help-circle",
      title: "Help & Support",
      subtitle: "Get help and report issues",
      onPress: () => {},
    },
    {
      icon: "document-text",
      title: "Privacy Policy",
      subtitle: "Review our privacy policy",
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* User Info */}
      <View style={styles.userCard}>
        <Ionicons name="person-circle" size={60} color="#3b82f6" />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceContent}>
            <Ionicons name="notifications" size={20} color="#3b82f6" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>Notifications</Text>
              <Text style={styles.preferenceSubtitle}>
                Receive course updates
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: "#d1d5db", true: "#bfdbfe" }}
            thumbColor={notificationsEnabled ? "#3b82f6" : "#9ca3af"}
          />
        </View>
      </View>

      {/* Settings Menu */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.lastMenuItem,
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Ionicons name={item.icon} size={20} color="#3b82f6" />
              <View style={styles.menuItemText}>
                <Text style={styles.menuItemTitle}>{item.title}</Text>
                <Text style={styles.menuItemSubtitle}>
                  {item.subtitle}
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logoutButton, loggingOut && styles.logoutButtonDisabled]}
        onPress={handleLogout}
        disabled={loggingOut}
      >
        {loggingOut ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginHorizontal: 16,
    marginBottom: 12,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  preferenceContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  preferenceSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginHorizontal: 16,
  },
  lastMenuItem: {
    borderRadius: 8,
    borderBottomWidth: 0,
    marginBottom: 16,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  menuItemSubtitle: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ef4444",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  logoutButtonDisabled: {
    opacity: 0.7,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  spacer: {
    height: 20,
  },
});
