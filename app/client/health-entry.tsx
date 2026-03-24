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

export default function HealthEntryScreen() {
  const { user } = useAuthStore();
  const [entryType, setEntryType] = useState<"weight" | "measurement">(
    "weight",
  );
  const [weight, setWeight] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [measurement, setMeasurement] = useState("");
  const [measurementType, setMeasurementType] = useState<
    "chest" | "waist" | "hips" | "arms" | "thighs"
  >("chest");
  const [measurementUnit, setMeasurementUnit] = useState<"cm" | "in">("cm");
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [entries, setEntries] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Load previous entries from Firebase
    setIsLoading(false);
  }, [user?.id]);

  const handleSubmit = async () => {
    try {
      if (entryType === "weight" && !weight.trim()) {
        Alert.alert("Error", "Please enter a weight value");
        return;
      }
      if (entryType === "measurement" && !measurement.trim()) {
        Alert.alert("Error", "Please enter a measurement value");
        return;
      }

      setIsSaving(true);

      // TODO: Save to Firebase
      // const entry = {
      //   userId: user?.id,
      //   type: entryType,
      //   weight: entryType === 'weight' ? { value: weight, unit: weightUnit } : undefined,
      //   measurement: entryType === 'measurement' ? {
      //     type: measurementType,
      //     value: measurement,
      //     unit: measurementUnit
      //   } : undefined,
      //   notes: notes.trim(),
      //   date: new Date(),
      // };
      // await createHealthEntry(entry);

      Alert.alert("Success", "Health entry saved!");
      // Reset form
      setWeight("");
      setMeasurement("");
      setNotes("");
      // Reload entries
    } catch (error) {
      console.error("Error saving entry:", error);
      Alert.alert("Error", "Failed to save health entry");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
          <Text style={styles.title}>Log Health Entry</Text>
          <Text style={styles.subtitle}>
            Track your fitness progress and measurements
          </Text>
        </View>

        {/* Entry Type Tabs */}
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, entryType === "weight" && styles.tabActive]}
            onPress={() => setEntryType("weight")}
          >
            <Text
              style={[
                styles.tabText,
                entryType === "weight" && styles.tabTextActive,
              ]}
            >
              ⚖️ Weight
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.tab,
              entryType === "measurement" && styles.tabActive,
            ]}
            onPress={() => setEntryType("measurement")}
          >
            <Text
              style={[
                styles.tabText,
                entryType === "measurement" && styles.tabTextActive,
              ]}
            >
              📏 Measurement
            </Text>
          </Pressable>
        </View>

        {/* Weight Entry Form */}
        {entryType === "weight" && (
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Weight</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter weight"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
                <View style={styles.unitSelector}>
                  {["kg", "lbs"].map((unit) => (
                    <Pressable
                      key={unit}
                      style={[
                        styles.unitButton,
                        weightUnit === unit && styles.unitButtonActive,
                      ]}
                      onPress={() => setWeightUnit(unit as "kg" | "lbs")}
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          weightUnit === unit && styles.unitButtonTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Measurement Entry Form */}
        {entryType === "measurement" && (
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Measurement Type</Text>
              <View style={styles.measurementTypes}>
                {[
                  { id: "chest", label: "Chest" },
                  { id: "waist", label: "Waist" },
                  { id: "hips", label: "Hips" },
                  { id: "arms", label: "Arms" },
                  { id: "thighs", label: "Thighs" },
                ].map((item) => (
                  <Pressable
                    key={item.id}
                    style={[
                      styles.measurementType,
                      measurementType === item.id &&
                        styles.measurementTypeActive,
                    ]}
                    onPress={() =>
                      setMeasurementType(
                        item.id as
                          | "chest"
                          | "waist"
                          | "hips"
                          | "arms"
                          | "thighs",
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.measurementTypeText,
                        measurementType === item.id &&
                          styles.measurementTypeTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Value</Text>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter measurement"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="decimal-pad"
                  value={measurement}
                  onChangeText={setMeasurement}
                />
                <View style={styles.unitSelector}>
                  {["cm", "in"].map((unit) => (
                    <Pressable
                      key={unit}
                      style={[
                        styles.unitButton,
                        measurementUnit === unit && styles.unitButtonActive,
                      ]}
                      onPress={() => setMeasurementUnit(unit as "cm" | "in")}
                    >
                      <Text
                        style={[
                          styles.unitButtonText,
                          measurementUnit === unit &&
                            styles.unitButtonTextActive,
                        ]}
                      >
                        {unit}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Notes */}
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Add any notes about your entry..."
              placeholderTextColor={theme.colors.textSecondary}
              multiline
              value={notes}
              onChangeText={setNotes}
              maxLength={200}
            />
            <Text style={styles.charCount}>{notes.length}/200</Text>
          </View>
        </View>

        {/* Previous Entries */}
        {entries.length > 0 && (
          <View style={styles.previousEntries}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {entries.map((entry, index) => (
              <View key={index} style={styles.entryCard}>
                <View style={styles.entryHeader}>
                  <Text style={styles.entryDate}>
                    {new Date(entry.date).toLocaleDateString()}
                  </Text>
                  <Text style={styles.entryValue}>
                    {entry.type === "weight"
                      ? `${entry.weight.value} ${entry.weight.unit}`
                      : `${entry.measurement.value} ${entry.measurement.unit}`}
                  </Text>
                </View>
                {entry.notes && (
                  <Text style={styles.entryNotes}>{entry.notes}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Submit Button */}
        <Button
          title={isSaving ? "Saving..." : "Save Entry"}
          onPress={handleSubmit}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  header: {
    marginVertical: theme.spacing.lg,
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
  tabBar: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  tabTextActive: {
    color: "white",
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  formGroup: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  inputGroup: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
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
  measurementTypes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  measurementType: {
    flex: 1,
    minWidth: "48%",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  measurementTypeActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  measurementTypeText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  measurementTypeTextActive: {
    color: "white",
  },
  notesInput: {
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
  previousEntries: {
    marginVertical: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  entryCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  entryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  entryDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  entryValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  entryNotes: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
