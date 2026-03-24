import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/theme";

interface ProgressChartsProps {
  goalWeight?: number;
  currentWeight?: number;
  goalBodyFat?: number;
  currentBodyFat?: number;
  currentMuscle?: number;
}

export function ProgressCharts({
  goalWeight,
  currentWeight,
  goalBodyFat,
  currentBodyFat,
  currentMuscle,
}: ProgressChartsProps) {
  // Goal Progress Chart
  const getWeightProgress = (): number => {
    if (!goalWeight || !currentWeight) return 0;
    const totalChange = Math.abs(goalWeight - currentWeight);
    const startWeight = Math.max(goalWeight, currentWeight);
    const progress =
      ((startWeight - currentWeight + Math.abs(goalWeight - startWeight)) /
        totalChange) *
      100;
    return Math.max(0, Math.min(100, progress));
  };

  // Body Composition
  const bodyFatPercentage = currentBodyFat || 0;
  const musclePercentage = currentMuscle || 0;
  const otherPercentage = 100 - bodyFatPercentage - musclePercentage;

  return (
    <View style={styles.container}>
      {/* Goal Progress */}
      {goalWeight && currentWeight && (
        <View style={styles.goalProgressContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.title}>Goal Progress</Text>
            <Text style={styles.progressPercent}>
              {getWeightProgress().toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${getWeightProgress()}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.goalStatsContainer}>
            <View style={styles.goalStat}>
              <Text style={styles.goalStatLabel}>Starting</Text>
              <Text style={styles.goalStatValue}>
                {Math.max(goalWeight, currentWeight).toFixed(1)} lbs
              </Text>
            </View>
            <View style={styles.goalStat}>
              <Text style={styles.goalStatLabel}>Current</Text>
              <Text style={styles.goalStatValue}>
                {currentWeight.toFixed(1)} lbs
              </Text>
            </View>
            <View style={styles.goalStat}>
              <Text style={styles.goalStatLabel}>Goal</Text>
              <Text style={styles.goalStatValue}>
                {goalWeight.toFixed(1)} lbs
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Body Composition */}
      {(currentBodyFat || currentMuscle) && (
        <View style={styles.bodyCompositionContainer}>
          <Text style={styles.title}>Body Composition</Text>

          <View style={styles.compositionChartContainer}>
            <View style={styles.compositionPieContainer}>
              {/* Simple pie chart representation using nested circles */}
              <View
                style={[
                  styles.compositionSegment,
                  {
                    width: 150,
                    height: 150,
                    borderRadius: 75,
                    backgroundColor: "#FF5722",
                  },
                ]}
              />
              <View
                style={[
                  styles.compositionSegmentOverlay,
                  {
                    width: `${100 - bodyFatPercentage}%`,
                    backgroundColor: "#4CAF50",
                  },
                ]}
              />
            </View>

            <View style={styles.compositionLegend}>
              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#FF5722" }]}
                />
                <View style={styles.legendText}>
                  <Text style={styles.legendLabel}>Body Fat</Text>
                  <Text style={styles.legendValue}>
                    {currentBodyFat?.toFixed(1)}%
                  </Text>
                </View>
              </View>

              <View style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: "#4CAF50" }]}
                />
                <View style={styles.legendText}>
                  <Text style={styles.legendLabel}>Muscle</Text>
                  <Text style={styles.legendValue}>
                    {currentMuscle?.toFixed(1)}%
                  </Text>
                </View>
              </View>

              {otherPercentage > 0 && (
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendColor, { backgroundColor: "#9E9E9E" }]}
                  />
                  <View style={styles.legendText}>
                    <Text style={styles.legendLabel}>Other</Text>
                    <Text style={styles.legendValue}>
                      {otherPercentage.toFixed(1)}%
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  goalProgressContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  progressPercent: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  progressBarContainer: {
    marginBottom: theme.spacing.md,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: theme.colors.background,
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
  },
  goalStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  goalStat: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    alignItems: "center",
  },
  goalStatLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  goalStatValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  bodyCompositionContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
  },
  compositionChartContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.md,
    gap: theme.spacing.lg,
  },
  compositionPieContainer: {
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  compositionSegment: {
    justifyContent: "center",
    alignItems: "center",
  },
  compositionSegmentOverlay: {
    position: "absolute",
    height: "100%",
    borderRadius: 75,
  },
  compositionLegend: {
    flex: 1,
    gap: theme.spacing.md,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
});
