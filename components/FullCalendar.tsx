import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
} from "react-native";
import { useState } from "react";
import { theme } from "@/theme";
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  formatMonthYear,
  DAYS_OF_WEEK,
  isSameDay,
} from "@/lib/calendarUtils";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export interface CalendarEvent {
  date: Date;
  title: string;
  type: "health" | "lesson" | "meal" | "session";
  description?: string;
}

interface FullCalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

export function FullCalendar({ events = [], onDateSelect }: FullCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysArray = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDate = (day: number): CalendarEvent[] => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return events.filter((event) => isSameDay(event.date, dateToCheck));
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1),
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1),
    );
  };

  const handleDateSelect = (day: number) => {
    const selectedDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    setSelectedDate(selectedDay);
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length > 0) {
      setShowEventModal(true);
    }
    onDateSelect?.(selectedDay);
  };

  const getEventColor = (type: string): string => {
    switch (type) {
      case "health":
        return "#4CAF50"; // Green
      case "lesson":
        return "#2196F3"; // Blue
      case "meal":
        return "#FF9800"; // Orange
      case "session":
        return "#9C27B0"; // Purple
      default:
        return theme.colors.primary;
    }
  };

  const eventDayNumbers = new Set(
    events
      .map((event) => {
        if (
          isSameDay(
            event.date,
            new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
          )
        ) {
          const d = new Date(event.date);
          if (
            d.getMonth() === currentDate.getMonth() &&
            d.getFullYear() === currentDate.getFullYear()
          ) {
            return d.getDate();
          }
        }
        return null;
      })
      .filter((n) => n !== null),
  ) as Set<number>;

  return (
    <View style={styles.container}>
      {/* Header with month navigation */}
      <View style={styles.headerContainer}>
        <Pressable onPress={handlePrevMonth} style={styles.navButton}>
          <MaterialIcons
            name="chevron-left"
            size={24}
            color={theme.colors.text}
          />
        </Pressable>
        <Text style={styles.monthYearText}>{formatMonthYear(currentDate)}</Text>
        <Pressable onPress={handleNextMonth} style={styles.navButton}>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={theme.colors.text}
          />
        </Pressable>
      </View>

      {/* Day labels */}
      <View style={styles.daysOfWeekContainer}>
        {DAYS_OF_WEEK.map((day) => (
          <View key={day} style={styles.dayOfWeekCell}>
            <Text style={styles.dayOfWeekLabel}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <ScrollView
        style={styles.calendarGrid}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.calendarGridContent}>
          {/* Empty cells for days before month starts */}
          {emptyDaysArray.map((_, index) => (
            <View key={`empty-${index}`} style={styles.dayCell} />
          ))}

          {/* Days of month */}
          {daysArray.map((day) => {
            const isToday =
              day === new Date().getDate() &&
              currentDate.getMonth() === new Date().getMonth() &&
              currentDate.getFullYear() === new Date().getFullYear();

            const dayEvents = getEventsForDate(day);
            const hasEvents = dayEvents.length > 0;

            return (
              <Pressable
                key={`day-${day}`}
                style={[styles.dayCell, isToday && styles.todayCell]}
                onPress={() => handleDateSelect(day)}
              >
                <View style={styles.dayCellContent}>
                  <Text
                    style={[styles.dayNumber, isToday && styles.todayNumber]}
                  >
                    {day}
                  </Text>

                  {/* Event indicators */}
                  {hasEvents && (
                    <View style={styles.eventIndicatorsContainer}>
                      {dayEvents.slice(0, 2).map((event, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.eventDot,
                            { backgroundColor: getEventColor(event.type) },
                          ]}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <Text style={styles.moreEventsText}>
                          +{dayEvents.length - 2}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Event details modal */}
      <Modal
        visible={showEventModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEventModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowEventModal(false)}
        >
          <View style={styles.modalContent}>
            <Pressable
              onPress={() => setShowEventModal(false)}
              style={styles.closeButton}
            >
              <MaterialIcons name="close" size={24} color={theme.colors.text} />
            </Pressable>

            {selectedDate && (
              <>
                <Text style={styles.modalTitle}>
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </Text>

                <View style={styles.eventsList}>
                  {selectedDate &&
                    getEventsForDate(selectedDate.getDate()).map(
                      (event, idx) => (
                        <View key={idx} style={styles.eventItem}>
                          <View
                            style={[
                              styles.eventTypeIndicator,
                              { backgroundColor: getEventColor(event.type) },
                            ]}
                          />
                          <View style={styles.eventTextContainer}>
                            <Text style={styles.eventItemTitle}>
                              {event.title}
                            </Text>
                            {event.description && (
                              <Text style={styles.eventItemDescription}>
                                {event.description}
                              </Text>
                            )}
                            <Text style={styles.eventTypeLabel}>
                              {event.type.charAt(0).toUpperCase() +
                                event.type.slice(1)}
                            </Text>
                          </View>
                        </View>
                      ),
                    )}
                </View>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
    paddingHorizontal: theme.spacing.sm,
  },
  navButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
  },
  daysOfWeekContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  dayOfWeekCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
  },
  dayOfWeekLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: theme.colors.textSecondary,
  },
  calendarGrid: {
    flex: 1,
  },
  calendarGridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: theme.spacing.sm,
  },
  dayCell: {
    width: "14.28%", // 7 columns
    aspectRatio: 1,
    padding: theme.spacing.xs,
    justifyContent: "center",
    alignItems: "center",
  },
  dayCellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.xs,
  },
  todayCell: {},
  dayNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  todayNumber: {
    backgroundColor: theme.colors.primary,
    color: "white",
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.spacing.sm,
    overflow: "hidden",
  },
  eventIndicatorsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    gap: 2,
  },
  eventDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  moreEventsText: {
    fontSize: 8,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.lg,
    padding: theme.spacing.lg,
    width: "80%",
    maxHeight: "80%",
  },
  closeButton: {
    alignSelf: "flex-end",
    padding: theme.spacing.sm,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
  },
  eventsList: {
    gap: theme.spacing.md,
  },
  eventItem: {
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    borderRadius: theme.spacing.md,
    padding: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  eventTypeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.md,
    marginTop: 4,
  },
  eventTextContainer: {
    flex: 1,
  },
  eventItemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 4,
  },
  eventItemDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  eventTypeLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: theme.colors.primary,
  },
});
