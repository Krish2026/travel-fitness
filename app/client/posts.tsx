import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { getPostsFeed, getPostsForTrainer } from "@/lib/firebase";
import { Post } from "@/lib/types";
import { Button } from "@/components/Button";
import CreatePostModal from "@/app/components/CreatePostModal";

export default function PostsFeedScreen() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"feed" | "my-posts">(
    user?.role === "trainer" ? "my-posts" : "feed",
  );

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      if (!user?.id) return;

      let allPosts: Post[] = [];
      if (selectedTab === "feed") {
        // Load all posts
        allPosts = (await getPostsFeed()) as Post[];
      } else {
        // Load trainer's posts
        allPosts = (await getPostsForTrainer(user.id)) as Post[];
      }
      setPosts(allPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      Alert.alert("Error", "Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, selectedTab]);

  useFocusEffect(
    useCallback(() => {
      loadPosts();
    }, [selectedTab, loadPosts]),
  );

  const handlePostSuccess = () => {
    loadPosts();
  };

  const categoryColors = {
    video: theme.colors.primary,
    image: "#FF6B6B",
    text: "#4ECDC4",
  };

  const renderPostCard = (post: Post) => (
    <View key={post.id} style={styles.postCard}>
      {/* Header */}
      <View style={styles.postHeader}>
        <View style={styles.posterInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>T</Text>
          </View>
          <View style={styles.posterDetails}>
            <Text style={styles.posterName}>Trainer</Text>
            <Text style={styles.postTime}>
              {new Date(post.timestamp).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.categoryBadge,
            {
              backgroundColor:
                categoryColors[post.type as keyof typeof categoryColors] + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.categoryBadgeText,
              {
                color: categoryColors[post.type as keyof typeof categoryColors],
              },
            ]}
          >
            {post.type?.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Caption */}
      {post.caption && <Text style={styles.postTitle}>{post.caption}</Text>}

      {/* Content */}
      <Text style={styles.postContent} numberOfLines={4}>
        {post.content}
      </Text>

      {/* Actions */}
      <View style={styles.postActions}>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>👍</Text>
          <Text style={styles.actionText}>Like</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Comment</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <Text style={styles.title}>Community Feed</Text>
        {user?.role === "trainer" && (
          <Button
            title="+ New Post"
            onPress={() => setIsModalVisible(true)}
            variant="primary"
          />
        )}
      </View>

      {/* Tabs */}
      {user?.role === "trainer" && (
        <View style={styles.tabBar}>
          <Pressable
            style={[styles.tab, selectedTab === "feed" && styles.tabActive]}
            onPress={() => setSelectedTab("feed")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "feed" && styles.tabTextActive,
              ]}
            >
              Feed
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, selectedTab === "my-posts" && styles.tabActive]}
            onPress={() => setSelectedTab("my-posts")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "my-posts" && styles.tabTextActive,
              ]}
            >
              My Posts
            </Text>
          </Pressable>
        </View>
      )}

      {/* Posts List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : posts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateIcon}>📝</Text>
          <Text style={styles.emptyStateTitle}>No posts yet</Text>
          <Text style={styles.emptyStateSubtitle}>
            {user?.role === "trainer"
              ? "Create your first post to get started"
              : "Follow trainers to see their posts"}
          </Text>
          {user?.role === "trainer" && (
            <Button
              title="Create Post"
              onPress={() => setIsModalVisible(true)}
              variant="primary"
            />
          )}
        </View>
      ) : (
        <ScrollView
          style={styles.feedScroll}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.postsList}>
            {posts.map((post) => renderPostCard(post))}
          </View>
          <View style={styles.spacer} />
        </ScrollView>
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSuccess={handlePostSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.md,
    alignItems: "center",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  tabActive: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginBottom: theme.spacing.lg,
  },
  feedScroll: {
    flex: 1,
  },
  postsList: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.lg,
  },
  postCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  posterInfo: {
    flexDirection: "row",
    gap: theme.spacing.md,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
  posterDetails: {
    justifyContent: "center",
  },
  posterName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  postTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  categoryBadge: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.spacing.xs,
  },
  categoryBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  postContent: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
