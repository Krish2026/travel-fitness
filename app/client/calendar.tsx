import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { theme } from "@/theme";
import { useAuthStore } from "@/store/authStore";
import { getCalendarEventsForUser } from "@/lib/firebase";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatMonthYear,
  isSameDay,
  DAYS_OF_WEEK,
} from "@/lib/calendarUtils";
import { CalendarEvent } from "@/lib/types";

export default function CalendarScreen() {
  const { user } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        if (user?.id) {
          const userEvents = await getCalendarEventsForUser(user.id);
          setEvents(userEvents);
        }
      } catch (error) {
        console.error("Error loading events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, [user?.id]);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const hasEventOnDate = (day: number): boolean => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return events.some((event) => isSameDay(new Date(event.date), dateToCheck));
  };

  const getEventsForDate = (day: number) => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    return events.filter((event) =>
      isSameDay(new Date(event.date), dateToCheck),
    );
  };

  const handlePreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
    setSelectedDate(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
    setSelectedDate(null);
  };

  const selectedDateEvents = selectedDate
    ? getEventsForDate(selectedDate.getDate())
    : [];

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Month Navigation */}
      <View style={styles.monthHeader}>
        <Pressable onPress={handlePreviousMonth}>
          <Text style={styles.navButton}>← Prev</Text>
        </Pressable>

        <Text style={styles.monthTitle}>{formatMonthYear(currentDate)}</Text>

        <Pressable onPress={handleNextMonth}>
          <Text style={styles.navButton}>Next →</Text>
        </Pressable>
      </View>

      {/* Day Labels */}
      <View style={styles.daysHeader}>
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} style={styles.dayLabelCell}>
            <Text style={styles.dayLabel}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {days.map((day, index) => {
          const isToday =
            day &&
            isSameDay(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
              new Date(),
            );
          const isSelected =
            day &&
            selectedDate &&
            day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth();

          return (
            <Pressable
              key={index}
              style={[
                styles.dayCell,
                !day && styles.emptyCell,
                isToday && styles.todayCell,
                isSelected && styles.selectedCell,
              ]}
              onPress={() => {
                if (day) {
                  setSelectedDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day,
                    ),
                  );
                }
              }}
            >
              {day && (
                <>
                  <Text
                    style={[
                      styles.dayNumber,
                      isToday && styles.todayNumber,
                      isSelected && styles.selectedNumber,
                    ]}
                  >
                    {day}
                  </Text>
                  {hasEventOnDate(day) && (
                    <View style={styles.eventIndicator} />
                  )}
                </>
              )}
            </Pressable>
          );
        })}
      </View>

      {/* Selected Date Events */}
      {selectedDate && (
        <View style={styles.eventsSection}>
          <Text style={styles.eventsTitle}>
            Events for{" "}
            {selectedDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Text>

          {selectedDateEvents.length === 0 ? (
            <Text style={styles.noEventsText}>No events on this date</Text>
          ) : (
            <View style={styles.eventsList}>
              {selectedDateEvents.map((event, index) => (
                <View key={index} style={styles.eventCard}>
                  <View style={styles.eventType}>
                    <Text style={styles.eventTypeText}>
                      {event.type === "weigh_in" && "⚖️"}
                      {event.type === "course_completion" && "🎉"}
                      {event.type === "lesson_completion" && "✓"}
                      {event.type === "session_booking" && "📅"}
                    </Text>
                  </View>
                  <View style={styles.eventContent}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    {event.description && (
                      <Text style={styles.eventDescription}>
                        {event.description}
                      </Text>
                    )}
                    {event.time && (
                      <Text style={styles.eventTime}>{event.time}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  navButton: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  daysHeader: {
    flexDirection: "row",
    marginVertical: theme.spacing.lg,
  },
  dayLabelCell: {
    flex: 1,
    alignItems: "center",
  },
  dayLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: theme.spacing.lg,
  },
  dayCell: {
    width: "14.28%",
    aspectRatio: 1,
    borderRadius: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: "transparent",
  },
  emptyCell: {
    backgroundColor: "transparent",
  },
  todayCell: {
    backgroundColor: theme.colors.primary + "20",
    borderColor: theme.colors.primary,
  },
  selectedCell: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  todayNumber: {
    color: theme.colors.primary,
  },
  selectedNumber: {
    color: "white",
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.primary,
    marginTop: 2,
  },
  eventsSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  noEventsText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: "italic",
  },
  eventsList: {
    gap: theme.spacing.md,
  },
  eventCard: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  eventType: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  eventTypeText: {
    fontSize: 18,
  },
  eventContent: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  eventDescription: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  eventTime: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: "600",
  },
  spacer: {
    height: theme.spacing.xl,
  },
});
