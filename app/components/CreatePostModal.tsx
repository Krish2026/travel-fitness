import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { createPost } from "@/lib/firebase";
import Button from "@/components/Button";

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreatePostModal({
  visible,
  onClose,
  onSuccess,
}: CreatePostModalProps) {
  const { user } = useAuthStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"tip" | "motivation" | "update">(
    "tip",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["tip", "motivation", "update"] as const;

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !user?.id) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);

      await createPost({
        trainerId: user.id,
        trainerName: user.name || "Trainer",
        title: title.trim(),
        content: content.trim(),
        category,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Post created successfully!");
      setTitle("");
      setContent("");
      setCategory("tip");
      onClose();
      onSuccess?.();
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
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
            <Pressable onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </Pressable>
            <Text style={styles.headerTitle}>Create Post</Text>
            <View style={{ width: 30 }} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Title Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Enter post title"
                placeholderTextColor={theme.colors.textSecondary}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
              <Text style={styles.charCount}>{title.length}/100</Text>
            </View>

            {/* Content Input */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Content</Text>
              <TextInput
                style={styles.contentInput}
                placeholder="Write your post content here..."
                placeholderTextColor={theme.colors.textSecondary}
                value={content}
                onChangeText={setContent}
                multiline
                maxLength={1000}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>{content.length}/1000</Text>
            </View>

            {/* Category Selection */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryButtons}>
                {categories.map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryBtn,
                      category === cat && styles.categoryBtnActive,
                    ]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.categoryBtnText,
                        category === cat && styles.categoryBtnTextActive,
                      ]}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewTitle}>{title || "Post Title"}</Text>
                  <View style={styles.previewCategory}>
                    <Text style={styles.previewCategoryText}>{category}</Text>
                  </View>
                </View>
                <Text style={styles.previewContent}>
                  {content || "Your content will appear here..."}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={onClose}
              disabled={isSubmitting}
            />
            <Button
              title={isSubmitting ? "Posting..." : "Post"}
              onPress={handleSubmit}
              disabled={isSubmitting || !title.trim() || !content.trim()}
            />
          </View>

          <View style={styles.spacer} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  closeButton: {
    fontSize: 24,
    color: theme.colors.textSecondary,
    width: 30,
    textAlign: "center",
  },
  form: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  formGroup: {
    gap: theme.spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  titleInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
  },
  contentInput: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 14,
    color: theme.colors.text,
    minHeight: 150,
  },
  charCount: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: "right",
  },
  categoryButtons: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  categoryBtn: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
  },
  categoryBtnActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text,
  },
  categoryBtnTextActive: {
    color: "white",
  },
  previewSection: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  previewCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  previewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    gap: theme.spacing.md,
  },
  previewTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    flex: 1,
  },
  previewCategory: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.primary + "20",
    borderRadius: theme.spacing.xs,
  },
  previewCategoryText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  previewContent: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  actions: {
    flexDirection: "row",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
