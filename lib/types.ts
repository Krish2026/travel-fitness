// User Types
export type UserRole = "client" | "trainer";

export interface BaseUser {
  id: string;
  role: UserRole;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: number;
  updatedAt: number;
}

export interface ClientProfile extends BaseUser {
  role: "client";
  weight: number; // lbs
  height: number; // inches
  age: number;
  gender: "male" | "female" | "other";
  bodyFatPercentage: number;
  musclePercentage: number;
  goalWeight: number;
  goalDescription: string;
  trainerId: string; // FK to trainer
  enrolledCourses: string[]; // array of courseIds
  userLevel: number; // calculated from completed courses
  completedCourses: string[]; // array of completed courseIds
}

export interface TrainerProfile extends BaseUser {
  role: "trainer";
  bio: string;
  specialties: string[];
  themeColor: string; // hex color code
  isVerified: boolean;
}

// Trainer Settings
export interface TrainerSettings {
  trainerId: string;
  isChatEnabled: boolean;
  themeColor?: string;
  notifications?: {
    newMessages: boolean;
    courseEnrollments: boolean;
  };
  updatedAt?: number;
}

// Health Tracking
export interface HealthEntry {
  id: string;
  clientId: string;
  weight: number; // lbs
  height: number; // inches
  bodyFatPercentage: number;
  musclePercentage: number;
  timestamp: number;
  notes?: string;
  progressPercentage?: number; // calculated
}

// Course & Lessons
export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  order: number;
  completedAt?: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  videoThumbnail?: string;
  videoDuration: number; // seconds
  checklist: ChecklistItem[];
  order: number; // 1-10
  createdAt: number;
  updatedAt: number;
}

export interface Course {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  thumbnail?: string;
  lessons: Lesson[];
  totalLessons: number;
  createdAt: number;
  updatedAt: number;
}

// Lesson progress - tracks client's progress through lessons
export interface LessonProgress {
  clientId: string;
  courseId: string;
  lessonId: string;
  startedAt: number;
  completedAt?: number;
  checklistProgress: {
    itemId: string;
    completed: boolean;
    completedAt?: number;
  }[];
  completionPercentage: number;
}

export interface ClientCourseProgress {
  clientId: string;
  courseId: string;
  enrolledAt: number;
  completedAt?: number;
  completionPercentage: number;
  lessonsCompleted: number;
  totalLessons: number;
}

// User Level Tracking
export interface UserLevelInfo {
  userId: string;
  currentLevel: number;
  completedCourses: number;
  nextLevelRequirement: number;
  progressToNextLevel: number; // percentage
  totalCompletedCourses: string[]; // array of completed course IDs
  lastLevelUpAt?: number;
  levelUpHistory: {
    level: number;
    achievedAt: number;
  }[];
}

export interface LevelUpEvent {
  id: string;
  userId: string;
  previousLevel: number;
  newLevel: number;
  timestamp: number;
  message: string;
  read: boolean;
}

// Posts & Community
export type PostType = "video" | "image" | "text";

// Meal Plans
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

export interface Post {
  id: string;
  trainerId: string;
  type: PostType;
  content: string;
  caption?: string;
  media: {
    url: string;
    type: "image" | "video";
  }[];
  hashtags: string[];
  taggedUsers: string[];
  location?: string;
  timestamp: number;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
  likes: number;
}

// Messages & Chat
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  type: "text" | "emoji";
  timestamp: number;
  edited?: boolean;
  editedAt?: number;
}

// Calendar
export type CalendarEventType =
  | "weigh_in"
  | "course_completion"
  | "lesson_completion"
  | "session_booking";

export interface CalendarEvent {
  id: string;
  userId: string;
  type: CalendarEventType;
  title: string;
  description?: string;
  date: number; // timestamp
  time?: string;
  relatedEntity?: {
    entityType: string; // 'course', 'lesson', 'health_entry', etc
    entityId: string;
  };
}

// Auth State
export interface AuthState {
  user: (ClientProfile | TrainerProfile) | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
