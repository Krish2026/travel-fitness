import { View, Text } from "react-native";
import { FullCalendar, CalendarEvent } from "@/components/FullCalendar";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { theme } from "@/theme";

export default function CalendarScreen() {
  const { userId } = useAuthStore();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      if (!userId) return;

      try {
        const eventsArray: CalendarEvent[] = [];

        // Load health entries (weigh-ins)
        const healthEntriesRef = collection(
          db,
          "clients",
          userId,
          "healthEntries",
        );
        const healthSnaps = await getDocs(healthEntriesRef);
        healthSnaps.forEach((doc) => {
          const data = doc.data();
          eventsArray.push({
            date: new Date(data.timestamp),
            title: `Weight: ${data.weight} lbs`,
            type: "health",
            description: data.notes,
          });
        });

        // Load course lessons (completed lessons)
        const courseProgressRef = collection(
          db,
          "clients",
          userId,
          "courseProgress",
        );
        const courseSnaps = await getDocs(courseProgressRef);
        courseSnaps.forEach((doc) => {
          const data = doc.data();
          if (data.completedAt) {
            eventsArray.push({
              date: new Date(data.completedAt),
              title: `Lesson Completed: ${data.lessonTitle || "Untitled"}`,
              type: "lesson",
              description: data.courseName,
            });
          }
        });

        // Load session bookings
        const sessionsRef = collection(db, "clients", userId, "sessions");
        const sessionSnaps = await getDocs(sessionsRef);
        sessionSnaps.forEach((doc) => {
          const data = doc.data();
          eventsArray.push({
            date: new Date(data.scheduledDate),
            title: `Training Session`,
            type: "session",
            description: data.notes,
          });
        });

        setEvents(eventsArray);
      } catch (error) {
        console.error("Error loading calendar events:", error);
      }
    };

    loadEvents();
  }, [userId]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FullCalendar events={events} />
    </View>
  );
}
