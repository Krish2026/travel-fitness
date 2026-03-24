import { View, Text, StyleSheet, FlatList } from "react-native";
import { theme } from "@/theme";

export type MeasurementType =
  | "chest"
  | "waist"
  | "hips"
  | "biceps"
  | "thighs"
  | "calves";

interface MeasurementDataPoint {
  date: Date;
  chest?: number;
  waist?: number;
  hips?: number;
  biceps?: number;
  thighs?: number;
  calves?: number;
}

interface MeasurementChartProps {
  data: MeasurementDataPoint[];
  selectedMeasurement?: MeasurementType;
  onMeasurementSelect?: (measurement: MeasurementType) => void;
}

const MEASUREMENT_COLORS: Record<MeasurementType, string> = {
  chest: "#2196F3",
  waist: "#4CAF50",
  hips: "#FF9800",
  biceps: "#FF5722",
  thighs: "#9C27B0",
  calves: "#00BCD4",
};

const MEASUREMENT_LABELS: Record<MeasurementType, string> = {
  chest: "Chest",
  waist: "Waist",
  hips: "Hips",
  biceps: "Biceps",
  thighs: "Thighs",
  calves: "Calves",
};

export function MeasurementChart({
  data,
  selectedMeasurement = "waist",
  onMeasurementSelect,
}: MeasurementChartProps) {
  if (data.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Body Measurements</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No measurement data yet. Start logging your measurements to see
            trends.
          </Text>
        </View>
      </View>
    );
  }

  const sortedData = [...data].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  // Get values for selected measurement
  const values = sortedData
    .map((d) => d[selectedMeasurement as keyof MeasurementDataPoint])
    .filter((v) => v !== undefined) as number[];

  if (values.length < 2) {
    return (
      <View style={styles.container}>
        <View style={styles.measurementSelector}>
          {(
            ["chest", "waist", "hips", "biceps", "thighs", "calves"] as const
          ).map((measurement) => (
            <Text
              key={measurement}
              style={[
                styles.measurementButton,
                selectedMeasurement === measurement &&
                  styles.measurementButtonActive,
              ]}
              onPress={() => onMeasurementSelect?.(measurement)}
            >
              {MEASUREMENT_LABELS[measurement]}
            </Text>
          ))}
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No data for {MEASUREMENT_LABELS[selectedMeasurement]}.
          </Text>
        </View>
      </View>
    );
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 5;

  // Calculate trend
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((sum, v) => sum + v, 0);
  const sumXY = values.reduce((sum, v, i) => sum + i * v, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const trendPerWeek = slope * 7;

  const mostRecentMeasurement = values[values.length - 1];
  const initialMeasurement = values[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Body Measurements</Text>

      <View style={styles.measurementSelector}>
        {(
          ["chest", "waist", "hips", "biceps", "thighs", "calves"] as const
        ).map((measurement) => (
          <Text
            key={measurement}
            style={[
              styles.measurementButton,
              selectedMeasurement === measurement &&
                styles.measurementButtonActive,
              {
                borderColor:
                  selectedMeasurement === measurement
                    ? MEASUREMENT_COLORS[measurement]
                    : "transparent",
              },
            ]}
            onPress={() => onMeasurementSelect?.(measurement)}
          >
            {MEASUREMENT_LABELS[measurement]}
          </Text>
        ))}
      </View>

      {/* Data representation */}
      <View style={styles.dataContainer}>
        <View style={styles.progressBars}>
          {values
            .slice(-8) // Show last 8 measurements
            .map((value, idx) => {
              const normalizedHeight = ((value - minValue) / range) * 100 + 20;
              const isLatest = idx === values.length - 1;

              return (
                <View key={idx} style={styles.barContainer}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: `${normalizedHeight}%`,
                        backgroundColor: isLatest
                          ? MEASUREMENT_COLORS[selectedMeasurement]
                          : MEASUREMENT_COLORS[selectedMeasurement] + "80",
                      },
                    ]}
                  />
                  <Text style={styles.barValue}>{value.toFixed(1)}"</Text>
                </View>
              );
            })}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statItem,
            { borderLeftColor: MEASUREMENT_COLORS[selectedMeasurement] },
          ]}
        >
          <Text style={styles.statLabel}>Current</Text>
          <Text style={styles.statValue}>
            {mostRecentMeasurement.toFixed(1)}"
          </Text>
        </View>

        <View
          style={[
            styles.statItem,
            { borderLeftColor: MEASUREMENT_COLORS[selectedMeasurement] },
          ]}
        >
          <Text style={styles.statLabel}>Trend</Text>
          <Text
            style={[
              styles.statValue,
              trendPerWeek < 0 && styles.positive,
              trendPerWeek > 0.1 && styles.negative,
            ]}
          >
            {trendPerWeek > 0 ? "+" : ""}
            {trendPerWeek.toFixed(2)}"/week
          </Text>
        </View>

        <View
          style={[
            styles.statItem,
            { borderLeftColor: MEASUREMENT_COLORS[selectedMeasurement] },
          ]}
        >
          <Text style={styles.statLabel}>Total Change</Text>
          <Text
            style={[
              styles.statValue,
              mostRecentMeasurement - initialMeasurement < 0 && styles.positive,
            ]}
          >
            {mostRecentMeasurement - initialMeasurement > 0 ? "+" : ""}
            {(mostRecentMeasurement - initialMeasurement).toFixed(1)}"
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  measurementSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  measurementButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  measurementButtonActive: {
    backgroundColor: theme.colors.primary + "20",
    color: theme.colors.primary,
  },
  dataContainer: {
    marginVertical: theme.spacing.md,
  },
  progressBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 150,
    paddingVertical: theme.spacing.md,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 4,
  },
  bar: {
    width: "80%",
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    minHeight: 20,
  },
  barValue: {
    fontSize: 10,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  positive: {
    color: "#4CAF50",
  },
  negative: {
    color: "#FF5722",
  },
  emptyState: {
    paddingVertical: theme.spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
});
