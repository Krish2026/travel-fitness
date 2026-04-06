import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { getProgressData } from "@/lib/firebase";

export default function ProgressScreen() {
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<
    "weight" | "measurements" | "courses"
  >("weight");
  const [progressData, setProgressData] = useState<any>(null);
  const [stats, setStats] = useState({
    currentWeight: 75,
    goalWeight: 70,
    weightChange: -2.5,
    coursesCompleted: 0,
    coursesEnrolled: 0,
    lessonsCompleted: 0,
    totalLessons: 0,
    streakDays: 0,
    lastEntryDate: new Date(),
  });

  useEffect(() => {
    loadProgressData();
  }, [user?.id]);

  const loadProgressData = async () => {
    try {
      if (!user?.id) return;
      const data = await getProgressData(user.id);
      setProgressData(data);

      // Calculate stats from health entries
      if (data.healthEntries && data.healthEntries.length > 0) {
        const weightEntries = data.healthEntries.filter(
          (e: any) => e.type === "weight",
        );
        if (weightEntries.length > 0) {
          const latestWeight = weightEntries[0].weight.value;
          const oldestWeight =
            weightEntries[weightEntries.length - 1].weight.value;
          setStats((prev) => ({
            ...prev,
            currentWeight: latestWeight,
            weightChange: oldestWeight - latestWeight,
            lastEntryDate: new Date(weightEntries[0].date),
          }));
        }
      }

      // Calculate course stats
      if (data.enrollments) {
        const completedCourses = data.enrollments.filter(
          (e: any) => e.progress >= 100,
        ).length;
        setStats((prev) => ({
          ...prev,
          coursesEnrolled: data.enrollments.length,
          coursesCompleted: completedCourses,
        }));
      }
    } catch (error) {
      console.error("Error loading progress data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const progressPercent = Math.min(
    (stats.coursesCompleted / stats.coursesEnrolled) * 100,
    100,
  );
  const lessonPercent = (stats.lessonsCompleted / stats.totalLessons) * 100;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>Track your fitness journey</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {/* Weight Stat */}
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚖️</Text>
          <Text style={styles.statLabel}>Current Weight</Text>
          <Text style={styles.statValue}>{stats.currentWeight} kg</Text>
          <Text style={styles.statChange}>
            {stats.weightChange < 0 ? "📉" : "📈"}{" "}
            {Math.abs(stats.weightChange)} kg
          </Text>
        </View>

        {/* Goal Stat */}
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🎯</Text>
          <Text style={styles.statLabel}>Goal Weight</Text>
          <Text style={styles.statValue}>{stats.goalWeight} kg</Text>
          <Text style={styles.statChange}>
            {stats.goalWeight - stats.currentWeight > 0
              ? `${stats.goalWeight - stats.currentWeight} kg left`
              : "Goal Reached! 🎉"}
          </Text>
        </View>

        {/* Streak Stat */}
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statLabel}>Streak</Text>
          <Text style={styles.statValue}>{stats.streakDays} days</Text>
          <Text style={styles.statChange}>Keep it up!</Text>
        </View>

        {/* Courses Stat */}
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📚</Text>
          <Text style={styles.statLabel}>Courses</Text>
          <Text style={styles.statValue}>{stats.coursesCompleted}</Text>
          <Text style={styles.statChange}>
            of {stats.coursesEnrolled} completed
          </Text>
        </View>
      </View>

      {/* Metric Tabs */}
      <View style={styles.tabBar}>
        {["weight", "measurements", "courses"].map((metric) => (
          <Pressable
            key={metric}
            style={[styles.tab, selectedMetric === metric && styles.tabActive]}
            onPress={() =>
              setSelectedMetric(metric as "weight" | "measurements" | "courses")
            }
          >
            <Text
              style={[
                styles.tabText,
                selectedMetric === metric && styles.tabTextActive,
              ]}
            >
              {metric === "weight" && "⚖️"}
              {metric === "measurements" && "📏"}
              {metric === "courses" && "📚"}{" "}
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Weight Chart */}
      {selectedMetric === "weight" && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Weight Progress</Text>

          {/* Chart Placeholder */}
          <View style={styles.chartContainer}>
            <View style={styles.chart}>
              {/* Y-axis labels */}
              <View style={styles.yAxis}>
                <Text style={styles.yAxisLabel}>85</Text>
                <Text style={styles.yAxisLabel}>80</Text>
                <Text style={styles.yAxisLabel}>75</Text>
                <Text style={styles.yAxisLabel}>70</Text>
              </View>

              {/* Chart bars */}
              <View style={styles.chartBars}>
                <View style={styles.bar}>
                  <View
                    style={[styles.barFill, { height: "85%" }, styles.barPast]}
                  />
                  <Text style={styles.barLabel}>Week 1</Text>
                </View>
                <View style={styles.bar}>
                  <View
                    style={[styles.barFill, { height: "80%" }, styles.barPast]}
                  />
                  <Text style={styles.barLabel}>Week 2</Text>
                </View>
                <View style={styles.bar}>
                  <View
                    style={[styles.barFill, { height: "78%" }, styles.barPast]}
                  />
                  <Text style={styles.barLabel}>Week 3</Text>
                </View>
                <View style={styles.bar}>
                  <View
                    style={[
                      styles.barFill,
                      { height: "75%" },
                      styles.barCurrent,
                    ]}
                  />
                  <Text style={styles.barLabel}>Now</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.metricStats}>
            <View style={styles.metricStat}>
              <Text style={styles.metricLabel}>Starting Weight</Text>
              <Text style={styles.metricValue}>78 kg</Text>
            </View>
            <View style={styles.metricStat}>
              <Text style={styles.metricLabel}>Total Loss</Text>
              <Text style={styles.metricValue}>3 kg</Text>
            </View>
            <View style={styles.metricStat}>
              <Text style={styles.metricLabel}>Avg per Week</Text>
              <Text style={styles.metricValue}>1 kg</Text>
            </View>
          </View>
        </View>
      )}

      {/* Measurements Chart */}
      {selectedMetric === "measurements" && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Body Measurements</Text>

          <View style={styles.measurementsList}>
            {["Chest", "Waist", "Hips", "Arms", "Thighs"].map((measurement) => {
              const progress = Math.random() * 100;
              return (
                <View key={measurement} style={styles.measurementItem}>
                  <View style={styles.measurementHeader}>
                    <Text style={styles.measurementName}>{measurement}</Text>
                    <Text style={styles.measurementValue}>
                      {(80 + Math.random() * 20).toFixed(1)} cm
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${progress}%` }]}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Courses Chart */}
      {selectedMetric === "courses" && (
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Course Progress</Text>

          {/* Overall Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Overall Completion</Text>
              <Text style={styles.progressPercent}>
                {Math.round(progressPercent)}%
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${progressPercent}%` }]}
              />
            </View>
          </View>

          {/* Lesson Progress */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Lessons Completed</Text>
              <Text style={styles.progressPercent}>
                {stats.lessonsCompleted}/{stats.totalLessons}
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[styles.progressBar, { width: `${lessonPercent}%` }]}
              />
            </View>
          </View>

          {/* Course List */}
          <View style={styles.coursesList}>
            <Text style={styles.coursesListTitle}>Your Courses</Text>
            {[1, 2, 3].map((course) => (
              <View key={course} style={styles.courseItem}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>Course {course}</Text>
                  <Text style={styles.courseProgress}>
                    {Math.floor(Math.random() * 10) + 1}/10 lessons
                  </Text>
                </View>
                <Text style={styles.courseStatus}>
                  {Math.floor(Math.random() * 100)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Last Entry */}
      <View style={styles.lastEntry}>
        <Text style={styles.lastEntryLabel}>Last Entry</Text>
        <Text style={styles.lastEntryDate}>
          {stats.lastEntryDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </Text>
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
  header: {
    paddingVertical: theme.spacing.lg,
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
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  statCard: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  statIcon: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  statChange: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  tabBar: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
  tabTextActive: {
    color: "white",
  },
  chartSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  chartContainer: {
    marginBottom: theme.spacing.lg,
  },
  chart: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 200,
    gap: theme.spacing.md,
  },
  yAxis: {
    justifyContent: "space-between",
    height: "100%",
  },
  yAxisLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  chartBars: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
  },
  bar: {
    alignItems: "center",
    flex: 1,
  },
  barFill: {
    width: "80%",
    borderRadius: 4,
    marginBottom: theme.spacing.sm,
  },
  barPast: {
    backgroundColor: theme.colors.primary + "60",
  },
  barCurrent: {
    backgroundColor: theme.colors.primary,
  },
  barLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  metricStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  metricStat: {
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  measurementsList: {
    gap: theme.spacing.lg,
  },
  measurementItem: {
    gap: theme.spacing.sm,
  },
  measurementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  measurementName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  measurementValue: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
  progressCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  coursesList: {
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  coursesListTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  courseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  courseProgress: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  courseStatus: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  lastEntry: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginVertical: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: "center",
  },
  lastEntryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  lastEntryDate: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
