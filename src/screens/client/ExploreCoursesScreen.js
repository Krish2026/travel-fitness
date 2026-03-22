// Explore Courses Screen
// Browse and search fitness courses

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthContext } from "../../hooks";

export default function ExploreCoursesScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuthContext();

  useEffect(() => {
    // TODO: Fetch available courses from Firebase
    setLoading(false);
  }, []);

  const handleCoursePress = (courseId) => {
    navigation.navigate("CourseDetail", { courseId });
  };

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item.id)}
    >
      <View style={styles.courseImage}>
        <Ionicons name="book" size={40} color="#3b82f6" />
      </View>
      <View style={styles.courseInfo}>
        <Text style={styles.courseName} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.trainerName}>{item.trainerName}</Text>
        <View style={styles.courseFooter}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.rating}>{item.rating || "N/A"}</Text>
          </View>
          <Text style={styles.price}>${item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6b7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search courses..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
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
          <Ionicons name="search" size={64} color="#d1d5db" />
          <Text style={styles.emptyTitle}>No Courses Found</Text>
          <Text style={styles.emptyText}>
            Check back later for new fitness courses
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 16,
    color: "#1f2937",
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  courseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: "row",
  },
  courseImage: {
    width: 100,
    height: 100,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
  },
  courseInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
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
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 12,
    color: "#374151",
    fontWeight: "600",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3b82f6",
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
});
