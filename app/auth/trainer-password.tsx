import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { theme } from "@/theme";
import { validateTrainerPassword } from "@/lib/validators";

export default function TrainerPasswordScreen() {
  const [password, setPassword] = useState("test123");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleNext = async () => {
    setError("");

    const validation = validateTrainerPassword(password);
    if (!validation.valid) {
      setError(validation.error || "Invalid password");
      Alert.alert(
        "Invalid Password",
        validation.error || "The password you entered is incorrect",
      );
      return;
    }

    setIsLoading(true);
    // Simulate delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/auth/signup?role=trainer");
    }, 500);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Trainer Access</Text>
          <Text style={styles.subtitle}>
            Enter the trainer password to continue
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Trainer Password</Text>
            <View style={[styles.inputWrapper, error && styles.inputError]}>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor={theme.colors.textSecondary}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setError("");
                }}
                editable={!isLoading}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
              </Pressable>
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              !password && styles.buttonDisabled,
              pressed && !isLoading && styles.pressed,
            ]}
            onPress={handleNext}
            disabled={!password || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Continue</Text>
            )}
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have trainer access?{" "}
          <Text style={styles.footerLink} onPress={() => router.back()}>
            Go back
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  backButton: {
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  header: {
    marginBottom: theme.spacing.xl,
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
  form: {
    gap: theme.spacing.lg,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  input: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
  },
  eyeButton: {
    padding: theme.spacing.xs,
  },
  eyeIcon: {
    fontSize: 18,
  },
  errorText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.error,
    marginTop: theme.spacing.xs,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  pressed: {
    opacity: 0.8,
  },
  footer: {
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  footerLink: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
});
