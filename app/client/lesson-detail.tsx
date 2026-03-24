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
import { useLocalSearchParams, useRouter } from "expo-router";
import { theme } from "@/theme";
import { getCourse, updateCourseProgress } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";
import { Course } from "@/lib/types";
import { default as Button } from "@/components/Button";

export default function LessonDetailScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { courseId, lessonIndex } = useLocalSearchParams<{
    courseId: string;
    lessonIndex: string;
  }>();

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedItems, setCompletedItems] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);

  const lessonIdx = parseInt(lessonIndex || "0", 10);
  const lesson = course?.lessons[lessonIdx];

  useEffect(() => {
    const loadCourse = async () => {
      try {
        if (!courseId) return;
        const courseData = await getCourse(courseId);
        setCourse(courseData as Course);

        // Load progress for this user
        // This would typically load from Firebase
        // For now, we'll initialize empty
        setCompletedItems(new Set());
      } catch (error) {
        console.error("Error loading course:", error);
        Alert.alert("Error", "Failed to load lesson");
      } finally {
        setIsLoading(false);
      }
    };

    loadCourse();
  }, [courseId]);

  const toggleChecklistItem = (itemIndex: number) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemIndex)) {
      newCompleted.delete(itemIndex);
    } else {
      newCompleted.add(itemIndex);
    }
    setCompletedItems(newCompleted);
  };

  const handleMarkLessonComplete = async () => {
    try {
      if (!courseId || !lesson || !user?.id) return;

      setIsSaving(true);

      // Update progress in Firebase
      await updateCourseProgress(courseId, user.id, {
        lessonIndex: lessonIdx,
        completedAt: new Date(),
        checklistProgress: Array.from(completedItems),
      });

      Alert.alert("Success", "Lesson marked as complete! 🎉", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error saving progress:", error);
      Alert.alert("Error", "Failed to save progress");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNextLesson = () => {
    if (!course || lessonIdx >= course.lessons.length - 1) {
      router.back();
      return;
    }

    router.replace({
      pathname: "/client/lesson-detail",
      params: {
        courseId,
        lessonIndex: (lessonIdx + 1).toString(),
      },
    });
  };

  const handlePreviousLesson = () => {
    if (lessonIdx <= 0) {
      router.back();
      return;
    }

    router.replace({
      pathname: "/client/lesson-detail",
      params: {
        courseId,
        lessonIndex: (lessonIdx - 1).toString(),
      },
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!lesson || !course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Lesson not found</Text>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  const checklistItems = lesson.checklist || [];
  const completionPercent =
    checklistItems.length > 0
      ? Math.round((completedItems.size / checklistItems.length) * 100)
      : 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.lessonCounter}>
          Lesson {lessonIdx + 1} of {course.lessons.length}
        </Text>
      </View>

      {/* Lesson Title & Description */}
      <View style={styles.lessonSection}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <Text style={styles.lessonDescription}>{lesson.description}</Text>
      </View>

      {/* Video Player Placeholder */}
      {lesson.videoUrl && (
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoIcon}>▶️</Text>
            <Text style={styles.videoText}>Video Player</Text>
            <Text style={styles.videoUrl}>{lesson.videoUrl}</Text>
          </View>
          <View style={styles.videoDuration}>
            <Text style={styles.videoDurationText}>
              ⏱️ {lesson.duration || "N/A"} minutes
            </Text>
          </View>
        </View>
      )}

      {/* Checklist Section */}
      {checklistItems.length > 0 && (
        <View style={styles.checklistSection}>
          <View style={styles.checklistHeader}>
            <Text style={styles.checklistTitle}>Lesson Checklist</Text>
            <Text style={styles.checklistProgress}>
              {completionPercent}% Complete
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${completionPercent}%` },
              ]}
            />
          </View>

          {/* Checklist Items */}
          <View style={styles.checklistItems}>
            {checklistItems.map((item, index) => (
              <Pressable
                key={index}
                style={styles.checklistItemContainer}
                onPress={() => toggleChecklistItem(index)}
              >
                <View
                  style={[
                    styles.checkbox,
                    completedItems.has(index) && styles.checkboxCompleted,
                  ]}
                >
                  {completedItems.has(index) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.checklistItemText,
                    completedItems.has(index) && styles.checklistItemCompleted,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Navigation Buttons */}
      <View style={styles.navigationButtons}>
        <Pressable
          style={[styles.navButton, lessonIdx === 0 && styles.navButtonDisabled]}
          onPress={handlePreviousLesson}
          disabled={lessonIdx === 0}
        >
          <Text
            style={[
              styles.navButtonText,
              lessonIdx === 0 && styles.navButtonTextDisabled,
            ]}
          >
            ← Previous
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.navButton,
            lessonIdx >= course.lessons.length - 1 && styles.navButtonDisabled,
          ]}
          onPress={handleNextLesson}
          disabled={false}
        >
          <Text
            style={[
              styles.navButtonText,
              false && styles.navButtonTextDisabled,
            ]}
          >
            Next →
          </Text>
        </Pressable>
      </View>

      {/* Complete Lesson Button */}
      <Button
        title={completionPercent === 100 ? "✓ Mark Complete" : "Mark Complete"}
        onPress={handleMarkLessonComplete}
        disabled={isSaving}
        variant={completionPercent === 100 ? "primary" : "secondary"}
      />

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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  courseTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  lessonCounter: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  lessonSection: {
    marginBottom: theme.spacing.xl,
  },
  lessonTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  lessonDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  videoContainer: {
    marginBottom: theme.spacing.xl,
  },
  videoPlaceholder: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.xl,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  videoIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  videoText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  videoUrl: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  videoDuration: {
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  videoDurationText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  checklistSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  checklistHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  checklistProgress: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: theme.spacing.lg,
  },
  progressBar: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  checklistItems: {
    gap: theme.spacing.md,
  },
  checklistItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  checkboxCompleted: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  checkmark: {
    color: "white",
    fontWeight: "700",
  },
  checklistItemText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  checklistItemCompleted: {
    textDecorationLine: "line-through",
    color: theme.colors.textSecondary,
  },
  navigationButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  navButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  navButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
