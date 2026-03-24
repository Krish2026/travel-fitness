import { View, Text, StyleSheet, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { theme } from "@/theme";
import {
  getWeekDates,
  isSameDay,
  formatDate,
  DAYS_OF_WEEK,
} from "@/lib/calendarUtils";

interface MiniCalendarWidgetProps {
  events?: Array<{ date: number; title: string }>;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export function MiniCalendarWidget({
  events = [],
  selectedDate,
  onDateSelect,
}: MiniCalendarWidgetProps) {
  const [weekDates, setWeekDates] = useState<Date[]>([]);

  useEffect(() => {
    const now = new Date();
    setWeekDates(getWeekDates(now));
  }, []);

  const hasEvent = (date: Date): boolean => {
    return events.some((event) => event.date === date.getTime());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This Week</Text>

      <View style={styles.weekGrid}>
        {DAYS_OF_WEEK.map((day, index) => (
          <View key={day} style={styles.dayColumn}>
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.weekGrid}>
        {weekDates.map((date) => {
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const hasEventOnDate = hasEvent(date);

          return (
            <Pressable
              key={date.toISOString()}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDay,
              ]}
              onPress={() => onDateSelect?.(date)}
            >
              <Text
                style={[
                  styles.dayDate,
                  isSelected && styles.selectedDayDate,
                ]}
              >
                {date.getDate()}
              </Text>
              {hasEventOnDate && <View style={styles.eventDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  weekGrid: {
    flexDirection: "row",
    marginBottom: theme.spacing.sm,
  },
  dayColumn: {
    flex: 1,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  selectedDay: {
    backgroundColor: theme.colors.primary,
  },
  dayDate: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.text,
  },
  selectedDayDate: {
    color: "white",
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.primary,
    marginTop: 2,
  },
});
