import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import { useState, useCallback } from "react";
import { theme } from "@/theme";
import { useImagePicker } from "@/hooks/useImagePicker";
import ImageCropper from "@/components/ImageCropper";
import { Button } from "@/components/Button";

export interface MediaPickerProps {
  onImageSelected: (imageUri: string) => void;
  selectedImage?: string;
  onRemove?: () => void;
  label?: string;
  placeholderText?: string;
  aspectRatio?: number;
}

export default function MediaPicker({
  onImageSelected,
  selectedImage,
  onRemove,
  label = "Upload Image",
  placeholderText = "No image selected",
  aspectRatio = 16 / 9,
}: MediaPickerProps) {
  const { pickImage, isPickingImage } = useImagePicker();
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);

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
    (croppedUri: string) => {
      setShowCropper(false);
      onImageSelected(croppedUri);
      setSelectedImageUri(null);
      Alert.alert("Success", "Image selected!");
    },
    [onImageSelected],
  );

  const handleRemoveImage = () => {
    Alert.alert("Remove Image", "Remove this image?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        onPress: () => {
          onRemove?.();
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Image Preview */}
      <View style={styles.previewContainer}>
        {selectedImage ? (
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: selectedImage }}
              style={styles.image}
              resizeMode="cover"
            />
            <Pressable style={styles.removeOverlay} onPress={handleRemoveImage}>
              <View style={styles.removeIcon}>
                <Text style={styles.removeText}>✕</Text>
              </View>
            </Pressable>
          </View>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderIcon}>🖼️</Text>
            <Text style={styles.placeholderText}>{placeholderText}</Text>
          </View>
        )}
      </View>

      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Controls */}
      <View style={styles.controls}>
        <Button
          title={isPickingImage ? "Selecting..." : "Choose Image"}
          onPress={handlePickImage}
          disabled={isPickingImage}
          variant="secondary"
        />
        {selectedImage && (
          <Pressable
            style={styles.changeButton}
            onPress={() => {
              setSelectedImageUri(null);
              setShowCropper(false);
            }}
          >
            <Text style={styles.changeButtonText}>Change</Text>
          </Pressable>
        )}
      </View>

      {/* File size info */}
      <Text style={styles.supportText}>
        JPG, PNG · Max 5MB · Recommended: {Math.round(aspectRatio * 100)}×100px
      </Text>

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
          title="Crop Image"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.md,
  },
  previewContainer: {
    width: "100%",
    height: 200,
    borderRadius: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
    overflow: "hidden",
    backgroundColor: theme.colors.surface,
  },
  imageWrapper: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  removeOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  removeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  removeText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  placeholderText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  controls: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  changeButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  changeButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  supportText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
});
