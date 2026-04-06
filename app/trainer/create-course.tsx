import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { theme } from "@/theme";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { createCourse } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  checklist: Array<{ id: string; text: string; order: number }>;
  order: number;
}

export default function CreateCourseScreen() {
  const { user } = useAuthStore();
  const trainerId = user?.id || "";

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: "",
    title: "",
    description: "",
    videoUrl: "",
    duration: 0,
    checklist: [],
    order: lessons.length,
  });

  const [currentChecklistItem, setCurrentChecklistItem] = useState("");

  const canAddLesson = () => {
    return (
      currentLesson.title.trim() &&
      currentLesson.videoUrl.trim() &&
      currentLesson.duration > 0
    );
  };

  const handleAddChecklistItem = () => {
    if (!currentChecklistItem.trim()) return;

    const newChecklist = [
      ...currentLesson.checklist,
      {
        id: `checklist_${currentLesson.checklist.length}`,
        text: currentChecklistItem,
        order: currentLesson.checklist.length,
      },
    ];

    setCurrentLesson({ ...currentLesson, checklist: newChecklist });
    setCurrentChecklistItem("");
  };

  const handleRemoveChecklistItem = (id: string) => {
    const newChecklist = currentLesson.checklist.filter(
      (item) => item.id !== id,
    );
    setCurrentLesson({ ...currentLesson, checklist: newChecklist });
  };

  const handleAddLesson = () => {
    if (!canAddLesson()) {
      Alert.alert(
        "Invalid Lesson",
        "Please fill in all required lesson fields",
      );
      return;
    }

    if (lessons.length >= 10) {
      Alert.alert(
        "Limit Reached",
        "You can only have a maximum of 10 lessons per course",
      );
      return;
    }

    const newLesson = {
      ...currentLesson,
      id: `lesson_${lessons.length}`,
      order: lessons.length,
    };

    setLessons([...lessons, newLesson]);
    resetCurrentLesson();
  };

  const resetCurrentLesson = () => {
    setCurrentLesson({
      id: "",
      title: "",
      description: "",
      videoUrl: "",
      duration: 0,
      checklist: [],
      order: lessons.length + 1,
    });
    setCurrentChecklistItem("");
  };

  const handleRemoveLesson = (id: string) => {
    setLessons(lessons.filter((lesson) => lesson.id !== id));
  };

  const handleCreateCourse = async () => {
    const newErrors: Record<string, string> = {};

    if (!courseTitle.trim()) newErrors.courseTitle = "Course title is required";
    if (!courseDescription.trim())
      newErrors.courseDescription = "Course description is required";
    if (lessons.length === 0)
      newErrors.lessons = "At least one lesson is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const courseData = {
        title: courseTitle,
        description: courseDescription,
        lessons: lessons.map((lesson) => ({
          title: lesson.title,
          description: lesson.description,
          videoUrl: lesson.videoUrl,
          duration: lesson.duration,
          checklist: lesson.checklist,
          order: lesson.order,
        })),
      };

      await createCourse(trainerId, courseData);
      Alert.alert("Success", "Course created successfully!");
      router.back();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create course";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </Pressable>
        <Text style={styles.title}>Create Course</Text>
      </View>

      {/* Course Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Information</Text>

        <Input
          label="Course Title"
          placeholder="Enter course title"
          value={courseTitle}
          onChangeText={(text) => {
            setCourseTitle(text);
            if (errors.courseTitle) {
              const newErrors = { ...errors };
              delete newErrors.courseTitle;
              setErrors(newErrors);
            }
          }}
          error={errors.courseTitle}
          containerStyle={{ marginBottom: theme.spacing.lg }}
        />

        <Input
          label="Course Description"
          placeholder="Describe your course"
          value={courseDescription}
          onChangeText={(text) => {
            setCourseDescription(text);
            if (errors.courseDescription) {
              const newErrors = { ...errors };
              delete newErrors.courseDescription;
              setErrors(newErrors);
            }
          }}
          multiline
          numberOfLines={4}
          error={errors.courseDescription}
          containerStyle={{ marginBottom: theme.spacing.lg }}
        />
      </View>

      {/* Lessons Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lessons ({lessons.length}/10)</Text>
          {errors.lessons && (
            <Text style={styles.errorText}>{errors.lessons}</Text>
          )}
        </View>

        {/* Current Lesson Builder */}
        <View style={styles.lessonBuilder}>
          <Text style={styles.lessonBuilderTitle}>
            Create Lesson {lessons.length + 1}
          </Text>

          <Input
            label="Lesson Title"
            placeholder="e.g., Warm-up Exercises"
            value={currentLesson.title}
            onChangeText={(text) =>
              setCurrentLesson({ ...currentLesson, title: text })
            }
            containerStyle={{ marginBottom: theme.spacing.lg }}
          />

          <Input
            label="Description"
            placeholder="Describe this lesson"
            value={currentLesson.description}
            onChangeText={(text) =>
              setCurrentLesson({ ...currentLesson, description: text })
            }
            multiline
            numberOfLines={3}
            containerStyle={{ marginBottom: theme.spacing.lg }}
          />

          <Input
            label="Video URL"
            placeholder="https://example.com/video.mp4"
            value={currentLesson.videoUrl}
            onChangeText={(text) =>
              setCurrentLesson({ ...currentLesson, videoUrl: text })
            }
            containerStyle={{ marginBottom: theme.spacing.lg }}
          />

          <Input
            label="Duration (seconds)"
            placeholder="e.g., 600"
            keyboardType="number-pad"
            value={currentLesson.duration.toString()}
            onChangeText={(text) =>
              setCurrentLesson({
                ...currentLesson,
                duration: parseInt(text) || 0,
              })
            }
            containerStyle={{ marginBottom: theme.spacing.lg }}
          />

          {/* Checklist Items */}
          <View>
            <Text style={styles.checklistLabel}>Checklist Items</Text>
            <View style={styles.checklistInputRow}>
              <Input
                placeholder="Add checklist item"
                value={currentChecklistItem}
                onChangeText={setCurrentChecklistItem}
                containerStyle={{ flex: 1, marginBottom: 0 }}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.addChecklistButton,
                  pressed && styles.pressed,
                ]}
                onPress={handleAddChecklistItem}
              >
                <Text style={styles.addChecklistButtonText}>+</Text>
              </Pressable>
            </View>

            {/* Checklist Items List */}
            {currentLesson.checklist.length > 0 && (
              <View style={styles.checklistItems}>
                {currentLesson.checklist.map((item) => (
                  <View key={item.id} style={styles.checklistItem}>
                    <Text style={styles.checklistItemText}>{item.text}</Text>
                    <Pressable
                      onPress={() => handleRemoveChecklistItem(item.id)}
                    >
                      <Text style={styles.removeButton}>✕</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Add Lesson Button */}
          <Button
            title={`Add Lesson ${lessons.length + 1}`}
            onPress={handleAddLesson}
            disabled={!canAddLesson() || lessons.length >= 10}
            style={{ marginTop: theme.spacing.lg }}
          />
        </View>

        {/* Lessons List */}
        {lessons.length > 0 && (
          <View style={styles.lessonsList}>
            <Text style={styles.lessonsListTitle}>Added Lessons</Text>
            {lessons.map((lesson, index) => (
              <View key={lesson.id} style={styles.lessonCard}>
                <View style={styles.lessonCardContent}>
                  <Text style={styles.lessonNumber}>Lesson {index + 1}</Text>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonMeta}>
                    {lesson.checklist.length} checklist items •{" "}
                    {Math.round(lesson.duration / 60)} min
                  </Text>
                </View>
                <Pressable
                  onPress={() => handleRemoveLesson(lesson.id)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>✕</Text>
                </Pressable>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Create Course Button */}
      <View style={styles.footer}>
        <Button
          title={isLoading ? "Creating..." : "Create Course"}
          onPress={handleCreateCourse}
          disabled={isLoading || lessons.length === 0 || !courseTitle.trim()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionHeader: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  lessonBuilder: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  lessonBuilderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  checklistLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  checklistInputRow: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  addChecklistButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  addChecklistButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "white",
  },
  checklistItems: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    marginBottom: theme.spacing.md,
  },
  checklistItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  checklistItemText: {
    fontSize: 14,
    color: theme.colors.text,
    flex: 1,
  },
  removeButton: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.error,
    padding: theme.spacing.xs,
  },
  lessonsList: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.lg,
  },
  lessonsListTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  lessonCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.success,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonCardContent: {
    flex: 1,
  },
  lessonNumber: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.success,
    marginBottom: theme.spacing.xs,
  },
  lessonTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  lessonMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  removeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.error,
  },
  footer: {
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: 0,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.error,
  },
  pressed: {
    opacity: 0.8,
  },
});
