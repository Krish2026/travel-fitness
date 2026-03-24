import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAuthStore } from "@/store/authStore";
import { theme } from "@/theme";
import { ClientProfile, TrainerProfile } from "@/lib/types";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, isLoading, logout } = useAuthStore();

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const isClient = user.role === "client";

  if (isClient) {
    return <ClientProfileScreen user={user as ClientProfile} />;
  } else {
    return <TrainerProfileScreen user={user as TrainerProfile} />;
  }
}

function ClientProfileScreen({ user }: { user: ClientProfile }) {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/auth/role-select");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileAvatarContainer}>
          <Text style={styles.profileAvatar}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Health Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Current Weight</Text>
            <Text style={styles.infoValue}>{user.weight} kg</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Height</Text>
            <Text style={styles.infoValue}>{user.height} cm</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            <Text style={styles.infoValue}>{user.age}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>
              {user.gender.charAt(0).toUpperCase() + user.gender.slice(1)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Body Fat %</Text>
            <Text style={styles.infoValue}>{user.bodyFatPercentage}%</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Muscle %</Text>
            <Text style={styles.infoValue}>{user.musclePercentage}%</Text>
          </View>
        </View>
      </View>

      {/* Goal Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Goal Weight</Text>
            <Text style={styles.infoValue}>{user.goalWeight} kg</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.goalDescriptionRow}>
            <Text style={styles.infoLabel}>Goal Description</Text>
            <Text style={styles.goalDescriptionText}>
              {user.goalDescription}
            </Text>
          </View>
        </View>
      </View>

      {/* Edit Profile Button */}
      <Pressable
        style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
        onPress={() => router.push("/(tabs)/profile/edit")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </Pressable>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.pressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

function TrainerProfileScreen({ user }: { user: TrainerProfile }) {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/auth/role-select");
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileAvatarContainer}>
          <Text style={styles.profileAvatar}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {!user.isVerified && (
          <Text style={styles.unverifiedBadge}>Unverified</Text>
        )}
      </View>

      {/* Trainer Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Info</Text>
        <View style={styles.card}>
          <Text style={styles.bioLabel}>Bio</Text>
          <Text style={styles.bioText}>{user.bio}</Text>
        </View>
      </View>

      {/* Specialties */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Specialties</Text>
        <View style={styles.specialtiesContainer}>
          {user.specialties.map((specialty, index) => (
            <View key={index} style={styles.specialtyBadge}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Edit Profile Button */}
      <Pressable
        style={({ pressed }) => [styles.editButton, pressed && styles.pressed]}
        onPress={() => router.push("/(tabs)/profile/edit")}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </Pressable>

      {/* Logout Button */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.pressed,
        ]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </Pressable>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  profileAvatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  profileAvatar: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  unverifiedBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.warning,
    backgroundColor: theme.colors.warning + "20",
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.sm,
  },
  section: {
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
  },
  infoLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.divider,
  },
  goalDescriptionRow: {
    paddingVertical: theme.spacing.md,
  },
  goalDescriptionText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginTop: theme.spacing.sm,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  bioText: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
  },
  specialtiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
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
  editButton: {
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: "center",
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  logoutButton: {
    marginHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    alignItems: "center",
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  pressed: {
    opacity: 0.8,
  },
  spacer: {
    height: theme.spacing.lg,
  },
});
