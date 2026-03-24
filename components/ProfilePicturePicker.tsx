import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useCallback } from "react";
import { theme } from "@/theme";
import { useImagePicker } from "@/hooks/useImagePicker";
import ImageCropper from "@/components/ImageCropper";
import { Button } from "@/components/Button";

export interface ProfilePicturePickerProps {
  onImageSelected: (imageUri: string) => Promise<void>;
  currentImage?: string;
  aspectRatio?: number;
  label?: string;
}

export default function ProfilePicturePicker({
  onImageSelected,
  currentImage,
  aspectRatio = 1,
  label = "Profile Picture",
}: ProfilePicturePickerProps) {
  const { pickImage, isPickingImage } = useImagePicker();
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [croppedImageUri, setCroppedImageUri] = useState<string | null>(
    currentImage || null,
  );
  const [showCropper, setShowCropper] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handlePickImage = useCallback(async () => {
    await pickImage(
      (image) => {
        setSelectedImageUri(image.uri);
        setShowCropper(true);
      },
      {
        allowsEditing: false,
        aspect: [aspectRatio, 1],
        quality: 0.8,
      },
    );
  }, [pickImage, aspectRatio]);

  const handleImageCropped = useCallback(
    async (croppedUri: string) => {
      try {
        setShowCropper(false);
        setIsUploading(true);

        // Call the upload handler
        await onImageSelected(croppedUri);

        // Update local state if successful
        setCroppedImageUri(croppedUri);
        setSelectedImageUri(null);

        Alert.alert("Success", "Image updated successfully!");
      } catch (error) {
        console.error("Error uploading image:", error);
        Alert.alert("Error", "Failed to upload image");
      } finally {
        setIsUploading(false);
      }
    },
    [onImageSelected],
  );

  const handleRemoveImage = () => {
    Alert.alert("Remove Image", "Remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => {
          setCroppedImageUri(null);
          setSelectedImageUri(null);
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Profile Picture Display */}
      <View style={styles.pictureFrame}>
        {croppedImageUri ? (
          <>
            <Image
              source={{ uri: croppedImageUri }}
              style={styles.profileImage}
              onError={(e) =>
                console.error("Image load error:", e.nativeEvent.error)
              }
            />
            <Pressable
              style={styles.removeButton}
              onPress={handleRemoveImage}
              disabled={isUploading}
            >
              <Text style={styles.removeButtonText}>✕</Text>
            </Pressable>
          </>
        ) : (
          <View style={styles.placeholderContent}>
            <Text style={styles.placeholderIcon}>📷</Text>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Upload Button */}
      <Button
        title={
          isPickingImage
            ? "Picking..."
            : isUploading
              ? "Uploading..."
              : "Choose Image"
        }
        onPress={handlePickImage}
        disabled={isPickingImage || isUploading}
        variant="secondary"
      />

      {/* Image Info */}
      {croppedImageUri && (
        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Image Set</Text>
          <Text style={styles.infoText}>Tap "Choose Image" to change it</Text>
        </View>
      )}

      {/* Image Cropper Modal */}
      {selectedImageUri && (
        <ImageCropper
          visible={showCropper}
          imageUri={selectedImageUri}
          onCrop={handleImageCropped}
          onCancel={() => {
            setShowCropper(false);
            setSelectedImageUri(null);
          }}
          aspectRatio={aspectRatio}
          title={`Crop ${label}`}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  pictureFrame: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.surface,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  removeButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: theme.colors.background,
  },
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  placeholderContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 40,
    marginBottom: theme.spacing.sm,
  },
  placeholderText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  infoBox: {
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  infoText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
});
