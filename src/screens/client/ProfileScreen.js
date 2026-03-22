// Profile Screen
// View and edit user profile

import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../hooks";

export default function ProfileScreen() {
  const { user } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [bio, setBio] = useState(user?.bio || "");

  const handleSaveProfile = async () => {
    // TODO: Update user profile in Firebase
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <Ionicons name="person-circle" size={100} color="#3b82f6" />
        <TouchableOpacity style={styles.editPhotoButton}>
          <Ionicons name="camera" size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.infoCard}>
        {!isEditing ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>
                {firstName} {lastName}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{user?.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Bio</Text>
              <Text style={styles.value}>{bio || "No bio added"}</Text>
            </View>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="pencil" size={16} color="white" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First name"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last name"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={4}
              />
            </View>
            <View style={styles.editButtonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setIsEditing(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveProfile}
              >
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>

      {/* Stats */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Stats</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="book" size={24} color="#3b82f6" />
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statName}>Courses</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="#10b981" />
            <Text style={styles.statValue}>48h</Text>
            <Text style={styles.statName}>Learning</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="medal" size={24} color="#f59e0b" />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statName}>Certificates</Text>
          </View>
        </View>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  headerCard: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 30,
    backgroundColor: "white",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    position: "relative",
  },
  editPhotoButton: {
    position: "absolute",
    bottom: 0,
    right: "25%",
    backgroundColor: "#3b82f6",
    borderRadius: 20,
    padding: 8,
  },
  infoCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#1f2937",
    marginTop: 4,
    fontWeight: "500",
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1f2937",
    marginTop: 8,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  editButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
  },
  editButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  editButtonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#e5e7eb",
  },
  cancelButtonText: {
    color: "#374151",
    fontWeight: "bold",
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: "#3b82f6",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  statsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
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
    marginTop: 8,
  },
  statName: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
  },
  spacer: {
    height: 20,
  },
});
