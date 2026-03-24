import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import { theme } from "@/theme";

export default function RoleSelectScreen() {
  const handleSelectRole = (role: "client" | "trainer") => {
    if (role === "client") {
      router.push("/auth/signup?role=client");
    } else {
      router.push("/auth/trainer-password");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("@/assets/travel-fitness-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Travel Fitness</Text>
        <Text style={styles.subtitle}>Join your fitness journey today</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.roleCard}>
          <Text style={styles.roleTitle}>I'm a Client</Text>
          <Text style={styles.roleDescription}>
            Browse trainers, enroll in courses, and track your fitness progress
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.clientButton,
              pressed && styles.pressed,
            ]}
            onPress={() => handleSelectRole("client")}
          >
            <Text style={styles.buttonText}>Get Started as Client</Text>
          </Pressable>
        </View>

        <View style={styles.divider}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.roleCard}>
          <Text style={styles.roleTitle}>I'm a Trainer</Text>
          <Text style={styles.roleDescription}>
            Create courses, connect with clients, and build your fitness
            community
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.trainerButton,
              pressed && styles.pressed,
            ]}
            onPress={() => handleSelectRole("trainer")}
          >
            <Text style={styles.buttonText}>Access Trainer Portal</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <Pressable onPress={() => router.push("/auth/login")}>
          <Text style={styles.loginLink}>Log in here</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  roleCard: {
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  roleDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  button: {
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  clientButton: {
    backgroundColor: theme.colors.primary,
  },
  trainerButton: {
    backgroundColor: theme.colors.secondary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  pressed: {
    opacity: 0.8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: theme.spacing.lg,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.border,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.xs,
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
