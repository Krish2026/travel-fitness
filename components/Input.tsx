import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";
import { theme } from "@/theme";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  multiline?: boolean;
}

export function Input({
  label,
  error,
  containerStyle,
  inputStyle,
  ...props
}: InputProps) {
  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={[
            styles.input,
            props.multiline && styles.multilineInput,
            inputStyle,
          ]}
          placeholderTextColor={theme.colors.textSecondary}
          {...props}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  input: {
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  multilineInput: {
    textAlignVertical: "top",
    paddingVertical: theme.spacing.md,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
});
