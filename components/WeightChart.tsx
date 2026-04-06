import { View, Text, StyleSheet, Dimensions } from "react-native";
import { theme } from "@/theme";

interface DataPoint {
  date: Date;
  value: number;
}

interface WeightChartProps {
  data: DataPoint[];
  goalWeight?: number;
  currentWeight?: number;
  timeRange?: "30" | "90" | "all";
  onTimeRangeChange?: (range: "30" | "90" | "all") => void;
}

export function WeightChart({
  data,
  goalWeight,
  currentWeight,
  timeRange = "all",
  onTimeRangeChange,
}: WeightChartProps) {
  if (data.length < 2) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Weight Progression</Text>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            No weight data yet. Start logging your weight to see trends.
          </Text>
        </View>
      </View>
    );
  }

  // Sort data by date
  const sortedData = [...data].sort(
    (a, b) => a.date.getTime() - b.date.getTime(),
  );

  const minValue = Math.min(...sortedData.map((d) => d.value));
  const maxValue = Math.max(...sortedData.map((d) => d.value));
  const range = maxValue - minValue || 10;
  const padding = range * 0.2; // 20% padding

  const chartMinValue = minValue - padding;
  const chartMaxValue = maxValue + padding;
  const chartRange = chartMaxValue - chartMinValue;

  // Calculate trend (simple linear regression)
  const n = sortedData.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = sortedData.reduce((sum, d) => sum + d.value, 0);
  const sumXY = sortedData.reduce((sum, d, i) => sum + i * d.value, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const trendValue = intercept + slope * (n - 1);
  const trendPerWeek = slope * 7; // Approximate weekly change

  const canvasHeight = 200;
  const canvasWidth = Dimensions.get("window").width - 60;

  // Calculate positions for points
  const points = sortedData.map((point, index) => {
    const x = (index / (n - 1)) * canvasWidth;
    const normalizedValue = (point.value - chartMinValue) / chartRange;
    const y = canvasHeight - normalizedValue * canvasHeight;
    return { x, y, value: point.value };
  });

  const getLastNPoints = (num: number) => points.slice(-num);

  let displayPoints = points;
  if (timeRange === "30") {
    displayPoints = getLastNPoints(30);
  } else if (timeRange === "90") {
    displayPoints = getLastNPoints(90);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weight Progression</Text>
        {currentWeight && (
          <View style={styles.currentWeightBadge}>
            <Text style={styles.currentWeightValue}>{currentWeight}</Text>
            <Text style={styles.currentWeightLabel}>lbs</Text>
          </View>
        )}
      </View>

      {/* Time range selector */}
      <View style={styles.timeRangeContainer}>
        {(["30", "90", "all"] as const).map((range) => (
          <Text
            key={range}
            style={[
              styles.timeRangeButton,
              timeRange === range && styles.timeRangeButtonActive,
            ]}
            onPress={() => onTimeRangeChange?.(range)}
          >
            {range === "all" ? "All Time" : `${range}D`}
          </Text>
        ))}
      </View>

      {/* Simple line chart representation */}
      <View style={styles.chartContainer}>
        <View
          style={[styles.chart, { height: canvasHeight, width: canvasWidth }]}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((fraction, idx) => (
            <View
              key={`grid-${idx}`}
              style={[
                styles.gridLine,
                {
                  top: `${fraction * 100}%`,
                  width: canvasWidth,
                },
              ]}
            />
          ))}

          {/* Data points */}
          {displayPoints.map((point, idx) => (
            <View
              key={idx}
              style={[
                styles.dataPoint,
                {
                  left: point.x,
                  top: point.y - 4, // Center the dot
                },
              ]}
            >
              <View style={styles.dataPointDot} />
            </View>
          ))}

          {/* Y-axis labels */}
          <View style={styles.yAxisLabels}>
            <Text style={styles.yAxisLabel}>{Math.round(chartMaxValue)}</Text>
            <Text style={styles.yAxisLabel}>
              {Math.round((chartMaxValue + chartMinValue) / 2)}
            </Text>
            <Text style={styles.yAxisLabel}>{Math.round(chartMinValue)}</Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Trend</Text>
          <Text style={[styles.statValue, trendPerWeek < 0 && styles.positive]}>
            {trendPerWeek > 0 ? "+" : ""}
            {trendPerWeek.toFixed(2)} lbs/week
          </Text>
        </View>

        {goalWeight && currentWeight && (
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>To Goal</Text>
            <Text style={styles.statValue}>
              {(goalWeight - currentWeight).toFixed(1)} lbs
            </Text>
          </View>
        )}

        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total Change</Text>
          <Text
            style={[
              styles.statValue,
              sortedData[n - 1].value - sortedData[0].value < 0 &&
                styles.positive,
            ]}
          >
            {sortedData[n - 1].value - sortedData[0].value > 0 ? "+" : ""}
            {(sortedData[n - 1].value - sortedData[0].value).toFixed(1)} lbs
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
  header: {
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
  currentWeightBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  currentWeightValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  currentWeightLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
  },
  timeRangeContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  timeRangeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    overflow: "hidden",
  },
  timeRangeButtonActive: {
    backgroundColor: theme.colors.primary,
    color: "white",
  },
  chartContainer: {
    marginVertical: theme.spacing.md,
    alignItems: "center",
  },
  chart: {
    position: "relative",
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  gridLine: {
    position: "absolute",
    height: 1,
    backgroundColor: theme.colors.border,
    opacity: 0.3,
  },
  dataPoint: {
    position: "absolute",
  },
  dataPointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    borderWidth: 2,
    borderColor: "white",
  },
  yAxisLabels: {
    position: "absolute",
    left: -45,
    top: 0,
    bottom: 0,
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
  },
  yAxisLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    alignItems: "center",
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
