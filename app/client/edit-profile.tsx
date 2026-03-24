import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/Button";

export default function EditProfileScreen() {
  const { user } = useAuthStore();
  const isTrainer = user?.role === "trainer";

  // User fields
  const [name, setName] = useState(user?.name || "");

  // Trainer fields
  const [bio, setBio] = useState(isTrainer ? user?.bio || "" : "");
  const [specialties, setSpecialties] = useState(
    isTrainer ? user?.specialties || [] : [],
  );
  const [specialty, setSpecialty] = useState("");

  // Client fields
  const [height, setHeight] = useState(!isTrainer ? user?.height || "" : "");
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [age, setAge] = useState(!isTrainer ? user?.age?.toString() || "" : "");
  const [fitnessLevel, setFitnessLevel] = useState("beginner");
  const [goals, setGoals] = useState<string[]>([]);

  const [isSaving, setIsSaving] = useState(false);

  const handleAddSpecialty = () => {
    if (specialty.trim()) {
      setSpecialties([...specialties, specialty.trim()]);
      setSpecialty("");
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  const handleSaveProfile = async () => {
    try {
      if (!name.trim()) {
        Alert.alert("Error", "Name is required");
        return;
      }

      setIsSaving(true);

      // TODO: Update profile in Firebase
      // const profileData = isTrainer ? {
      //   name: name.trim(),
      //   bio: bio.trim(),
      //   specialties,
      // } : {
      //   name: name.trim(),
      //   height: parseInt(height),
      //   heightUnit,
      //   age: parseInt(age),
      //   fitnessLevel,
      //   goals,
      // };
      // await updateUserProfile(user?.id, profileData);

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Edit Profile</Text>
        </View>

        {/* Basic Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          {/* Name */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Email (Read-only) */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={[styles.input, styles.readOnlyInput]}>
              <Text style={styles.readOnlyText}>{user?.email}</Text>
            </View>
          </View>
        </View>

        {/* Trainer-Specific Fields */}
        {isTrainer && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Professional Info</Text>

              {/* Bio */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Bio</Text>
                <TextInput
                  style={styles.bioInput}
                  placeholder="Tell clients about yourself..."
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  maxLength={500}
                  value={bio}
                  onChangeText={setBio}
                />
                <Text style={styles.charCount}>{bio.length}/500</Text>
              </View>

              {/* Specialties */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Specialties</Text>
                <View style={styles.specialtyInput}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Add a specialty"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={specialty}
                    onChangeText={setSpecialty}
                  />
                  <Pressable
                    style={styles.addButton}
                    onPress={handleAddSpecialty}
                  >
                    <Text style={styles.addButtonText}>+</Text>
                  </Pressable>
                </View>

                {/* Specialties List */}
                {specialties.length > 0 && (
                  <View style={styles.specialtyList}>
                    {specialties.map((item, index) => (
                      <View key={index} style={styles.specialtyTag}>
                        <Text style={styles.specialtyTagText}>{item}</Text>
                        <Pressable onPress={() => handleRemoveSpecialty(index)}>
                          <Text style={styles.removeButton}>✕</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {/* Client-Specific Fields */}
        {!isTrainer && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Physical Information</Text>

              {/* Age */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="number-pad"
                  maxLength={3}
                  value={age}
                  onChangeText={setAge}
                />
              </View>

              {/* Height */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Height</Text>
                <View style={styles.inputGroup}>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter height"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="decimal-pad"
                    value={String(height)}
                    onChangeText={setHeight}
                  />
                  <View style={styles.unitSelector}>
                    {["cm", "ft"].map((unit) => (
                      <Pressable
                        key={unit}
                        style={[
                          styles.unitButton,
                          heightUnit === unit && styles.unitButtonActive,
                        ]}
                        onPress={() => setHeightUnit(unit as "cm" | "ft")}
                      >
                        <Text
                          style={[
                            styles.unitButtonText,
                            heightUnit === unit && styles.unitButtonTextActive,
                          ]}
                        >
                          {unit}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>

              {/* Fitness Level */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Fitness Level</Text>
                <View style={styles.levelButtons}>
                  {["beginner", "intermediate", "advanced"].map((level) => (
                    <Pressable
                      key={level}
                      style={[
                        styles.levelButton,
                        fitnessLevel === level && styles.levelButtonActive,
                      ]}
                      onPress={() => setFitnessLevel(level)}
                    >
                      <Text
                        style={[
                          styles.levelButtonText,
                          fitnessLevel === level &&
                            styles.levelButtonTextActive,
                        ]}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </>
        )}

        {/* Save Button */}
        <Button
          title={isSaving ? "Saving..." : "Save Changes"}
          onPress={handleSaveProfile}
          disabled={isSaving}
        />

        <View style={styles.spacer} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
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
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
  },
  readOnlyInput: {
    backgroundColor: theme.colors.background,
  },
  readOnlyText: {
    color: theme.colors.textSecondary,
  },
  bioInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 100,
    textAlignVertical: "top",
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "right",
    marginTop: theme.spacing.xs,
  },
  specialtyInput: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  specialtyList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  specialtyTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.spacing.sm,
  },
  specialtyTagText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  removeButton: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: "700",
  },
  inputGroup: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  unitSelector: {
    flexDirection: "row",
    borderRadius: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  unitButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    flex: 1,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  unitButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  unitButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
  unitButtonTextActive: {
    color: "white",
  },
  levelButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  levelButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  levelButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  levelButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  levelButtonTextActive: {
    color: "white",
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
