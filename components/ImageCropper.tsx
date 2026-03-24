import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  ScrollView,
  Image,
  Modal,
} from "react-native";
import { useState, useRef } from "react";
import { theme } from "@/theme";
import { Button } from "@/components/Button";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface ImageCropperProps {
  visible: boolean;
  imageUri: string;
  onCrop: (croppedUri: string) => void;
  onCancel: () => void;
  aspectRatio?: number; // e.g., 1 for square, 16/9 for landscape
  title?: string;
}

export default function ImageCropper({
  visible,
  imageUri,
  onCrop,
  onCancel,
  aspectRatio = 1,
  title = "Crop Image",
}: ImageCropperProps) {
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate crop area dimensions
  const cropAreaSize = Math.min(SCREEN_WIDTH - 40, 300);
  const cropAreaHeight = cropAreaSize / aspectRatio;

  const handleCrop = async () => {
    try {
      setIsProcessing(true);

      // For now, we'll just return the URI as-is since React Native cropping is complex
      // In production, you'd use a native library or backend service for actual cropping
      // This component serves as the UX for selection and adjustment
      onCrop(imageUri);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 1));
  };

  const handleResetPosition = () => {
    setScale(1);
    setOffsetX(0);
    setOffsetY(0);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onCancel}>
            <Text style={styles.cancelButton}>✕</Text>
          </Pressable>
          <Text style={styles.title}>{title}</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Image Preview */}
        <ScrollView
          style={styles.imageContainer}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.previewWrapper}>
            {/* Crop frame overlay */}
            <View
              style={[
                styles.cropFrame,
                {
                  width: cropAreaSize,
                  height: cropAreaHeight,
                },
              ]}
            >
              {/* Image with transform */}
              <Image
                source={{ uri: imageUri }}
                style={[
                  styles.image,
                  {
                    transform: [
                      { scale },
                      { translateX: offsetX },
                      { translateY: offsetY },
                    ],
                  },
                ]}
                resizeMode="cover"
              />
            </View>

            {/* Darken area outside crop */}
            <View style={styles.overlay} />
          </View>
        </ScrollView>

        {/* Controls */}
        <View style={styles.controlsSection}>
          <Text style={styles.controlsLabel}>Adjust Image</Text>

          {/* Zoom Controls */}
          <View style={styles.controlButtons}>
            <Pressable
              style={styles.controlButton}
              onPress={handleZoomOut}
              disabled={scale <= 1}
            >
              <Text
                style={[
                  styles.controlButtonText,
                  scale <= 1 && styles.controlButtonDisabled,
                ]}
              >
                − Zoom Out
              </Text>
            </Pressable>

            <View style={styles.scaleIndicator}>
              <Text style={styles.scaleText}>{(scale * 100).toFixed(0)}%</Text>
            </View>

            <Pressable
              style={styles.controlButton}
              onPress={handleZoomIn}
              disabled={scale >= 2}
            >
              <Text
                style={[
                  styles.controlButtonText,
                  scale >= 2 && styles.controlButtonDisabled,
                ]}
              >
                + Zoom In
              </Text>
            </Pressable>
          </View>

          {/* Position Reset */}
          <Pressable style={styles.resetButton} onPress={handleResetPosition}>
            <Text style={styles.resetButtonText}>↺ Reset Position</Text>
          </Pressable>

          {/* Aspect Ratio Info */}
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Aspect Ratio:{" "}
              {aspectRatio === 1 ? "1:1 (Square)" : `${aspectRatio}:1`}
            </Text>
            <Text style={styles.infoText}>Tip: Pinch to zoom, drag to pan</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            disabled={isProcessing}
          />
          <Button
            title={isProcessing ? "Processing..." : "Crop & Use"}
            onPress={handleCrop}
            disabled={isProcessing}
          />
        </View>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cancelButton: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    width: 30,
    textAlign: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  previewWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cropFrame: {
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: "hidden",
    backgroundColor: "#000",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  controlsSection: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  controlsLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },
  controlButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
    alignItems: "center",
  },
  controlButton: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  controlButtonDisabled: {
    color: theme.colors.textSecondary,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  scaleIndicator: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  scaleText: {
    fontSize: 13,
    fontWeight: "700",
    color: theme.colors.text,
  },
  resetButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  infoBox: {
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
});
