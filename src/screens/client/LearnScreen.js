// Learn Screen
// View lesson content and mark as complete

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

export default function LearnScreen({ route, navigation }) {
  const { courseId } = route.params || {};
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch course lessons from Firebase
    setLoading(false);
  }, [courseId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      ) : (
        <ScrollView style={styles.content}>
          <View style={styles.lessonHeader}>
            <Text style={styles.title}>Course Lessons</Text>
          </View>

          {lessons.length > 0 ? (
            lessons.map((lesson, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.lessonCard,
                  currentLesson?.id === lesson.id && styles.activeLessonCard,
                ]}
                onPress={() => setCurrentLesson(lesson)}
              >
                <View style={styles.lessonContent}>
                  <Text style={styles.lessonNumber}>Lesson {index + 1}</Text>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDuration}>{lesson.duration} min</Text>
                </View>
                {lesson.completed ? (
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                ) : (
                  <Ionicons name="play-circle" size={24} color="#3b82f6" />
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="book" size={64} color="#d1d5db" />
              <Text style={styles.emptyText}>No lessons available</Text>
            </View>
          )}

          {currentLesson && (
            <View style={styles.lessonDetails}>
              <Text style={styles.detailsTitle}>{currentLesson.title}</Text>
              <Text style={styles.detailsDescription}>
                {currentLesson.description}
              </Text>
              <TouchableOpacity style={styles.completeButton}>
                <Text style={styles.completeButtonText}>Mark as Complete</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.spacer} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  lessonHeader: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  lessonCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  activeLessonCard: {
    backgroundColor: "#dbeafe",
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  lessonContent: {
    flex: 1,
  },
  lessonNumber: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  lessonDuration: {
    fontSize: 12,
    color: "#9ca3af",
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 12,
  },
  lessonDetails: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 8,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 12,
  },
  detailsDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 16,
  },
  completeButton: {
    backgroundColor: "#10b981",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  completeButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  spacer: {
    height: 20,
  },
});
