import { View, StyleSheet } from "react-native";
import { theme } from "@/theme";

export interface SkeletonProps {
  height?: number;
  width?: string | number;
  borderRadius?: number;
  style?: any;
  animated?: boolean;
}

/**
 * Skeleton/placeholder component for loading states
 * Shows a shimmering placeholder while content loads
 */
export function Skeleton({
  height = 12,
  width = "100%",
  borderRadius = 4,
  style,
  animated = true,
}: SkeletonProps) {
  return (
    <View
      style={[
        styles.skeleton,
        {
          height,
          width,
          borderRadius,
          opacity: animated ? 0.6 : 1,
        },
        style,
      ]}
    />
  );
}

/**
 * Skeleton card component - simulates a card layout
 */
export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton height={16} width="60%" borderRadius={4} style={styles.mb} />
      <Skeleton height={12} width="90%" borderRadius={4} style={styles.mb} />
      <Skeleton height={12} width="80%" borderRadius={4} style={styles.mb} />
      <Skeleton height={40} width="100%" borderRadius={4} style={styles.mt} />
    </View>
  );
}

/**
 * Skeleton list - multiple skeleton cards
 */
export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.border,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  mb: {
    marginBottom: theme.spacing.sm,
  },
  mt: {
    marginTop: theme.spacing.md,
  },
});
