import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { theme } from "@/theme";
import { TrainerProfile, Course } from "@/lib/types";
import { router } from "expo-router";

export default function TrainersScreen() {
  const { user, isLoading: authLoading } = useAuthStore();
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role === "trainer") {
      setIsLoading(false);
      return;
    }

    const loadTrainerData = async () => {
      try {
        // Get trainer profile for the client
        const clientData = user as any;
        const trainerId = clientData.trainerId;

        const trainerRef = doc(db, "trainers", trainerId);
        const trainerSnap = await getDoc(trainerRef);

        if (trainerSnap.exists()) {
          setTrainer(trainerSnap.data() as TrainerProfile);

          // Get trainer's courses
          const coursesRef = collection(db, "courses");
          const q = query(coursesRef, where("trainerId", "==", trainerId));
          const coursesSnap = await getDocs(q);

          const coursesList = coursesSnap.docs.map(
            (doc) => doc.data() as Course,
          );
          setCourses(coursesList);
        }
      } catch (error) {
        console.error("Error loading trainer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrainerData();
  }, [user]);

  if (authLoading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (user?.role === "trainer") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trainer Dashboard</Text>
        <Text style={styles.subtitle}>
          This section is for clients viewing their trainer's courses
        </Text>
      </View>
    );
  }

  if (!trainer) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trainer Not Found</Text>
        <Text style={styles.subtitle}>Could not load trainer information</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Trainer Profile Card */}
      <View style={styles.trainerCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatar}>
            {trainer.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.trainerName}>{trainer.name}</Text>
        <Text style={styles.bio}>{trainer.bio}</Text>

        {/* Specialties */}
        <View style={styles.specialtiesContainer}>
          {trainer.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Courses Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Courses</Text>

        {courses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No courses available yet</Text>
          </View>
        ) : (
          courses.map((course) => (
            <Pressable
              key={course.id}
              style={({ pressed }) => [
                styles.courseCard,
                pressed && styles.pressed,
              ]}
              onPress={() => router.push(`/(tabs)/trainers/${course.id}`)}
            >
              <View style={styles.courseContent}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <Text style={styles.courseDescription} numberOfLines={2}>
                  {course.description}
                </Text>
                <Text style={styles.lessonCount}>
                  {course.lessons.length} lessons
                </Text>
              </View>
              <View style={styles.courseArrow}>
                <Text style={styles.arrowText}>→</Text>
              </View>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
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
    textAlign: "center",
  },
  trainerCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
    marginVertical: theme.spacing.lg,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  avatar: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  trainerName: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  bio: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    justifyContent: "center",
  },
  specialtyBadge: {
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  section: {
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  courseCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseContent: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  courseDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    lineHeight: 18,
  },
  lessonCount: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  courseArrow: {
    padding: theme.spacing.sm,
  },
  arrowText: {
    fontSize: 20,
    color: theme.colors.primary,
  },
  emptyState: {
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  pressed: {
    opacity: 0.7,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
