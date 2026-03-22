// Progress Screen
// Track course progress and statistics

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressScreen({ route }) {
  const { courseId } = route.params || {};
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch progress from Firebase
    setLoading(false);
  }, [courseId]);

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
        <Text style={styles.cardTitle}>Overall Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: "65%" }]} />
          </View>
          <Text style={styles.progressText}>65% Complete</Text>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Ionicons name="list" size={24} color="#3b82f6" />
          <Text style={styles.statNumber}>16/24</Text>
          <Text style={styles.statLabel}>Lessons Completed</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="time" size={24} color="#10b981" />
          <Text style={styles.statNumber}>12h 30m</Text>
          <Text style={styles.statLabel}>Time Spent</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="flame" size={24} color="#f59e0b" />
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        {[
          "Completed Lesson 16 - Advanced Workouts",
          "Completed Lesson 15 - Cardio Techniques",
          "Completed Lesson 14 - Strength Training",
        ].map((activity, index) => (
          <View key={index} style={styles.activityItem}>
            <Ionicons name="checkmark-done" size={18} color="#10b981" />
            <Text style={styles.activityText}>{activity}</Text>
          </View>
        ))}
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
    marginBottom: 16,
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
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 4,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 8,
    gap: 12,
  },
  activityText: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },
  spacer: {
    height: 20,
  },
});
