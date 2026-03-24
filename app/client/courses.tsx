import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { getCourse, getCoursesForTrainer } from "@/lib/firebase";
import { Course } from "@/lib/types";
import { Button } from "@/components/Button";

export default function CoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    "all",
    "fitness",
    "nutrition",
    "wellness",
    "mental-health",
  ];

  useEffect(() => {
    const loadCourses = async () => {
      try {
        // In a real app, this would fetch all courses from all trainers
        // For now, we'll fetch from a specific trainer or implement getAllCourses
        // TODO: Implement getAllCourses function in firebase.ts
        setCourses([]);
      } catch (error) {
        console.error("Error loading courses:", error);
        Alert.alert("Error", "Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  const handleEnrollCourse = (courseId: string) => {
    Alert.alert(
      "Enroll Course",
      "Are you sure you want to enroll in this course?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Enroll",
          onPress: () => {
            // TODO: Implement course enrollment
            Alert.alert("Success", "You're enrolled in the course!");
            router.push({
              pathname: "/client/lesson-detail",
              params: {
                courseId,
                lessonIndex: "0",
              },
            });
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const filteredCourses = courses;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Browse Courses</Text>
        <Text style={styles.subtitle}>
          Learn from expert trainers and transform your fitness
        </Text>
      </View>

      {/* Category Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((cat) => (
          <Pressable
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === cat && styles.categoryButtonTextActive,
              ]}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " ")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Courses List */}
      {filteredCourses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📚</Text>
          <Text style={styles.emptyStateTitle}>No courses available</Text>
          <Text style={styles.emptyStateSubtitle}>
            Check back soon for new courses
          </Text>
        </View>
      ) : (
        <View style={styles.coursesList}>
          {filteredCourses.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              {/* Course Header */}
              <View style={styles.courseHeader}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseTitleCard}>{course.title}</Text>
                </View>
                <Text style={styles.courseLessons}>
                  {course.lessons?.length || 0} lessons
                </Text>
              </View>

              {/* Course Description */}
              <Text style={styles.courseDescription}>{course.description}</Text>

              {/* Trainer Info */}
              {course.trainerId && (
                <View style={styles.trainerSection}>
                  <Text style={styles.trainerLabel}>Trainer</Text>
                  <Text style={styles.trainerName}>{course.trainerId}</Text>
                </View>
              )}

              {/* Course Meta */}
              <View style={styles.courseMeta}>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⏱️</Text>
                  <Text style={styles.metaText}>
                    {course.lessons?.reduce(
                      (sum, lesson) =>
                        sum + (parseInt(String(lesson.duration || "0")) || 0),
                      0,
                    ) || 0}{" "}
                    mins
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>✓</Text>
                  <Text style={styles.metaText}>
                    {course.lessons?.length || 0} lessons
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={styles.metaIcon}>⭐</Text>
                  <Text style={styles.metaText}>4.8</Text>
                </View>
              </View>

              {/* Enroll Button */}
              <Pressable
                style={styles.enrollButton}
                onPress={() => handleEnrollCourse(course.id)}
              >
                <Text style={styles.enrollButtonText}>Enroll Now</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  header: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  categoryScroll: {
    marginBottom: theme.spacing.lg,
  },
  categoryContent: {
    gap: theme.spacing.md,
    paddingRight: theme.spacing.lg,
  },
  categoryButton: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  categoryButtonTextActive: {
    color: "white",
  },
  coursesList: {
    gap: theme.spacing.lg,
  },
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  courseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  courseInfo: {
    flex: 1,
  },
  courseTitleCard: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  courseCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
    letterSpacing: 0.5,
  },
  courseLessons: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  courseDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  trainerSection: {
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  trainerLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  trainerName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  courseMeta: {
    flexDirection: "row",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.colors.border,
    borderBottomColor: theme.colors.border,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  metaIcon: {
    fontSize: 14,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
  enrollButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  enrollButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
