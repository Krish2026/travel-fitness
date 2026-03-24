import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { updateTrainerSettings } from "@/lib/firebase";
import { Button } from "@/components/Button";

export default function TrainerSettingsScreen() {
  const { user } = useAuthStore();
  const [isChatEnabled, setIsChatEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>("red");
  const [isSaving, setIsSaving] = useState(false);

  const themeOptions = [
    { name: "Red", color: "#FF6B6B", id: "red" },
    { name: "Teal", color: "#4ECDC4", id: "teal" },
    { name: "Purple", color: "#9B59B6", id: "purple" },
    { name: "Blue", color: "#3498DB", id: "blue" },
    { name: "Orange", color: "#E67E22", id: "orange" },
  ];

  const handleSaveSettings = async () => {
    try {
      if (!user?.id) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      setIsSaving(true);
      await updateTrainerSettings(user.id, {
        isChatEnabled,
        themeColor: selectedTheme,
        notifications: {
          newMessages: true,
          courseEnrollments: true,
        },
      });
      Alert.alert("Success", "Settings saved!");
    } catch (error) {
      console.error("Error saving settings:", error);
      Alert.alert("Error", "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Trainer Settings</Text>
      </View>

      {/* Communication Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Communication</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Community Chat</Text>
              <Text style={styles.settingDescription}>
                Allow clients to send messages in your community channel
              </Text>
            </View>
            <Switch
              value={isChatEnabled}
              onValueChange={setIsChatEnabled}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + "40",
              }}
              thumbColor={isChatEnabled ? theme.colors.primary : "#ccc"}
            />
          </View>
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <View style={styles.settingCard}>
          <Text style={styles.settingLabel}>Theme Color</Text>
          <Text style={styles.settingDescription}>
            Choose your app's primary color
          </Text>
          <View style={styles.colorGrid}>
            {themeOptions.map((themeOption) => (
              <Pressable
                key={themeOption.id}
                style={[
                  styles.colorOption,
                  {
                    backgroundColor: themeOption.color,
                    borderWidth: selectedTheme === themeOption.id ? 3 : 2,
                    borderColor:
                      selectedTheme === themeOption.id ? "#333" : "#ddd",
                  },
                ]}
                onPress={() => setSelectedTheme(themeOption.id)}
              >
                {selectedTheme === themeOption.id && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </Pressable>
            ))}
          </View>
          <View style={styles.colorNames}>
            {themeOptions.map((themeOption) => (
              <Text
                key={themeOption.id}
                style={[
                  styles.colorName,
                  selectedTheme === themeOption.id && styles.colorNameActive,
                ]}
              >
                {themeOption.name}
              </Text>
            ))}
          </View>
        </View>
      </View>

      {/* Course Management Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Course Management</Text>
        <View style={styles.settingCard}>
          <View style={styles.courseAction}>
            <View>
              <Text style={styles.settingLabel}>Create New Course</Text>
              <Text style={styles.settingDescription}>
                Build and publish a new training course
              </Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </View>
        <View style={styles.settingCard}>
          <View style={styles.courseAction}>
            <View>
              <Text style={styles.settingLabel}>Manage Courses</Text>
              <Text style={styles.settingDescription}>
                Edit, update, or delete existing courses
              </Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>New Messages</Text>
              <Text style={styles.settingDescription}>
                Get notified when clients send messages
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + "40",
              }}
              thumbColor={theme.colors.primary}
            />
          </View>
        </View>
        <View style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Course Enrollments</Text>
              <Text style={styles.settingDescription}>
                Get notified when clients enroll in your courses
              </Text>
            </View>
            <Switch
              value={true}
              onValueChange={() => {}}
              trackColor={{
                false: theme.colors.border,
                true: theme.colors.primary + "40",
              }}
              thumbColor={theme.colors.primary}
            />
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.settingCard}>
          <View style={styles.courseAction}>
            <View>
              <Text style={styles.settingLabel}>Edit Profile</Text>
              <Text style={styles.settingDescription}>
                Update your trainer information
              </Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </View>
        <View style={styles.settingCard}>
          <View style={styles.courseAction}>
            <View>
              <Text style={styles.settingLabel}>Change Password</Text>
              <Text style={styles.settingDescription}>
                Update your account password
              </Text>
            </View>
            <Text style={styles.arrowIcon}>→</Text>
          </View>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.actionButtons}>
        <Button
          title={isSaving ? "Saving..." : "Save Settings"}
          onPress={handleSaveSettings}
          disabled={isSaving}
        />
      </View>

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  header: {
    paddingVertical: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  section: {
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    letterSpacing: 0.5,
  },
  settingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  settingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  settingDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  colorGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: theme.spacing.lg,
  },
  colorOption: {
    width: "18%",
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  colorNames: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorName: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textAlign: "center",
    flex: 1,
  },
  colorNameActive: {
    color: theme.colors.text,
    fontWeight: "600",
  },
  courseAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  arrowIcon: {
    fontSize: 18,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginVertical: theme.spacing.lg,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
