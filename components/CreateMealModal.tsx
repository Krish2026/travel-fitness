import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { useState } from "react";
import { theme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToFirebase, uploadVideoToFirebase } from "@/lib/firebase";

interface CreateMealModalProps {
  visible: boolean;
  onClose: () => void;
  onMealCreate: (meal: {
    name: string;
    recipe: string;
    image?: string;
    cookingVideoUrl?: string;
    macros?: {
      protein: number;
      carbs: number;
      fat: number;
      calories: number;
    };
    tags?: string[];
  }) => Promise<void>;
  isLoading?: boolean;
}

export function CreateMealModal({
  visible,
  onClose,
  onMealCreate,
  isLoading = false,
}: CreateMealModalProps) {
  const [mealName, setMealName] = useState("");
  const [recipe, setRecipe] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [calories, setCalories] = useState("");
  const [tags, setTags] = useState("");
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedVideo(result.assets[0].uri);
    }
  };

  const handleCreateMeal = async () => {
    if (!mealName.trim()) {
      Alert.alert("Missing Info", "Please enter a meal name");
      return;
    }

    if (!recipe.trim()) {
      Alert.alert("Missing Info", "Please enter a recipe");
      return;
    }

    setUploading(true);
    try {
      let imageUrl: string | undefined;
      let videoUrl: string | undefined;

      if (selectedImage) {
        imageUrl = await uploadImageToFirebase(
          selectedImage,
          `meal_${Date.now()}.jpg`,
          "meals",
        );
      }

      if (selectedVideo) {
        videoUrl = await uploadVideoToFirebase(
          selectedVideo,
          `meal_video_${Date.now()}.mp4`,
        );
      }

      const macros =
        protein || carbs || fat || calories
          ? {
              protein: parseInt(protein) || 0,
              carbs: parseInt(carbs) || 0,
              fat: parseInt(fat) || 0,
              calories: parseInt(calories) || 0,
            }
          : undefined;

      const tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      await onMealCreate({
        name: mealName.trim(),
        recipe: recipe.trim(),
        image: imageUrl,
        cookingVideoUrl: videoUrl,
        macros,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
      });

      // Reset form
      setMealName("");
      setRecipe("");
      setSelectedImage(null);
      setSelectedVideo(null);
      setProtein("");
      setCarbs("");
      setFat("");
      setCalories("");
      setTags("");
      onClose();
    } catch (error) {
      console.error("Error creating meal:", error);
      Alert.alert("Error", "Failed to create meal. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} disabled={uploading}>
            <MaterialIcons
              name="close"
              size={24}
              color={uploading ? theme.colors.textSecondary : theme.colors.text}
            />
          </Pressable>
          <Text style={styles.headerTitle}>New Meal</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Meal Name */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Meal Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Grilled Chicken with Rice"
              placeholderTextColor={theme.colors.textSecondary}
              value={mealName}
              onChangeText={setMealName}
              editable={!uploading}
            />
          </View>

          {/* Recipe */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Recipe *</Text>
            <TextInput
              style={[styles.input, styles.recipeInput]}
              placeholder="Enter the recipe instructions..."
              placeholderTextColor={theme.colors.textSecondary}
              value={recipe}
              onChangeText={setRecipe}
              multiline
              numberOfLines={5}
              editable={!uploading}
              textAlignVertical="top"
            />
          </View>

          {/* Meal Image */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Meal Image</Text>
            {selectedImage ? (
              <View style={styles.imagePreview}>
                <Image source={{ uri: selectedImage }} style={styles.image} />
                <Pressable
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                  disabled={uploading}
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.uploadButton}
                onPress={pickImage}
                disabled={uploading}
              >
                <MaterialIcons
                  name="add-photo-alternate"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.uploadButtonText}>Add Meal Photo</Text>
              </Pressable>
            )}
          </View>

          {/* Cooking Video */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Cooking Video</Text>
            {selectedVideo ? (
              <View style={styles.videoPreview}>
                <MaterialIcons
                  name="videocam"
                  size={48}
                  color={theme.colors.primary}
                />
                <Text style={styles.videoPreviewText}>Video Selected</Text>
                <Pressable
                  onPress={() => setSelectedVideo(null)}
                  disabled={uploading}
                  style={styles.removeVideoButton}
                >
                  <Text style={styles.removeVideoButtonText}>Remove</Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.uploadButton}
                onPress={pickVideo}
                disabled={uploading}
              >
                <MaterialIcons
                  name="video-library"
                  size={32}
                  color={theme.colors.primary}
                />
                <Text style={styles.uploadButtonText}>Add Cooking Video</Text>
              </Pressable>
            )}
          </View>

          {/* Macros */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Macronutrients (Optional)</Text>
            <View style={styles.macrosGrid}>
              <TextInput
                style={[styles.macroInput, styles.macroInputFirst]}
                placeholder="Protein (g)"
                placeholderTextColor={theme.colors.textSecondary}
                value={protein}
                onChangeText={setProtein}
                keyboardType="number-pad"
                editable={!uploading}
              />
              <TextInput
                style={styles.macroInput}
                placeholder="Carbs (g)"
                placeholderTextColor={theme.colors.textSecondary}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="number-pad"
                editable={!uploading}
              />
              <TextInput
                style={styles.macroInput}
                placeholder="Fat (g)"
                placeholderTextColor={theme.colors.textSecondary}
                value={fat}
                onChangeText={setFat}
                keyboardType="number-pad"
                editable={!uploading}
              />
              <TextInput
                style={[styles.macroInput, styles.macroInputLast]}
                placeholder="Calories"
                placeholderTextColor={theme.colors.textSecondary}
                value={calories}
                onChangeText={setCalories}
                keyboardType="number-pad"
                editable={!uploading}
              />
            </View>
          </View>

          {/* Tags */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Tags (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="E.g., healthy, vegetarian, quick (comma separated)"
              placeholderTextColor={theme.colors.textSecondary}
              value={tags}
              onChangeText={setTags}
              editable={!uploading}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={uploading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>

            <Pressable
              style={[
                styles.button,
                styles.submitButton,
                uploading && styles.submitButtonDisabled,
              ]}
              onPress={handleCreateMeal}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <ActivityIndicator color="white" />
                  <Text style={styles.submitButtonText}>Creating...</Text>
                </>
              ) : (
                <Text style={styles.submitButtonText}>Create Meal</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  recipeInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  uploadButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.primary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "10",
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  imagePreview: {
    position: "relative",
    borderRadius: theme.spacing.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.surface,
  },
  removeImageButton: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 20,
    padding: theme.spacing.sm,
  },
  videoPreview: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  videoPreviewText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  removeVideoButton: {
    marginTop: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: "#FF5722",
    borderRadius: theme.spacing.md,
  },
  removeVideoButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 12,
  },
  macrosGrid: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  macroInput: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 12,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  macroInputFirst: {},
  macroInputLast: {},
  actionContainer: {
    flexDirection: "row",
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  button: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  cancelButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
});
