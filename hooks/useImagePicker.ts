import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";

export interface PickedImage {
  uri: string;
  width: number;
  height: number;
  mimeType: string;
  fileSize: number;
}

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function useImagePicker() {
  const [isPickingImage, setIsPickingImage] = useState(false);
  const [pickedImage, setPickedImage] = useState<PickedImage | null>(null);

  const pickImage = useCallback(
    async (
      onImagePicked?: (image: PickedImage) => void,
      options?: {
        quality?: number;
        allowsEditing?: boolean;
        aspect?: [number, number];
      },
    ) => {
      try {
        setIsPickingImage(true);

        // Request permissions
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert(
            "Permission Denied",
            "Camera roll permission is required to pick images",
          );
          return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: options?.allowsEditing ?? true,
          aspect: options?.aspect ?? [1, 1],
          quality: options?.quality ?? 0.8,
        });

        if (result.canceled) {
          return;
        }

        const pickedAsset = result.assets[0];
        if (!pickedAsset.uri) {
          Alert.alert("Error", "Failed to pick image");
          return;
        }

        // Validate file size
        const fileInfo = await FileSystem.getInfoAsync(pickedAsset.uri);
        if (
          fileInfo.exists &&
          "size" in fileInfo &&
          fileInfo.size > MAX_IMAGE_SIZE
        ) {
          Alert.alert(
            "File Too Large",
            `Image must be smaller than 5MB. Your image is ${(fileInfo.size / 1024 / 1024).toFixed(2)}MB`,
          );
          return;
        }

        const image: PickedImage = {
          uri: pickedAsset.uri,
          width: pickedAsset.width || 1000,
          height: pickedAsset.height || 1000,
          mimeType: pickedAsset.mimeType || "image/jpeg",
          fileSize:
            (fileInfo.exists && "size" in fileInfo && fileInfo.size) || 0,
        };

        setPickedImage(image);
        onImagePicked?.(image);
      } catch (error) {
        console.error("Error picking image:", error);
        Alert.alert("Error", "Failed to pick image");
      } finally {
        setIsPickingImage(false);
      }
    },
    [],
  );

  const clearImage = useCallback(() => {
    setPickedImage(null);
  }, []);

  return {
    pickImage,
    pickedImage,
    clearImage,
    isPickingImage,
  };
}
