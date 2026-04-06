import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/theme";

export interface ProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
  label?: string;
}

/**
 * Linear progress bar component
 * Displays progress with percentage
 */
export function ProgressBar({
  progress,
  color = theme.colors.primary,
  height = 8,
  animated = true,
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.track,
          {
            height,
            borderRadius: height / 2,
          },
        ]}
      >
        <View
          style={[
            styles.fill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: color,
              height,
              borderRadius: height / 2,
            },
          ]}
        />
      </View>
      {(showLabel || label) && (
        <Text style={styles.label}>
          {label || `${Math.round(clampedProgress)}%`}
        </Text>
      )}
    </View>
  );
}

/**
 * Circular progress indicator
 */
export function CircularProgress({
  progress,
  color = theme.colors.primary,
  size = 80,
  strokeWidth = 4,
}: {
  progress: number;
  color?: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View
      style={{
        width: size,
        height: size,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: theme.colors.border,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        {/* Progress arc (simplified visual) */}
        <View
          style={{
            width: size * (progress / 100),
            height: strokeWidth,
            backgroundColor: color,
            borderRadius: strokeWidth / 2,
            opacity: 0.8,
          }}
        />
      </View>
      <View
        style={{
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: size / 3,
            fontWeight: "700",
            color: theme.colors.text,
          }}
        >
          {Math.round(progress)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.sm,
  },
  track: {
    backgroundColor: theme.colors.border,
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    backgroundColor: theme.colors.primary,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
});
