import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { theme } from "@/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { formatDistanceToNow } from "date-fns";

export interface Meal {
  id: string;
  trainerId: string;
  name: string;
  image?: string;
  recipe: string;
  cookingVideoUrl?: string;
  macros?: {
    protein: number;
    carbs: number;
    fat: number;
    calories: number;
  };
  createdAt: number;
  tags?: string[];
}

interface MealCardProps {
  meal: Meal;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isTrainerView?: boolean;
}

export function MealCard({
  meal,
  onPress,
  onEdit,
  onDelete,
  isTrainerView = false,
}: MealCardProps) {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {/* Meal Image */}
      {meal.image ? (
        <Image source={{ uri: meal.image }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <MaterialIcons
            name="image"
            size={40}
            color={theme.colors.textSecondary}
          />
        </View>
      )}

      {/* Meal Info */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {meal.name}
        </Text>

        <Text style={styles.date}>
          {formatDistanceToNow(new Date(meal.createdAt), { addSuffix: true })}
        </Text>

        {/* Macros */}
        {meal.macros && (
          <View style={styles.macrosContainer}>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{meal.macros.protein}g</Text>
              <Text style={styles.macroLabel}>Protein</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{meal.macros.carbs}g</Text>
              <Text style={styles.macroLabel}>Carbs</Text>
            </View>
            <View style={styles.macroItem}>
              <Text style={styles.macroValue}>{meal.macros.fat}g</Text>
              <Text style={styles.macroLabel}>Fat</Text>
            </View>
            <View style={[styles.macroItem, { borderRightWidth: 0 }]}>
              <Text
                style={[styles.macroValue, { color: theme.colors.primary }]}
              >
                {meal.macros.calories}
              </Text>
              <Text style={styles.macroLabel}>Cal</Text>
            </View>
          </View>
        )}

        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {meal.tags.slice(0, 2).map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
            {meal.tags.length > 2 && (
              <Text style={styles.moreTagsText}>+{meal.tags.length - 2}</Text>
            )}
          </View>
        )}

        {/* Video indicator */}
        {meal.cookingVideoUrl && (
          <View style={styles.videoIndicator}>
            <MaterialIcons
              name="play-circle"
              size={16}
              color={theme.colors.primary}
            />
            <Text style={styles.videoText}>Cooking Video</Text>
          </View>
        )}
      </View>

      {/* Trainer Actions */}
      {isTrainerView && (onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <Pressable
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation?.();
                onEdit();
              }}
            >
              <MaterialIcons
                name="edit"
                size={18}
                color={theme.colors.primary}
              />
            </Pressable>
          )}
          {onDelete && (
            <Pressable
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation?.();
                onDelete();
              }}
            >
              <MaterialIcons name="delete" size={18} color="#FF5722" />
            </Pressable>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    overflow: "hidden",
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: "100%",
    height: 150,
    backgroundColor: theme.colors.background,
  },
  imagePlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: theme.spacing.md,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  macrosContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: theme.colors.border,
    borderBottomColor: theme.colors.border,
  },
  macroItem: {
    flex: 1,
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    paddingVertical: theme.spacing.xs,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
  },
  macroLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  tagsContainer: {
    flexDirection: "row",
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: theme.colors.primary + "20",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.spacing.sm,
  },
  tagText: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  moreTagsText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    fontWeight: "600",
  },
  videoIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
  },
  videoText: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
});
