# Level-Up System Integration Guide

## Overview

The Level-Up System tracks client progress through completed courses and automatically awards levels. Each course completion increases the user level.

**Level Progression:**

- Level 1: 0 courses completed (initial)
- Level 2: 1 course completed
- Level 3: 2 courses completed
- Level 4: 3 courses completed
- Level 5+: 4+ courses completed (Mythic tier)

## Components & Files

### Data Types (`lib/types.ts`)

- `UserLevelInfo` - Client's current level, progress, and history
- `LevelUpEvent` - Event triggered when user levels up
- Extended `ClientProfile` with `userLevel` and `completedCourses`

### Firebase Functions (`lib/firebase.ts`)

- `completeLesson(clientId, courseId, lessonId)` - Mark lesson as complete
- `completeCourse(clientId, courseId)` - Mark course as complete (triggers level-up if applicable)
- `getUserLevelInfo(clientId)` - Get user's level, progress, and history
- `getLevelUpEvents(userId)` - Get list of recent level-up events
- `createLevelUpEvent(userId, oldLevel, newLevel)` - Create level-up notification

### UI Components

- `LevelBadge.tsx` - Displays level with color-coded tier (Bronze → Mythic)
- `LevelUpNotification.tsx` - Animated notification shown when user levels up

### Utility Functions (`lib/levelUpUtils.ts`)

- `handleLessonCompletion()` - Wrapper for lesson completion
- `handleCourseCompletion()` - Wrapper for course completion
- `getUserLevel()` - Retrieve user's level info
- `checkRecentLevelUp()` - Check if user recently leveled up
- `getLevelDisplay()` - Get level display info (name, emoji, color)
- `calculateLevelProgress()` - Calculate progress percentage to next level

## Integration Points

### 1. Lesson Completion (lesson-detail.tsx)

When user finishes a lesson and completes the checklist:

```typescript
import { handleLessonCompletion } from "@/lib/levelUpUtils";

// In your lesson completion handler:
const success = await handleLessonCompletion(clientId, courseId, lessonId);
if (success) {
  // Refresh course progress
  // System automatically checks if course is complete
}
```

### 2. Home Screen (home.tsx)

Already implemented - shows level badge in header and checks for recent level-ups.

```typescript
// Level badge shows current user level
<LevelBadge level={user.userLevel || 1} size="medium" />

// Level-up notification appears automatically
<LevelUpNotification
  visible={showLevelUp}
  newLevel={newLevel}
  onDismiss={() => setShowLevelUp(false)}
/>
```

### 3. Profile Screen (profile.tsx)

Already implemented - shows detailed level info.

```typescript
// Displays:
// - Current level with tier name
// - Number of completed courses
// - Progress to next level
// - Achievement history (last 5 level-ups)
```

### 4. Course Completion View

When all lessons in a course are complete, trigger:

```typescript
import { handleCourseCompletion } from "@/lib/levelUpUtils";

const success = await handleCourseCompletion(clientId, courseId);
if (success) {
  // Refresh user profile to reflect new level
  // Level-up notification will show automatically
}
```

## Level Tier Colors & Emojis

| Level | Tier    | Color   | Emoji |
| ----- | ------- | ------- | ----- |
| 1     | Bronze  | #8B7355 | 🥉    |
| 2     | Silver  | #C0C0C0 | 🥈    |
| 3     | Gold    | #FFD700 | 🥇    |
| 4     | Diamond | #00D9FF | 💎    |
| 5+    | Mythic  | #FF00FF | 👑    |

## Data Flow

1. **Course Completion:**

   ```
   completeCourse()
     → Updates course_progress with completedAt timestamp
     → Adds courseId to client's completedCourses array
     → Calculates new level based on course count
     → If level > previous level: createLevelUpEvent()
     → Updates userLevel in ClientProfile
   ```

2. **Level-Up Notification:**

   ```
   createLevelUpEvent()
     → Creates document in level_up_events collection
     → Stores previousLevel, newLevel, timestamp
     → Updates client's levelUpHistory (keeps last 10)
   ```

3. **UI Display:**

   ```
   Home Screen:
     → Calls getLevelUpEvents() on mount
     → Shows notification if event < 2 seconds old
     → Displays LevelBadge from user.userLevel

   Profile Screen:
     → Calls getUserLevelInfo() on component load
     → Shows Achievement History from levelUpHistory
   ```

## Firestore Structure

### Collection: level_up_events

```
{
  id: "level_up_{userId}_{timestamp}",
  userId: string,
  previousLevel: number,
  newLevel: number,
  timestamp: number,
  message: string,
  read: boolean
}
```

### ClientProfile fields:

```
{
  ...existingFields,
  userLevel: number,
  completedCourses: [courseId1, courseId2, ...],
  lastLevelUpAt: number (optional),
  levelUpHistory: [
    { level: number, achievedAt: number },
    ...
  ]
}
```

### Collection: course_progress (nested under clients/{clientId})

```
{
  clientId: string,
  courseId: string,
  enrolledAt: number,
  completedAt: number (when course finished),
  completionPercentage: 100,
  lessonsCompleted: number,
  totalLessons: number
}
```

## Testing the System

1. **Local Testing:**
   - Create test client account
   - Enroll in a course
   - Call `completeCourse()` directly from console
   - Verify level increases and notification shows

2. **Verify Data:**
   - Check Firestore `level_up_events` collection
   - Confirm `completedCourses` array updated
   - Verify `userLevel` incremented

3. **UI Verification:**
   - Level badge displays correctly on home/profile
   - Level-up notification animates in smoothly
   - Achievement history shows in profile

## Future Enhancements

- [ ] Level-specific rewards (badges, certificates)
- [ ] Level leaderboard for competition
- [ ] Special achievements for milestones (Level 10, 25, etc.)
- [ ] XP system with fractional progress towards next level
- [ ] Level-up animations and sound effects
- [ ] Email notifications for level-ups
