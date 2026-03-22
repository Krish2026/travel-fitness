// Student Progress Screen
// View student's progress in a specific course

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StudentProgressScreen({ route }) {
  const { studentId, courseId } = route.params || {};
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch student progress from Firebase
    setLoading(false);
  }, [studentId, courseId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Overall Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Course Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "72%" }]} />
          </View>
          <Text style={styles.progressText}>72% Complete</Text>
        </View>
      </View>

      {/* Lesson History */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lesson Progress</Text>
        {[
          { name: "Lesson 1: Fundamentals", completed: true, daysAgo: 5 },
          { name: "Lesson 2: Techniques", completed: true, daysAgo: 4 },
          { name: "Lesson 3: Advanced", completed: true, daysAgo: 2 },
          { name: "Lesson 4: Mastery", completed: false, daysAgo: 0 },
        ].map((lesson, index) => (
          <View key={index} style={styles.lessonItem}>
            <View style={styles.lessonContent}>
              <View
                style={[
                  styles.lessonCheckbox,
                  lesson.completed && styles.lessonCheckboxCompleted,
                ]}
              >
                {lesson.completed && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
              <View style={styles.lessonInfo}>
                <Text
                  style={[
                    styles.lessonName,
                    lesson.completed && styles.lessonNameCompleted,
                  ]}
                >
                  {lesson.name}
                </Text>
                {lesson.daysAgo > 0 && (
                  <Text style={styles.lessonDate}>
                    Completed {lesson.daysAgo} days ago
                  </Text>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="time" size={24} color="#3b82f6" />
            <Text style={styles.statLabel}>Time Spent</Text>
            <Text style={styles.statValue}>18h 30m</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="list" size={24} color="#10b981" />
            <Text style={styles.statLabel}>Lessons Done</Text>
            <Text style={styles.statValue}>18/25</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame" size={24} color="#f59e0b" />
            <Text style={styles.statLabel}>Streak</Text>
            <Text style={styles.statValue}>5 days</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 16,
  },
  progressBarContainer: {
    gap: 12,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  progressText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  lessonItem: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  lessonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  lessonCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  lessonCheckboxCompleted: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
  lessonInfo: {
    flex: 1,
  },
  lessonName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
  },
  lessonNameCompleted: {
    color: "#6b7280",
  },
  lessonDate: {
    fontSize: 12,
    color: "#9ca3af",
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 4,
  },
  spacer: {
    height: 20,
  },
});
