// Trainer Profile Settings Screen
// Trainer account and profile management

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../hooks";

export default function ProfileSettingsScreen({ navigation }) {
  const { user, signOut, loading } = useAuthContext();
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
      title: "Profile Information",
      subtitle: "Update your profile details",
      onPress: () => {},
    },
    {
      icon: "lock-closed",
      title: "Change Password",
      subtitle: "Update your password",
      onPress: () => {},
    },
    {
      icon: "document-text",
      title: "Certifications",
      subtitle: "Manage your certifications",
      onPress: () => {},
    },
    {
      icon: "card",
      title: "Payment Settings",
      subtitle: "Manage payment methods",
      onPress: () => {},
    },
    {
      icon: "analytics",
      title: "Analytics",
      subtitle: "View detailed analytics",
      onPress: () => {},
    },
    {
      icon: "help-circle",
      title: "Help & Support",
      subtitle: "Get help and report issues",
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Trainer Info */}
      <View style={styles.profileCard}>
        <Ionicons name="person-circle" size={80} color="#3b82f6" />
        <View style={styles.profileInfo}>
          <Text style={styles.trainerName}>
            {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.trainerEmail}>{user?.email}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.rating}>4.9 (156 reviews)</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>5</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>245</Text>
          <Text style={styles.statLabel}>Students</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>$2.4K</Text>
          <Text style={styles.statLabel}>Earnings</Text>
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
  profileCard: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 12,
  },
  trainerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
  },
  trainerEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },
  rating: {
    fontSize: 13,
    color: "#374151",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginVertical: 20,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#374151",
    marginHorizontal: 16,
    marginBottom: 12,
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
    marginTop: 20,
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
