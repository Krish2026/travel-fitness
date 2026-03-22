# Firestore Schema Documentation - Phase 0.2

This document outlines the complete Firestore database schema for the Travel Fitness app.

## Collections Overview

```
users/
  ├── {userId}/
  │   ├── stats/
  │   │   └── entries
  │   └── courseProgress/
  │       └── {courseId}/
  │           └── lessonProgress/
  │               └── {lessonId}
  │
courses/
  ├── {courseId}/
  │   ├── lessons/
  │   │   └── {lessonId}
  │   ├── chatMessages/
  │   │   └── {messageId}
  │   └── posts/
  │       └── {postId}
```

## Detailed Collection Schemas

### 1. Users Collection (`/users/{userId}`)

Stores user account information and profile data.

```javascript
{
  uid: string,                              // User ID (from Firebase Auth)
  email: string,                            // User email
  displayName: string,                      // User's display name
  role: "client" | "trainer",               // User role
  createdAt: Timestamp,                     // Account creation date
  updatedAt: Timestamp,                     // Last update date

  // Client-specific fields
  profileComplete: boolean,                 // Is profile setup complete?
  stats: {
    currentWeight: number,                  // Current weight (lbs/kg)
    goalWeight: number,                     // Target weight
    height: number,                         // Height (inches/cm)
    age: number,                            // Age
    gender: "male" | "female" | "other",    // Gender
    bodyFatPercentage: number,              // Body fat %
    musclePercentage: number,               // Muscle %
  },
  goalDescription: string,                  // User's fitness goal description
  enrolledCourses: [                        // Array of enrolled courses
    {
      courseId: string,
      enrolledAt: Timestamp,
    }
  ],
  level: number,                            // User level based on progress
  progressEntries: [                        // Historical stat entries
    {
      currentWeight: number,
      bodyFatPercentage: number,
      musclePercentage: number,
      timestamp: Timestamp,
    }
  ],

  // Trainer-specific fields
  specialty: string,                        // Trainer's specialty (e.g., "CrossFit")
  bio: string,                              // Trainer bio/description
  profilePictureUrl: string,                // URL to trainer's profile picture
  courses: [string],                        // Array of course IDs created by trainer
  settings: {
    themeColor: string,                     // Hex color for course theme
    communityChatEnabled: boolean,          // Can clients see/post in community?
  },
}
```

### 2. Courses Collection (`/courses/{courseId}`)

Stores course information created by trainers.

```javascript
{
  trainerId: string,                        // ID of trainer who created course
  name: string,                             // Course name
  description: string,                      // Course description
  imageUrl: string,                         // Course cover image URL
  lessons: [string],                        // Array of lesson IDs (if embedded)
  enrolledUsers: [string],                  // Array of user IDs enrolled
  createdAt: Timestamp,
  updatedAt: Timestamp,
}
```

### 3. Lessons Subcollection (`/courses/{courseId}/lessons/{lessonId}`)

Stores individual lessons within a course.

```javascript
{
  title: string,                            // Lesson title
  description: string,                      // Lesson description
  videoUrl: string,                         // URL to lesson video in Storage
  checklist: [                              // Checklist items for lesson
    {
      id: string,
      text: string,
      completed: boolean,                   // User's completion status
    }
  ],
  order: number,                            // Lesson order in course (0-9)
  createdAt: Timestamp,
}
```

### 4. User Course Progress (`/users/{userId}/courseProgress/{courseId}`)

Tracks user's progress in a specific course.

```javascript
{
  // This document contains references to lessons
  // Actual progress tracked in lessonProgress subcollection
}
```

### 5. Lesson Progress Subcollection (`/users/{userId}/courseProgress/{courseId}/lessonProgress/{lessonId}`)

Tracks user's progress in a specific lesson.

```javascript
{
  completed: boolean,                       // Is lesson fully completed?
  checklistProgress: [                      // User's checklist progress
    {
      id: string,
      text: string,
      completed: boolean,
    }
  ],
  lastUpdated: Timestamp,
}
```

### 6. Chat Messages Subcollection (`/courses/{courseId}/chatMessages/{messageId}`)

Stores community chat messages.

```javascript
{
  userId: string,                           // Sender's user ID
  displayName: string,                      // Sender's display name
  message: string,                          // Message content
  timestamp: Timestamp,
  edited: boolean,                          // Was message edited?
}
```

### 7. Posts Subcollection (`/courses/{courseId}/posts/{postId}`)

Stores trainer posts in the course feed.

```javascript
{
  userId: string,                           // Trainer's user ID
  displayName: string,                      // Trainer's display name
  caption: string,                          // Post caption/text
  type: "text" | "image" | "video",         // Type of post
  mediaUrl: string,                         // URL to media in Storage (if image/video)
  hashtags: [string],                       // Array of hashtags (e.g., ["workout", "motivation"])
  taggedUsers: [string],                    // Array of tagged user IDs
  location: string,                         // Location (e.g., "New York, NY")
  likes: [string],                          // Array of user IDs who liked
  comments: [                               // Comments on post
    {
      userId: string,
      displayName: string,
      text: string,
      timestamp: Timestamp,
    }
  ],
  timestamp: Timestamp,
  edited: boolean,
}
```

### 8. User Stats Subcollection (`/users/{userId}/stats/{statsId}`)

Stores historical health stat entries.

```javascript
{
  entries: {
    {
      timestamp: Timestamp,
      currentWeight: number,
      bodyFatPercentage: number,
      musclePercentage: number,
      // ... other metrics
    }
  }
}
```

## Indexes (Firestore)

The following indexes should be created in Firestore Console or are auto-created:

- `courses`: `trainerId` (for filtering trainer's courses)
- `chatMessages`: `timestamp` (for sorting messages)
- `posts`: `timestamp` (for sorting posts)
- `users.enrolledCourses`: `courseId` (for checking enrollment)

## Storage Buckets Structure

```
Firebase Storage (travel-fitness-xxxxx.appspot.com)
├── profile_pictures/
│   └── {userId}/
│       └── profile_*.jpg
├── courses/
│   └── {courseId}/
│       ├── lessons/
│       │   └── {lessonId}/
│       │       └── video_*.mp4
│       └── posts/
│           └── {postId}/
│               ├── image_*.jpg
│               └── video_*.mp4
```

## Data Types Reference

- **string**: Text (max 1MB per doc)
- **number**: Integer or float
- **boolean**: True/False
- **Timestamp**: Server time (auto-set with `serverTimestamp()`)
- **array**: List of values (max 20KB per field)
- **object/map**: Nested object

## Naming Conventions

- Collection names: lowercase plural (`users`, `courses`, `posts`)
- Document IDs: auto-generated by Firestore (UUID) or custom IDs
- Field names: camelCase (`displayName`, `enrolledAt`)
- Sub-collections: lowercase plural

## Size Limits

- Max document size: 1MB
- Max array elements: Unlimited, but recommend < 100 per field
- Max collection refs: Nested subcollections recommended

## Best Practices Implemented

1. **Denormalization**: Some data (like `displayName`) duplicated for performance
2. **Subcollections**: Used for scalable nested data (lessons, messages, progress)
3. **Arrays vs Subcollections**:
   - Small, bounded data → Arrays
   - Large, unbounded → Subcollections
4. **Timestamp fields**: All timestamps server-set for consistency
5. **User isolation**: Progress and stats are user-specific

## Migration Path (Phase 2)

When adding multiple trainers and payments:

Add to Courses:

```javascript
price: number,                              // Course price
paymentRequired: boolean,                   // Is payment required?
```

Add to Users:

```javascript
purchasedCourses: [
  // Paid courses
  {
    courseId: string,
    purchasedAt: Timestamp,
    expiresAt: Timestamp, // Subscription expiry
  },
];
```

Add new Payments collection:

```javascript
{
  userId: string,
  courseId: string,
  amount: number,
  currency: string,
  stripePaymentId: string,
  status: "pending" | "completed" | "failed",
  createdAt: Timestamp,
}
```

## Testing the Schema

Use Firestore Console to:

1. Create test documents matching this schema
2. Verify rules allow proper read/write
3. Test queries and pagination
4. Monitor database usage and costs
