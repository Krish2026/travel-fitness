// Student Detail Screen
// View student information and enrollment details

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StudentDetailScreen({ route, navigation }) {
  const { studentId } = route.params || {};
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch student details from Firebase
    setLoading(false);
  }, [studentId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Student Info */}
      <View style={styles.infoCard}>
        <Ionicons name="person-circle" size={80} color="#3b82f6" />
        <Text style={styles.studentName}>John Doe</Text>
        <Text style={styles.studentEmail}>john@example.com</Text>
        <Text style={styles.joinDate}>Joined 3 months ago</Text>
      </View>

      {/* Enrollment Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enrolled Courses</Text>
        {[1, 2].map((course, index) => (
          <View key={index} style={styles.courseItem}>
            <View style={styles.courseItemContent}>
              <Text style={styles.courseName}>Course Name</Text>
              <Text style={styles.enrollDate}>Enrolled 2 months ago</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("StudentProgress", {
                  studentId,
                  courseId: course,
                })
              }
            >
              <Ionicons name="chevron-forward" size={24} color="#3b82f6" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24h</Text>
            <Text style={styles.statLabel}>Time Spent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Lessons</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>65%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <TouchableOpacity style={styles.messageButton}>
        <Ionicons name="chatbubble" size={18} color="white" />
        <Text style={styles.messageButtonText}>Send Message</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  infoCard: {
    backgroundColor: "white",
    paddingVertical: 20,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  studentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 12,
  },
  studentEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
  joinDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  courseItem: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseItemContent: {
    flex: 1,
  },
  courseName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  enrollDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3b82f6",
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  messageButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  spacer: {
    height: 20,
  },
});
