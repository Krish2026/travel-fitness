import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { theme } from "@/theme";

export interface LoadingIndicatorProps {
  size?: "small" | "large";
  color?: string;
  message?: string;
  transparent?: boolean;
}

export function LoadingIndicator({
  size = "large",
  color = theme.colors.primary,
  message,
  transparent = false,
}: LoadingIndicatorProps) {
  return (
    <View style={[styles.container, transparent && styles.transparent]}>
      <ActivityIndicator size={size} color={color} />
      {message && (
        <Text
          style={[
            styles.message,
            { color: transparent ? color : theme.colors.textSecondary },
          ]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

/**
 * Full screen loading overlay
 */
export function FullScreenLoader({
  message = "Loading...",
}: {
  message?: string;
}) {
  return (
    <View style={styles.fullScreen}>
      <View style={styles.loaderContent}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.fullScreenMessage}>{message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  transparent: {
    backgroundColor: "transparent",
  },
  message: {
    fontSize: 14,
    fontWeight: "500",
  },
  fullScreen: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    alignItems: "center",
    gap: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  fullScreenMessage: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "500",
  },
});
