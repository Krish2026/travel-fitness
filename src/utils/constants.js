// App-wide constants

export const COLORS = {
  primary: "#FF6B6B",
  secondary: "#4ECDC4",
  dark: "#1A1A1A",
  light: "#F7F7F7",
  gray: "#6B6B6B",
  white: "#FFFFFF",
  success: "#2ECC71",
  warning: "#F39C12",
  error: "#E74C3C",
};

export const SIZES = {
  small: 8,
  medium: 12,
  large: 16,
  xLarge: 24,
  xxLarge: 32,
};

export const FONT_SIZES = {
  xSmall: 10,
  small: 12,
  medium: 14,
  large: 16,
  xLarge: 20,
  xxLarge: 24,
  xxxLarge: 32,
};

export const USER_ROLES = {
  CLIENT: "client",
  TRAINER: "trainer",
};

export const TRAINER_PASSWORD = process.env.TRAINER_PASSWORD || "demo123";

export const FIRESTORE_COLLECTIONS = {
  USERS: "users",
  COURSES: "courses",
  ENROLLMENTS: "enrollments",
  LESSONS: "lessons",
  POSTS: "posts",
  CHAT_MESSAGES: "chatMessages",
  PROGRESS: "progress",
};

export const MAX_LESSONS_PER_COURSE = 10;
