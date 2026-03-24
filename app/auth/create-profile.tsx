import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  useColorScheme,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { theme } from "@/theme";
import {
  validateClientProfileForm,
  validateTrainerProfileForm,
} from "@/lib/validators";
import {
  createClientProfile,
  createTrainerProfile,
  auth,
} from "@/lib/firebase";
import { useAuthStore } from "@/store/authStore";

const SPECIALTIES = [
  "Strength Training",
  "Cardio",
  "Yoga",
  "Pilates",
  "HIIT",
  "CrossFit",
  "Boxing",
  "Dance",
];
const THEME_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#6C5CE7",
  "#A29BFE",
  "#FD79A8",
];

export default function CreateProfileScreen() {
  const { role } = useLocalSearchParams<{ role: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { initializeAuth } = useAuthStore();

  // Shared fields
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  // Client fields
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [bodyFatPercentage, setBodyFatPercentage] = useState("");
  const [musclePercentage, setMusclePercentage] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [goalDescription, setGoalDescription] = useState("");
  const [trainerId] = useState("trainer_default"); // Will be set to the single trainer ID

  // Trainer fields
  const [bio, setBio] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState("#FF6B6B");

  const isClientMode = role === "client";

  const handleSpecialtyToggle = (specialty: string) => {
    setSelectedSpecialties((prev) =>
      prev.includes(specialty)
        ? prev.filter((s) => s !== specialty)
        : [...prev, specialty],
    );
  };

  const handleCreateProfile = async () => {
    if (isClientMode) {
      handleCreateClientProfile();
    } else {
      handleCreateTrainerProfile();
    }
  };

  const handleCreateClientProfile = async () => {
    const validation = validateClientProfileForm({
      name,
      weight,
      height,
      age,
      gender,
      bodyFatPercentage,
      musclePercentage,
      goalWeight,
      goalDescription,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const userId = auth.currentUser?.uid;
      const email = auth.currentUser?.email;

      if (!userId || !email) {
        throw new Error("User not authenticated");
      }

      await createClientProfile(userId, email, {
        name,
        weight: parseFloat(weight),
        height: parseFloat(height),
        age: parseInt(age),
        gender,
        bodyFatPercentage: parseFloat(bodyFatPercentage),
        musclePercentage: parseFloat(musclePercentage),
        goalWeight: parseFloat(goalWeight),
        goalDescription,
        trainerId,
        profilePicture,
      });

      // Initialize auth to load profile
      await initializeAuth();
      router.replace("/(tabs)/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create profile";
      Alert.alert("Error", errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTrainerProfile = async () => {
    const validation = validateTrainerProfileForm({
      name,
      bio,
      specialties: selectedSpecialties,
      themeColor: selectedColor,
    });

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsLoading(true);

    try {
      const userId = auth.currentUser?.uid;
      const email = auth.currentUser?.email;

      if (!userId || !email) {
        throw new Error("User not authenticated");
      }

      await createTrainerProfile(userId, email, {
        name,
        bio,
        specialties: selectedSpecialties,
        themeColor: selectedColor,
        profilePicture,
      });

      // Initialize auth to load profile
      await initializeAuth();
      router.replace("/(tabs)/home");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create profile";
      Alert.alert("Error", errorMessage);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.subtitle}>
          as a {isClientMode ? "Client" : "Trainer"}
        </Text>
      </View>

      <View style={styles.form}>
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              placeholderTextColor={theme.colors.textSecondary}
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) {
                  const newErrors = { ...errors };
                  delete newErrors.name;
                  setErrors(newErrors);
                }
              }}
              editable={!isLoading}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        {/* Client-Specific Fields */}
        {isClientMode && (
          <>
            {/* Weight */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Current Weight (kg)</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.weight && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 75"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={(text) => {
                    setWeight(text);
                    if (errors.weight) {
                      const newErrors = { ...errors };
                      delete newErrors.weight;
                      setErrors(newErrors);
                    }
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.weight && (
                <Text style={styles.errorText}>{errors.weight}</Text>
              )}
            </View>

            {/* Height */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Height (cm)</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.height && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 180"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={height}
                  onChangeText={(text) => {
                    setHeight(text);
                    if (errors.height) {
                      const newErrors = { ...errors };
                      delete newErrors.height;
                      setErrors(newErrors);
                    }
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.height && (
                <Text style={styles.errorText}>{errors.height}</Text>
              )}
            </View>

            {/* Age */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Age</Text>
              <View
                style={[styles.inputWrapper, errors.age && styles.inputError]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 25"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="number-pad"
                  value={age}
                  onChangeText={(text) => {
                    setAge(text);
                    if (errors.age) {
                      const newErrors = { ...errors };
                      delete newErrors.age;
                      setErrors(newErrors);
                    }
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.age && <Text style={styles.errorText}>{errors.age}</Text>}
            </View>

            {/* Gender */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.genderContainer}>
                {(["male", "female", "other"] as const).map((g) => (
                  <Pressable
                    key={g}
                    style={[
                      styles.genderButton,
                      gender === g && styles.genderButtonActive,
                    ]}
                    onPress={() => setGender(g)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.genderButtonText,
                        gender === g && styles.genderButtonTextActive,
                      ]}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Body Fat % */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Body Fat %</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.bodyFatPercentage && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 20"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={bodyFatPercentage}
                  onChangeText={(text) => {
                    setBodyFatPercentage(text);
                    if (errors.bodyFatPercentage) {
                      const newErrors = { ...errors };
                      delete newErrors.bodyFatPercentage;
                      setErrors(newErrors);
                    }
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.bodyFatPercentage && (
                <Text style={styles.errorText}>{errors.bodyFatPercentage}</Text>
              )}
            </View>

            {/* Muscle % */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Muscle %</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.musclePercentage && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 40"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={musclePercentage}
                  onChangeText={(text) => {
                    setMusclePercentage(text);
                    if (errors.musclePercentage) {
                      const newErrors = { ...errors };
                      delete newErrors.musclePercentage;
                      setErrors(newErrors);
                    }
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.musclePercentage && (
                <Text style={styles.errorText}>{errors.musclePercentage}</Text>
              )}
            </View>

            {/* Goal Weight */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Goal Weight (kg)</Text>
              <View
                style={[
                  styles.inputWrapper,
                  errors.goalWeight && styles.inputError,
                ]}
              >
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 70"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={goalWeight}
                  onChangeText={(text) => {
                    setGoalWeight(text);
                    if (errors.goalWeight) {
                      const newErrors = { ...errors };
                      delete newErrors.goalWeight;
                      setErrors(newErrors);
                    }
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.goalWeight && (
                <Text style={styles.errorText}>{errors.goalWeight}</Text>
              )}
            </View>

            {/* Goal Description */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Goal Description</Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.textAreaWrapper,
                  errors.goalDescription && styles.inputError,
                ]}
              >
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your fitness goals..."
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  value={goalDescription}
                  onChangeText={(text) => {
                    setGoalDescription(text);
                    if (errors.goalDescription) {
                      const newErrors = { ...errors };
                      delete newErrors.goalDescription;
                      setErrors(newErrors);
                    }
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.goalDescription && (
                <Text style={styles.errorText}>{errors.goalDescription}</Text>
              )}
            </View>
          </>
        )}

        {/* Trainer-Specific Fields */}
        {!isClientMode && (
          <>
            {/* Bio */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.textAreaWrapper,
                  errors.bio && styles.inputError,
                ]}
              >
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Tell clients about yourself..."
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  value={bio}
                  onChangeText={(text) => {
                    setBio(text);
                    if (errors.bio) {
                      const newErrors = { ...errors };
                      delete newErrors.bio;
                      setErrors(newErrors);
                    }
                  }}
                  editable={!isLoading}
                />
              </View>
              {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
            </View>

            {/* Specialties */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Specialties (Select at least 1)</Text>
              <View style={styles.specialtiesGrid}>
                {SPECIALTIES.map((specialty) => (
                  <Pressable
                    key={specialty}
                    style={[
                      styles.specialtyTag,
                      selectedSpecialties.includes(specialty) &&
                        styles.specialtyTagActive,
                    ]}
                    onPress={() => handleSpecialtyToggle(specialty)}
                    disabled={isLoading}
                  >
                    <Text
                      style={[
                        styles.specialtyText,
                        selectedSpecialties.includes(specialty) &&
                          styles.specialtyTextActive,
                      ]}
                    >
                      {specialty}
                    </Text>
                  </Pressable>
                ))}
              </View>
              {errors.specialties && (
                <Text style={styles.errorText}>{errors.specialties}</Text>
              )}
            </View>

            {/* Theme Color */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Theme Color</Text>
              <View style={styles.colorGrid}>
                {THEME_COLORS.map((color) => (
                  <Pressable
                    key={color}
                    style={[
                      styles.colorCircle,
                      { backgroundColor: color },
                      selectedColor === color && styles.colorCircleActive,
                    ]}
                    onPress={() => setSelectedColor(color)}
                    disabled={isLoading}
                  >
                    {selectedColor === color && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </>
        )}

        {/* General Error */}
        {errors.general && (
          <View style={styles.errorBox}>
            <Text style={styles.errorBoxText}>{errors.general}</Text>
          </View>
        )}

        {/* Create Profile Button */}
        <Pressable
          style={({ pressed }) => [
            styles.button,
            (!name || isLoading) && styles.buttonDisabled,
            pressed && !isLoading && styles.pressed,
          ]}
          onPress={handleCreateProfile}
          disabled={!name || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Create Profile</Text>
          )}
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
  textAreaWrapper: {
    alignItems: "flex-start",
    paddingVertical: theme.spacing.sm,
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
  textArea: {
    textAlignVertical: "top",
    paddingVertical: theme.spacing.md,
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
  genderContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  genderButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  genderButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  genderButtonTextActive: {
    color: "white",
  },
  specialtiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  specialtyTag: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  specialtyTagActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  specialtyText: {
    fontSize: 12,
    fontWeight: "500",
    color: theme.colors.text,
  },
  specialtyTextActive: {
    color: "white",
  },
  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.md,
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  colorCircleActive: {
    borderColor: theme.colors.text,
  },
  checkmark: {
    fontSize: 24,
    color: "white",
    fontWeight: "700",
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
});
