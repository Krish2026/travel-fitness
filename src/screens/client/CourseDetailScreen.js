// Course Detail Screen
// View course information and enroll

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

export default function CourseDetailScreen({ route, navigation }) {
  const { courseId } = route.params || {};
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    // TODO: Fetch course details from Firebase
    setLoading(false);
  }, [courseId]);

  const handleEnroll = async () => {
    // TODO: Call enrollment API
    setEnrolled(true);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Course Header */}
      <View style={styles.headerCard}>
        <View style={styles.courseImageBig}>
          <Ionicons name="book" size={80} color="#3b82f6" />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.courseName}>Sample Course</Text>
          <Text style={styles.trainerName}>Expert Trainer</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.rating}>4.8 (234 reviews)</Text>
          </View>
        </View>
      </View>

      {/* Course Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About This Course</Text>
        <Text style={styles.description}>
          Learn fitness techniques from an experienced trainer. This comprehensive
          course covers everything you need to know.
        </Text>
      </View>

      {/* Course Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#3b82f6" />
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>8 weeks</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="list" size={24} color="#10b981" />
          <Text style={styles.statLabel}>Lessons</Text>
          <Text style={styles.statValue}>24</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="people" size={24} color="#f59e0b" />
          <Text style={styles.statLabel}>Students</Text>
          <Text style={styles.statValue}>1.2K</Text>
        </View>
      </View>

      {/* What You'll Learn */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What You'll Learn</Text>
        {["Fitness fundamentals", "Proper form and technique", "Nutrition tips", "Progress tracking"].map(
          (item, index) => (
            <View key={index} style={styles.listItem}>
              <Ionicons name="checkmark-circle" size={20} color="#10b981" />
              <Text style={styles.listItemText}>{item}</Text>
            </View>
          ),
        )}
      </View>

      {/* Price and Enroll */}
      <View style={styles.enrollSection}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Course Price</Text>
          <Text style={styles.price}>$49.99</Text>
        </View>
        <TouchableOpacity
          style={[styles.enrollButton, enrolled && styles.enrolledButton]}
          onPress={handleEnroll}
          disabled={enrolled}
        >
          <Text style={styles.enrollButtonText}>
            {enrolled ? "Enrolled" : "Enroll Now"}
          </Text>
        </TouchableOpacity>
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
  headerCard: {
    backgroundColor: "white",
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    alignItems: "center",
  },
  courseImageBig: {
    width: 120,
    height: 120,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerContent: {
    alignItems: "center",
  },
  courseName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  trainerName: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rating: {
    fontSize: 14,
    color: "#374151",
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginTop: 4,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  listItemText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  enrollSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "white",
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  priceContainer: {
    alignItems: "center",
  },
  priceLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#3b82f6",
    marginTop: 4,
  },
  enrollButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  enrolledButton: {
    backgroundColor: "#10b981",
  },
  enrollButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  spacer: {
    height: 20,
  },
});
