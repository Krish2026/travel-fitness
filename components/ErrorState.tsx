import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { theme } from "@/theme";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isLoading?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  isLoading = false,
}: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.errorIcon}>
        <Text style={styles.iconText}>⚠️</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.pressed,
            isLoading && styles.retryDisabled,
          ]}
          onPress={onRetry}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text style={styles.retryText}>Try Again</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.error + "20",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  iconText: {
    fontSize: 28,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    maxWidth: 300,
  },
  retryButton: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.spacing.md,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  retryText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  retryDisabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
});
