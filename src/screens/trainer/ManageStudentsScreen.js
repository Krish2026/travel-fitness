// Manage Students Screen
// View and manage enrolled students

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../hooks";

export default function ManageStudentsScreen({ navigation }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    // TODO: Fetch enrolled students from Firebase
    setLoading(false);
  }, [user?.uid]);

  const handleStudentPress = (studentId) => {
    navigation.navigate("StudentDetail", { studentId });
  };

  const renderStudentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.studentCard}
      onPress={() => handleStudentPress(item.id)}
    >
      <Ionicons name="person-circle" size={48} color="#3b82f6" />
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.enrolledText}>
          {item.enrolledCourses} courses enrolled
        </Text>
        <View style={styles.progressRow}>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${item.avgProgress}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{item.avgProgress}%</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : students.length > 0 ? (
        <FlatList
          data={students}
          renderItem={renderStudentCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Students Yet</Text>
          <Text style={styles.emptyText}>
            Students will appear here when they enroll
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  studentCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
  },
  enrolledText: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "600",
    minWidth: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6b7280",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#9ca3af",
    marginTop: 8,
    textAlign: "center",
  },
});
