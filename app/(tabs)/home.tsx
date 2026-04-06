import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { theme } from "@/theme";
import { ClientProfile, TrainerProfile } from "@/lib/types";
import { router } from "expo-router";
import { LevelBadge } from "@/components/LevelBadge";
import { LevelUpNotification } from "@/components/LevelUpNotification";
import { getLevelUpEvents } from "@/lib/firebase";

export default function HomeScreen() {
  const { user, isLoading } = useAuthStore();

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const isClient = user.role === "client";

  if (isClient) {
    return <ClientHomeScreen user={user as ClientProfile} />;
  } else {
    return <TrainerHomeScreen user={user as TrainerProfile} />;
  }
}

function ClientHomeScreen({ user }: { user: ClientProfile }) {
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(user.userLevel || 1);
  const [lastLevelUpTime, setLastLevelUpTime] = useState<number | null>(null);

  // Check for recent level-up events
  useEffect(() => {
    const checkLevelUp = async () => {
      try {
        const events = await getLevelUpEvents(user.id);
        if (events.length > 0) {
          const latestEvent = events[0];
          const now = Date.now();
          const timeSinceLastEvent = now - latestEvent.timestamp;

          // Show notification if level-up happened within last 2 seconds
          if (timeSinceLastEvent < 2000 && !lastLevelUpTime) {
            setNewLevel(latestEvent.newLevel);
            setShowLevelUp(true);
            setLastLevelUpTime(latestEvent.timestamp);
          }
        }
      } catch (error) {
        console.error("Error checking level-up events:", error);
      }
    };

    checkLevelUp();
  }, [user.id]);

  return (
    <View style={styles.screenContainer}>
      <LevelUpNotification
        visible={showLevelUp}
        newLevel={newLevel}
        onDismiss={() => setShowLevelUp(false)}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
            <Text style={styles.subtitle}>
              to your fitness journey through Travel Fitness
            </Text>
          </View>
          <LevelBadge level={user.userLevel || 1} size="medium" />
        </View>

        {/* Health Stats Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Current Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Weight</Text>
              <Text style={styles.statValue}>{user.weight} lbs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Height</Text>
              <Text style={styles.statValue}>{user.height} in</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Goal Weight</Text>
              <Text style={styles.statValue}>{user.goalWeight} lbs</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Body Fat %</Text>
              <Text style={styles.statValue}>{user.bodyFatPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Goal Description */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Goal</Text>
          <Text style={styles.goalText}>{user.goalDescription}</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/(tabs)/trainers")}
          >
            <Text style={styles.actionButtonText}>View Trainer</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.secondaryButton,
              pressed && styles.pressed,
            ]}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

function TrainerHomeScreen({ user }: { user: TrainerProfile }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome, {user.name}!</Text>
        <Text style={styles.subtitle}>Manage your courses and clients</Text>
      </View>

      {/* Trainer Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Profile</Text>
        <Text style={styles.bioText}>{user.bio}</Text>
        <View style={styles.specialtiesContainer}>
          {user.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push("/trainer/create-course")}
        >
          <Text style={styles.actionButtonText}>Create Course</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.secondaryButton,
            pressed && styles.pressed,
          ]}
          onPress={() => router.push("/trainer/create-post")}
        >
          <Text style={styles.actionButtonText}>Create Post</Text>
        </Pressable>
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
    marginBottom: theme.spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: theme.spacing.lg,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: "45%",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  goalText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  bioText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: theme.spacing.md,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  specialtyBadge: {
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  actionsContainer: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    backgroundColor: theme.colors.secondary,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  pressed: {
    opacity: 0.8,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
