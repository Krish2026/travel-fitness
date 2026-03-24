import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { useState } from "react";
import { theme } from "@/theme";
import * as ImagePicker from "expo-image-picker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { uploadVideoToFirebase } from "@/lib/firebase";

interface VideoUploaderProps {
  onVideoSelected: (videoUrl: string, thumbnail?: string) => void;
  isLoading?: boolean;
  maxSizeMB?: number;
}

export function VideoUploader({
  onVideoSelected,
  isLoading = false,
  maxSizeMB = 500,
}: VideoUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState<{
    uri: string;
    name: string;
    size: number;
  } | null>(null);

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        setSelectedVideo({
          uri: asset.uri,
          name: asset.uri.split("/").pop() || "video.mp4",
          size: 0,
        });
      }
    } catch (error) {
      console.error("Error picking video:", error);
      Alert.alert("Error", "Failed to pick video file");
    }
  };

  const uploadVideo = async () => {
    if (!selectedVideo) return;

    try {
      const videoUrl = await uploadVideoToFirebase(
        selectedVideo.uri,
        selectedVideo.name,
        (progress) => setUploadProgress(progress),
      );

      onVideoSelected(videoUrl);
      setSelectedVideo(null);
      setUploadProgress(0);
    } catch (error) {
      console.error("Error uploading video:", error);
      Alert.alert("Upload Failed", "Failed to upload video to server");
    }
  };

  if (isLoading || uploadProgress > 0) {
    return (
      <View style={styles.container}>
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.uploadingText}>
            Uploading... {Math.round(uploadProgress)}%
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressBarFill, { width: `${uploadProgress}%` }]}
            />
          </View>
        </View>
      </View>
    );
  }

  if (selectedVideo) {
    return (
      <View style={styles.container}>
        <View style={styles.selectedVideoContainer}>
          <View style={styles.videoPreview}>
            <MaterialIcons
              name="videocam"
              size={48}
              color={theme.colors.primary}
            />
          </View>

          <View style={styles.videoInfo}>
            <Text style={styles.videoName} numberOfLines={2}>
              {selectedVideo.name}
            </Text>
            <Text style={styles.videoSize}>Video selected</Text>
          </View>

          <View style={styles.actionButtons}>
            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setSelectedVideo(null)}
            >
              <MaterialIcons
                name="close"
                size={20}
                color={theme.colors.primary}
              />
              <Text style={styles.secondaryButtonText}>Clear</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.uploadButton]}
              onPress={uploadVideo}
            >
              <MaterialIcons name="cloud-upload" size={20} color="white" />
              <Text style={styles.uploadButtonText}>Upload</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.pickButton} onPress={pickVideo}>
        <MaterialIcons
          name="add-circle-outline"
          size={32}
          color={theme.colors.primary}
        />
        <Text style={styles.pickButtonText}>Select Video</Text>
        <Text style={styles.pickButtonSubtext}>Max {maxSizeMB}MB</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  pickButton: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: theme.colors.primary,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.primary + "10",
  },
  pickButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
    marginTop: theme.spacing.sm,
  },
  pickButtonSubtext: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  selectedVideoContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  videoPreview: {
    width: "100%",
    height: 150,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  videoInfo: {
    marginBottom: theme.spacing.md,
  },
  videoName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: 4,
  },
  videoSize: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actionButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.md,
    borderRadius: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  secondaryButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.primary,
  },
  uploadButton: {
    backgroundColor: theme.colors.primary,
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },
  uploadingContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.lg,
    alignItems: "center",
  },
  uploadingText: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    marginTop: theme.spacing.md,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
  },
});
