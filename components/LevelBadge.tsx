import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";

export interface LevelBadgeProps {
  level: number;
  size?: "small" | "medium" | "large";
}

const levelColors = {
  1: "#8B7355", // Bronze
  2: "#C0C0C0", // Silver
  3: "#FFD700", // Gold
  4: "#00D9FF", // Diamond
  5: "#FF00FF", // Mythic (level 5+)
};

function getLevelColor(level: number): string {
  if (level === 1) return levelColors[1];
  if (level === 2) return levelColors[2];
  if (level === 3) return levelColors[3];
  if (level === 4) return levelColors[4];
  return levelColors[5];
}

function getLevelName(level: number): string {
  switch (level) {
    case 1:
      return "Bronze";
    case 2:
      return "Silver";
    case 3:
      return "Gold";
    case 4:
      return "Diamond";
    default:
      return "Mythic";
  }
}

export function LevelBadge({ level, size = "medium" }: LevelBadgeProps) {
  const sizeMap = {
    small: { container: 40, fontSize: 12, iconSize: 16 },
    medium: { container: 56, fontSize: 14, iconSize: 20 },
    large: { container: 72, fontSize: 16, iconSize: 24 },
  };

  const config = sizeMap[size];
  const color = getLevelColor(level);
  const levelName = getLevelName(level);

  return (
    <View
      style={[
        styles.container,
        {
          width: config.container,
          height: config.container,
          backgroundColor: color + "20",
          borderColor: color,
        },
      ]}
    >
      <MaterialIcons
        name="emoji-events"
        size={config.iconSize}
        color={color}
        style={styles.icon}
      />
      <Text style={[styles.levelText, { fontSize: config.fontSize, color }]}>
        Lvl {level}
      </Text>
      <Text
        style={[
          styles.nameText,
          {
            fontSize: config.fontSize * 0.65,
            color: theme.colors.textSecondary,
          },
        ]}
      >
        {levelName}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  icon: {
    marginBottom: 2,
  },
  levelText: {
    fontWeight: "700",
  },
  nameText: {
    fontWeight: "500",
  },
});
