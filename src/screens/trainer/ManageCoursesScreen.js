// Manage Courses Screen
// Trainer's view of their courses

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

export default function ManageCoursesScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    // TODO: Fetch trainer's courses from Firebase
    setLoading(false);
  }, [user?.uid]);

  const handleCreateCourse = () => {
    navigation.navigate("CreateCourse");
  };

  const handleEditCourse = (courseId) => {
    navigation.navigate("EditCourse", { courseId });
  };

  const renderCourseCard = ({ item }) => (
    <View style={styles.courseCard}>
      <View style={styles.courseInfo}>
        <Text style={styles.courseName} numberOfLines={2}>
          {item.name}
        </Text>
        <View style={styles.courseStats}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={14} color="#6b7280" />
            <Text style={styles.statText}>{item.studentCount} students</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="list" size={14} color="#6b7280" />
            <Text style={styles.statText}>{item.lessonCount} lessons</Text>
          </View>
        </View>
        <Text style={styles.priceText}>${item.price}</Text>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => handleEditCourse(item.id)}
      >
        <Ionicons name="pencil" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateCourse}
      >
        <Ionicons name="add-circle" size={24} color="white" />
        <Text style={styles.createButtonText}>Create New Course</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : courses.length > 0 ? (
        <FlatList
          data={courses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="book" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Courses</Text>
          <Text style={styles.emptyText}>Create your first course to get started</Text>
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
  createButton: {
    flexDirection: "row",
    backgroundColor: "#3b82f6",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  createButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  courseCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
  },
  courseStats: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#6b7280",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3b82f6",
  },
  editButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    padding: 10,
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
