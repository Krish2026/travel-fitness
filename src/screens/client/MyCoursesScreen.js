// My Courses Screen
// List of courses the client is enrolled in

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

export default function MyCoursesScreen({ navigation }) {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    // TODO: Fetch enrolled courses from Firebase
    setLoading(false);
  }, [user?.uid]);

  const handleCoursePress = (courseId) => {
    navigation.navigate("Learn", { courseId });
  };

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item.id)}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseImage}>
          <Ionicons name="book" size={32} color="#3b82f6" />
        </View>
        <View style={styles.courseDetails}>
          <Text style={styles.courseName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.trainerName}>{item.trainerName}</Text>
        </View>
      </View>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${item.progress || 0}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>{item.progress || 0}% Complete</Text>
      </View>
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => handleCoursePress(item.id)}
      >
        <Text style={styles.continueButtonText}>Continue Learning</Text>
        <Ionicons name="chevron-forward" size={18} color="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : enrolledCourses.length > 0 ? (
        <FlatList
          data={enrolledCourses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="book" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Courses Yet</Text>
          <Text style={styles.emptyText}>
            Explore courses and enroll to get started
          </Text>
          <TouchableOpacity
            style={styles.exploreBu tton}
            onPress={() => navigation.getParent()?.navigate("Explore")}
          >
            <Text style={styles.exploreButtonText}>Browse Courses</Text>
          </TouchableOpacity>
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
    gap: 16,
  },
  courseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseHeader: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  courseImage: {
    width: 80,
    height: 80,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  courseDetails: {
    flex: 1,
    justifyContent: "center",
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  trainerName: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  progressText: {
    fontSize: 12,
    color: "#6b7280",
  },
  continueButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  centerContainer: {
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
  exploreButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  exploreButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
