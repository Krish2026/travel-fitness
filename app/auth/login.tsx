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
import { router } from "expo-router";
import { theme } from "@/theme";
import { validateEmail, validatePassword } from "@/lib/validators";
import { login } from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const setUser = useAuthStore((state) => state.setUser);
  const { initializeAuth } = useAuthStore();

  const handleLogin = async () => {
    // Validate inputs
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    const newErrors: Record<string, string> = {};
    if (!emailValidation.valid)
      newErrors.email = emailValidation.error || "Invalid email";
    if (!passwordValidation.valid)
      newErrors.password = passwordValidation.error || "Invalid password";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // Re-initialize auth to fetch user profile
      await initializeAuth();
      // Navigate to appropriate home screen (handled by root layout)
      router.replace("/(tabs)/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      Alert.alert("Login Error", errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Log in to your Travel Fitness account
        </Text>
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
              placeholder="Enter your password"
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

        {/* General Error */}
        {errors.general && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errors.general}</Text>
          </View>
        )}

        {/* Forgot Password */}
        <Pressable>
          <Text style={styles.forgotPassword}>Forgot password?</Text>
        </Pressable>

        {/* Login Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!email || !password || isLoading) && styles.buttonDisabled,
            pressed && !isLoading && styles.pressed,
          ]}
          onPress={handleLogin}
          disabled={!email || !password || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Log In</Text>
          )}
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable onPress={() => router.push("/auth/role-select")}>
          <Text style={styles.signupLink}>Sign up</Text>
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
  header: {
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  title: {
    fontSize: 28,
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
  forgotPassword: {
    fontSize: 14,
    fontWeight: "500",
    color: theme.colors.primary,
    textAlign: "right",
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
  signupLink: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});
