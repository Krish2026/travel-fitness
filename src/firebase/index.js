// Firebase Operations Index
// Convenience exports for all Firebase modules

export * from "./auth";
export * from "./courses";
export * from "./enrollments";
export * from "./posts";
export * from "./storage";

// Re-export individual modules for specific imports
import * as authModule from "./auth";
import * as coursesModule from "./courses";
import * as enrollmentsModule from "./enrollments";
import * as postsModule from "./posts";
import * as storageModule from "./storage";

export {
  authModule,
  coursesModule,
  enrollmentsModule,
  postsModule,
  storageModule,
};

export default {
  auth: authModule,
  courses: coursesModule,
  enrollments: enrollmentsModule,
  posts: postsModule,
  storage: storageModule,
};
