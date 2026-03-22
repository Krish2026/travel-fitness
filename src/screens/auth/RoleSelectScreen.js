// Role Select Screen
// Let users choose between Client and Trainer roles

import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../hooks";

export default function RoleSelectScreen({ navigation }) {
  const { loading } = useAuthContext();

  const handleRoleSelect = (role) => {
    if (role === "client") {
      navigation.navigate("SignUp", { role: "client" });
    } else {
      navigation.navigate("SignUp", { role: "trainer" });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Travel Fitness</Text>
        <Text style={styles.subtitle}>I am a...</Text>
      </View>

      <View style={styles.rolesContainer}>
        {/* Client Role */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect("client")}
          disabled={loading}
        >
          <Ionicons name="person" size={60} color="#3b82f6" />
          <Text style={styles.roleTitle}>Client</Text>
          <Text style={styles.roleDescription}>
            Browse and take fitness courses
          </Text>
        </TouchableOpacity>

        {/* Trainer Role */}
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect("trainer")}
          disabled={loading}
        >
          <Ionicons name="medal" size={60} color="#10b981" />
          <Text style={styles.roleTitle}>Trainer</Text>
          <Text style={styles.roleDescription}>
            Create and teach fitness courses
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#6b7280",
  },
  rolesContainer: {
    gap: 20,
  },
  roleCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 15,
  },
  roleDescription: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 8,
    textAlign: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  footerLink: {
    fontSize: 14,
    color: "#3b82f6",
    fontWeight: "bold",
  },
});
