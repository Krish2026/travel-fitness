import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { theme } from "@/theme";
import { validateSignupForm } from "@/lib/validators";

export default function SignupScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignup = async () => {
    // Validate email and password
    const validation = validateSignupForm(email, password);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    setIsLoading(true);

    try {
      // Don't create auth user here - only validate credentials
      // Auth user will be created after profile is successfully created

      // Navigate to profile creation with email & password in params
      router.push({
        pathname: "/auth/create-profile",
        params: {
          role: role || "client",
          email: email,
          password: password,
          isNewSignup: "true",
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Signup failed";
      Alert.alert("Signup Error", errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Pressable style={styles.backButton} onPress={handleBack}>
        <Text style={styles.backButtonText}>← Back</Text>
      </Pressable>

      <View style={styles.header}>
        <Text style={styles.title}>Create Your Account</Text>
        <Text style={styles.subtitle}>Sign up as a {role || "user"}</Text>
      </View>

      <View style={styles.form}>
        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <View
            style={[styles.inputWrapper, errors.email && styles.inputError]}
          >
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor={theme.colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) {
                  const newErrors = { ...errors };
                  delete newErrors.email;
                  setErrors(newErrors);
                }
              }}
              editable={!isLoading}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View
            style={[styles.inputWrapper, errors.password && styles.inputError]}
          >
            <TextInput
              style={styles.input}
              placeholder="At least 6 characters"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) {
                  const newErrors = { ...errors };
                  delete newErrors.password;
                  setErrors(newErrors);
                }
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
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password</Text>
          <View
            style={[
              styles.inputWrapper,
              errors.confirmPassword && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.input}
              placeholder="Re-enter your password"
              placeholderTextColor={theme.colors.textSecondary}
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword) {
                  const newErrors = { ...errors };
                  delete newErrors.confirmPassword;
                  setErrors(newErrors);
                }
              }}
              editable={!isLoading}
            />
          </View>
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* General Error */}
        {errors.general && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errors.general}</Text>
          </View>
        )}

        {/* Signup Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!email || !password || !confirmPassword || isLoading) &&
              styles.buttonDisabled,
            pressed && !isLoading && styles.pressed,
          ]}
          onPress={handleSignup}
          disabled={!email || !password || !confirmPassword || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Create Account</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.push("/auth/login")}>
          <Text style={styles.loginLink}>Log in</Text>
        </Pressable>
      </View>
    </ScrollView>
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
    marginBottom: theme.spacing.xl,
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
  errorBox: {
    backgroundColor: theme.colors.error + "15",
    borderRadius: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.error,
  },
  errorBoxText: {
    color: theme.colors.error,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    marginTop: theme.spacing.md,
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
