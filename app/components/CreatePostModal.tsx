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
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { createPost, uploadPostMedia, getTrainerClients } from "@/lib/firebase";
import { Button } from "@/components/Button";
import MediaPicker from "@/components/MediaPicker";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface TrainerClient {
  id: string;
  name: string;
  profilePicture?: string;
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
  const [selectedImage, setSelectedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New fields
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [taggedUsers, setTaggedUsers] = useState<string[]>([]);
  const [location, setLocation] = useState("");
  const [showUserPicker, setShowUserPicker] = useState(false);
  const [clients, setClients] = useState<TrainerClient[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);

  const categories = ["tip", "motivation", "update"] as const;

  useEffect(() => {
    if (visible && user?.id && user.role === "trainer") {
      loadClients();
    }
  }, [visible, user]);

  const loadClients = async () => {
    if (!user?.id) return;
    try {
      setLoadingClients(true);
      const clientsList = await getTrainerClients(user.id);
      setClients(clientsList);
    } catch (error) {
      console.error("Error loading clients:", error);
    } finally {
      setLoadingClients(false);
    }
  };

  const handleHashtagInput = (text: string) => {
    setHashtagInput(text);

    // Auto-detect hashtags when user types space or enters
    if (text.endsWith(" ") || text.endsWith("\n")) {
      const lastWord = text.trim().split(/\s+/).pop() || "";
      if (lastWord.startsWith("#") && lastWord.length > 1) {
        const hashtag = lastWord.substring(1).toLowerCase();
        if (!hashtags.includes(hashtag)) {
          setHashtags([...hashtags, hashtag]);
          setHashtagInput("");
        }
      }
    }
  };

  const addHashtag = (hashtag: string) => {
    const cleanHashtag = hashtag.replace(/^#/, "").toLowerCase().trim();
    if (cleanHashtag && !hashtags.includes(cleanHashtag)) {
      setHashtags([...hashtags, cleanHashtag]);
      setHashtagInput("");
    }
  };

  const removeHashtag = (hashtag: string) => {
    setHashtags(hashtags.filter((h) => h !== hashtag));
  };

  const toggleUserTag = (userId: string) => {
    if (taggedUsers.includes(userId)) {
      setTaggedUsers(taggedUsers.filter((id) => id !== userId));
    } else {
      setTaggedUsers([...taggedUsers, userId]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !user?.id) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setIsSubmitting(true);

      let mediaUrl = "";

      // Upload image if one is selected
      if (selectedImage) {
        try {
          mediaUrl = await uploadPostMedia(user.id, selectedImage, "image");
        } catch (error) {
          console.error("Error uploading image:", error);
          Alert.alert(
            "Error",
            "Failed to upload image. Post created without image.",
          );
        }
      }

      await createPost(user.id || "", {
        type: selectedImage ? "image" : "text",
        content: `${title}\n\n${content}`,
        media: mediaUrl ? [{ url: mediaUrl, type: "image" as const }] : [],
        hashtags,
        taggedUsers,
        location: location.trim() || undefined,
      });

      Alert.alert("Success", "Post created successfully!");
      setTitle("");
      setContent("");
      setCategory("tip");
      setSelectedImage("");
      setHashtags([]);
      setHashtagInput("");
      setTaggedUsers([]);
      setLocation("");
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

            {/* Media Picker */}
            <MediaPicker
              onImageSelected={setSelectedImage}
              selectedImage={selectedImage}
              onRemove={() => setSelectedImage("")}
              label="Attach Image (Optional)"
              placeholderText="Tap to add an image to your post"
              aspectRatio={16 / 9}
            />

            {/* Hashtags */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hashtags (Optional)</Text>
              <View style={styles.hashtagContainer}>
                <TextInput
                  style={styles.hashtagInput}
                  placeholder="Type #fitness then space to add..."
                  placeholderTextColor={theme.colors.textSecondary}
                  value={hashtagInput}
                  onChangeText={handleHashtagInput}
                  onSubmitEditing={() => {
                    if (hashtagInput.trim()) {
                      addHashtag(hashtagInput);
                    }
                  }}
                />
                {hashtagInput.trim() && (
                  <Pressable
                    style={styles.addHashtagBtn}
                    onPress={() => addHashtag(hashtagInput)}
                  >
                    <MaterialIcons name="add" size={20} color="white" />
                  </Pressable>
                )}
              </View>

              {/* Hashtag Chips */}
              {hashtags.length > 0 && (
                <View style={styles.chipsContainer}>
                  {hashtags.map((tag) => (
                    <View key={tag} style={styles.chip}>
                      <Text style={styles.chipText}>#{tag}</Text>
                      <Pressable
                        onPress={() => removeHashtag(tag)}
                        style={styles.chipClose}
                      >
                        <MaterialIcons
                          name="close"
                          size={14}
                          color={theme.colors.primary}
                        />
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Location */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location (Optional)</Text>
              <TextInput
                style={styles.titleInput}
                placeholder="Add location (e.g., Gym, Studio)"
                placeholderTextColor={theme.colors.textSecondary}
                value={location}
                onChangeText={setLocation}
                maxLength={50}
              />
            </View>

            {/* User Tags */}
            {user?.role === "trainer" && clients.length > 0 && (
              <View style={styles.formGroup}>
                <View style={styles.tagUsersHeader}>
                  <Text style={styles.label}>Tag Clients (Optional)</Text>
                  <Pressable
                    onPress={() => setShowUserPicker(!showUserPicker)}
                    style={styles.toggleUserPickerBtn}
                  >
                    <MaterialIcons
                      name={showUserPicker ? "expand-less" : "expand-more"}
                      size={20}
                      color={theme.colors.primary}
                    />
                  </Pressable>
                </View>

                {showUserPicker && (
                  <View style={styles.userPickerContainer}>
                    {loadingClients ? (
                      <ActivityIndicator color={theme.colors.primary} />
                    ) : (
                      <FlatList
                        data={clients}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        renderItem={({ item }) => (
                          <Pressable
                            style={[
                              styles.userItem,
                              taggedUsers.includes(item.id) &&
                                styles.userItemSelected,
                            ]}
                            onPress={() => toggleUserTag(item.id)}
                          >
                            <View
                              style={[
                                styles.checkbox,
                                taggedUsers.includes(item.id) &&
                                  styles.checkboxSelected,
                              ]}
                            >
                              {taggedUsers.includes(item.id) && (
                                <MaterialIcons
                                  name="check"
                                  size={14}
                                  color="white"
                                />
                              )}
                            </View>
                            <Text style={styles.userName}>{item.name}</Text>
                          </Pressable>
                        )}
                      />
                    )}
                  </View>
                )}

                {/* Tagged Users Chips */}
                {taggedUsers.length > 0 && (
                  <View style={styles.chipsContainer}>
                    {taggedUsers.map((userId) => {
                      const client = clients.find((c) => c.id === userId);
                      return (
                        <View key={userId} style={styles.userChip}>
                          <Text style={styles.chipText}>@{client?.name}</Text>
                          <Pressable
                            onPress={() => toggleUserTag(userId)}
                            style={styles.chipClose}
                          >
                            <MaterialIcons
                              name="close"
                              size={14}
                              color={theme.colors.primary}
                            />
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            )}

            {/* Preview */}
            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <Text style={styles.previewTitle}>
                    {title || "Post Title"}
                  </Text>
                  <View style={styles.previewCategory}>
                    <Text style={styles.previewCategoryText}>{category}</Text>
                  </View>
                </View>
                <Text style={styles.previewContent}>
                  {content || "Your content will appear here..."}
                </Text>

                {/* Preview tags */}
                {(hashtags.length > 0 ||
                  taggedUsers.length > 0 ||
                  location) && (
                  <View style={styles.previewTags}>
                    {location && (
                      <View style={styles.previewLocation}>
                        <MaterialIcons
                          name="location-on"
                          size={12}
                          color={theme.colors.primary}
                        />
                        <Text style={styles.previewLocationText}>
                          {location}
                        </Text>
                      </View>
                    )}

                    <View style={styles.previewHashtags}>
                      {hashtags.map((tag) => (
                        <Text key={tag} style={styles.previewHashtag}>
                          #{tag}
                        </Text>
                      ))}
                      {taggedUsers.map((userId) => {
                        const client = clients.find((c) => c.id === userId);
                        return (
                          <Text key={userId} style={styles.previewTag}>
                            @{client?.name}
                          </Text>
                        );
                      })}
                    </View>
                  </View>
                )}
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
  // Hashtag styles
  hashtagContainer: {
    flexDirection: "row",
    gap: theme.spacing.sm,
  },
  hashtagInput: {
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
  addHashtagBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
  },
  chipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  userChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  chipClose: {
    padding: 2,
  },
  // User tagging styles
  tagUsersHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  toggleUserPickerBtn: {
    padding: theme.spacing.sm,
  },
  userPickerContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.md,
    maxHeight: 200,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  userItemSelected: {
    backgroundColor: theme.colors.primary + "10",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    flex: 1,
  },
  // Preview styles
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
    marginBottom: theme.spacing.md,
  },
  previewTags: {
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  previewLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
  },
  previewLocationText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  previewHashtags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  previewHashtag: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
  },
  previewTag: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
    marginRight: theme.spacing.xs,
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
