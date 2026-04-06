import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  FlatList,
} from "react-native";
import { theme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { formatDistanceToNow } from "date-fns";
import { Post } from "@/lib/types";

interface PostCardProps {
  post: Post;
  trainerName?: string;
  onHashtagPress?: (hashtag: string) => void;
  onUserTagPress?: (userId: string, userName?: string) => void;
  onLocationPress?: (location: string) => void;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export function PostCard({
  post,
  trainerName,
  onHashtagPress,
  onUserTagPress,
  onLocationPress,
  onLike,
  onComment,
}: PostCardProps) {
  const getTaggedUserName = (userId: string): string | undefined => {
    // This would need to be fetched from a map of user data
    // For now, we'll just return undefined and let the parent handle it
    return undefined;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.authorAvatar}>
            <MaterialIcons name="person" size={20} color="white" />
          </View>
          <View>
            <Text style={styles.authorName}>{trainerName || "Trainer"}</Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(new Date(post.timestamp), {
                addSuffix: true,
              })}
            </Text>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.postContent}>{post.content}</Text>
      </View>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <FlatList
          data={post.media}
          keyExtractor={(_, idx) => idx.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <>
              {item.type === "image" && (
                <Image source={{ uri: item.url }} style={styles.media} />
              )}
            </>
          )}
          style={styles.mediaContainer}
        />
      )}

      {/* Location and Tags */}
      <View style={styles.tagsSection}>
        {post.location && (
          <Pressable
            style={styles.locationBadge}
            onPress={() => onLocationPress?.(post.location!)}
          >
            <MaterialIcons
              name="location-on"
              size={14}
              color={theme.colors.primary}
            />
            <Text style={styles.locationText}>{post.location}</Text>
          </Pressable>
        )}

        {/* Hashtags */}
        {post.hashtags && post.hashtags.length > 0 && (
          <View style={styles.hashtagsContainer}>
            {post.hashtags.map((hashtag) => (
              <Pressable
                key={hashtag}
                onPress={() => onHashtagPress?.(hashtag)}
                style={styles.hashtag}
              >
                <Text style={styles.hashtagText}>#{hashtag}</Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* User Tags */}
        {post.taggedUsers && post.taggedUsers.length > 0 && (
          <View style={styles.userTagsContainer}>
            {post.taggedUsers.map((userId) => (
              <Pressable
                key={userId}
                onPress={() => onUserTagPress?.(userId)}
                style={styles.userTag}
              >
                <Text style={styles.userTagText}>@User</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <Pressable style={styles.action} onPress={() => onLike?.(post.id)}>
          <MaterialIcons
            name="favorite-border"
            size={20}
            color={theme.colors.text}
          />
          <Text style={styles.actionText}>{post.likes}</Text>
        </Pressable>

        <Pressable style={styles.action} onPress={() => onComment?.(post.id)}>
          <MaterialIcons
            name="chat-bubble-outline"
            size={20}
            color={theme.colors.text}
          />
          <Text style={styles.actionText}>{post.comments?.length || 0}</Text>
        </Pressable>

        <Pressable style={styles.action}>
          <MaterialIcons name="share" size={20} color={theme.colors.text} />
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  authorName: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  content: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  postContent: {
    fontSize: 13,
    color: theme.colors.text,
    lineHeight: 18,
  },
  mediaContainer: {
    marginVertical: theme.spacing.md,
  },
  media: {
    width: "100%",
    height: 200,
    backgroundColor: theme.colors.background,
  },
  tagsSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.sm,
  },
  locationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primary + "10",
    borderRadius: theme.spacing.md,
    alignSelf: "flex-start",
  },
  locationText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  hashtag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    backgroundColor: theme.colors.primary + "15",
    borderRadius: theme.spacing.sm,
  },
  hashtagText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  userTagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.xs,
  },
  userTag: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    backgroundColor: theme.colors.primary + "15",
    borderRadius: theme.spacing.sm,
  },
  userTagText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
});
