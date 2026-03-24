// Reusable Button Component
import {
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "@/theme";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "outline" && styles.outline,
        disabled && styles.disabled,
        pressed && styles.pressed,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          variant === "primary" && styles.primaryText,
          variant === "secondary" && styles.secondaryText,
          variant === "outline" && styles.outlineText,
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: "transparent",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "white",
  },
  secondaryText: {
    color: "white",
  },
  outlineText: {
    color: theme.colors.primary,
  },
});
