import {
  completeLesson,
  completeCourse,
  getUserLevelInfo,
  getLevelUpEvents,
} from "@/lib/firebase";

/**
 * Complete a lesson and check if course is done
 * Called when user finishes watching a lesson and completes checklist
 */
export async function handleLessonCompletion(
  clientId: string,
  courseId: string,
  lessonId: string,
): Promise<boolean> {
  try {
    await completeLesson(clientId, courseId, lessonId);
    return true;
  } catch (error) {
    console.error("Error completing lesson:", error);
    return false;
  }
}

/**
 * Manually complete a course
 * Called from trainer dashboard or when marking completion
 */
export async function handleCourseCompletion(
  clientId: string,
  courseId: string,
): Promise<boolean> {
  try {
    await completeCourse(clientId, courseId);
    return true;
  } catch (error) {
    console.error("Error completing course:", error);
    return false;
  }
}

/**
 * Get user's current level and progress
 * Used on profile and home screens
 */
export async function getUserLevel(clientId: string) {
  try {
    return await getUserLevelInfo(clientId);
  } catch (error) {
    console.error("Error getting user level:", error);
    return null;
  }
}

/**
 * Check for recent level-ups (last 5 seconds)
 * Used to show notifications
 */
export async function checkRecentLevelUp(
  clientId: string,
): Promise<{ hasLeveledUp: boolean; newLevel?: number; timestamp?: number }> {
  try {
    const events = await getLevelUpEvents(clientId);
    if (events.length === 0) {
      return { hasLeveledUp: false };
    }

    const latestEvent = events[0];
    const now = Date.now();
    const timeSinceLastEvent = now - latestEvent.timestamp;

    if (timeSinceLastEvent < 5000) {
      // Show notification within 5 seconds
      return {
        hasLeveledUp: true,
        newLevel: latestEvent.newLevel,
        timestamp: latestEvent.timestamp,
      };
    }

    return { hasLeveledUp: false };
  } catch (error) {
    console.error("Error checking level-up:", error);
    return { hasLeveledUp: false };
  }
}

/**
 * Get level display name and color
 */
export function getLevelDisplay(level: number) {
  const displays = {
    1: { name: "Bronze", emoji: "🥉", color: "#8B7355" },
    2: { name: "Silver", emoji: "🥈", color: "#C0C0C0" },
    3: { name: "Gold", emoji: "🥇", color: "#FFD700" },
    4: { name: "Diamond", emoji: "💎", color: "#00D9FF" },
    5: { name: "Mythic", emoji: "👑", color: "#FF00FF" },
  };

  return displays[Math.min(level, 5) as keyof typeof displays] || displays[5];
}

/**
 * Calculate progress percentage to next level
 */
export function calculateLevelProgress(
  completedCourses: number,
  coursesForNextLevel: number,
): number {
  if (coursesForNextLevel === 0) return 0;
  const progress = (completedCourses / coursesForNextLevel) * 100;
  return Math.min(progress, 99); // Show 99% max until next level
}
