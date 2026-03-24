import { View, Text, StyleSheet, Animated, Pressable } from "react-native";
import { useEffect, useRef } from "react";
import { theme } from "@/theme";
import { MaterialIcons } from "@expo/vector-icons";

export interface LevelUpNotificationProps {
  visible: boolean;
  newLevel: number;
  onDismiss: () => void;
}

export function LevelUpNotification({
  visible,
  newLevel,
  onDismiss,
}: LevelUpNotificationProps) {
  const slideAnim = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(slideAnim, {
          toValue: -200,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onDismiss();
      });
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.notificationCard}>
        <MaterialIcons name="emoji-events" size={32} color="#FFD700" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Level Up! 🎉</Text>
          <Text style={styles.subtitle}>You've reached Level {newLevel}</Text>
        </View>
        <Pressable onPress={onDismiss} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color={theme.colors.text} />
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
  },
  notificationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
    borderLeftWidth: 4,
    borderLeftColor: "#FFD700",
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  closeButton: {
    padding: theme.spacing.sm,
  },
});
