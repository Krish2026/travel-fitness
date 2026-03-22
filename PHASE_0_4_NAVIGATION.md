# Phase 0.4: Navigation Structure
## Complete Navigation Architecture for Travel Fitness App

---

## Overview

Phase 0.4 establishes a comprehensive navigation system using React Navigation with role-based conditional rendering. The navigation structure handles three distinct flows:
1. **Auth Flow** - For unauthenticated users (login, signup, password reset)
2. **Client Flow** - Tab-based navigation for fitness consumers
3. **Trainer Flow** - Tab-based navigation for fitness instructors

## Architecture Components

### 1. **Root Navigator** (`src/navigation/RootNavigator.js`)

Main conditional navigator that routes between auth and authenticated flows.

**Conditional Logic:**
- If `loading` → Show loading spinner
- If `!isAuthenticated` → Render AuthNavigator
- If `user.role === "trainer"` → Render TrainerNavigator
- Else → Render ClientNavigator

**Dependencies:**
- `useAuthContext()` for user state
- `NavigationContainer` from @react-navigation/native

---

### 2. **Auth Navigator** (`src/navigation/AuthNavigator.js`)

Stack navigator for unauthenticated user flows.

**Screens:**
- `RoleSelectScreen` - Choose between Client and Trainer roles
- `LoginScreen` - Login to existing account
- `SignUpScreen` - Create new account (role-specific)
- `ForgotPasswordScreen` - Password reset flow

**Navigation:**
- Standard stack navigation with slide transitions
- No header (custom header in each screen if needed)

---

### 3. **Client Navigator** (`src/navigation/ClientNavigator.js`)

Tab-based navigation for authenticated client users.

**Tab Screens:**
1. **Explore** (Stack)
   - ExploreCoursesScreen (main)
   - CourseDetailScreen (detail)

2. **My Courses** (Stack)
   - MyCoursesScreen (main)
   - LearnScreen (lesson content)
   - ProgressScreen (progress tracking)

3. **Messages** (Stack)
   - MessageCenterScreen (conversations)

4. **Account** (Stack)
   - AccountSettingsScreen (main)
   - ProfileScreen (user profile)

**Tab Icons:** Uses Ionicons from @expo/vector-icons

**Colors:**
- Active tab: #3b82f6 (blue)
- Inactive tab: #9ca3af (gray)

---

### 4. **Trainer Navigator** (`src/navigation/TrainerNavigator.js`)

Tab-based navigation for authenticated trainer users.

**Tab Screens:**
1. **Courses** (Stack)
   - ManageCoursesScreen (main)
   - CreateCourseScreen (create new)
   - EditCourseScreen (edit existing)

2. **Students** (Stack)
   - ManageStudentsScreen (main)
   - StudentDetailScreen (student info)
   - StudentProgressScreen (student progress)

3. **Earnings** (Stack)
   - EarningsScreen (earnings & payments)

4. **Messages** (Stack)
   - MessageCenterScreen (student conversations)

5. **Profile** (Stack)
   - ProfileSettingsScreen (trainer settings)

**Tab Icons:** Uses Ionicons from @expo/vector-icons

**Colors:** Same as client (blue active, gray inactive)

---

## Screen Components

### Auth Screens

#### **RoleSelectScreen**
- Choose between Client and Trainer roles
- Button-based role selection
- Link to existing account login

#### **LoginScreen**
- Email and password inputs
- Show/hide password toggle
- Forgot password link
- Error banner for failed logins
- Sign up link for new users

#### **SignUpScreen**
- First name, last name, email, password fields
- Password confirm field
- Role-specific messaging
- Validation (email format, password length, matching)
- Error handling

#### **ForgotPasswordScreen**
- Email input for password reset
- Two states: Input form and Success message
- Email validation

### Client Screens

#### **ExploreCoursesScreen**
- Search functionality
- Course card list (image placeholder, name, trainer, rating, price)
- Jump to CourseDetailScreen

#### **MyCoursesScreen**
- List of enrolled courses
- Progress bar per course
- Continue learning button
- Empty state when no courses

#### **CourseDetailScreen**
- Course header with image
- Trainer info and rating
- About section
- Stats (duration, lessons, students)
- What you'll learn list
- Price and enroll button

#### **LearnScreen**
- List of lessons
- Lesson status (completed/incomplete)
- Current lesson details
- Mark as complete button

#### **ProgressScreen**
- Overall progress bar
- Statistics (lessons completed, time spent, streak)
- Recent activity feed

#### **MessageCenterScreen**
- List of conversations with trainers/classmates
- Unread badges
- Conversation preview and timestamp

#### **AccountSettingsScreen**
- User profile card
- Notification preferences toggle
- Settings menu (profile, password, saved courses, order history)
- Help & support links
- Logout button

#### **ProfileScreen**
- Profile picture with edit button
- View/edit name and bio
- Stats (courses, learning time, certificates)

### Trainer Screens

#### **ManageCoursesScreen**
- Create new course button
- List of trainer's courses
- Stats per course (students, lessons, price)
- Edit course buttons

#### **ManageStudentsScreen**
- List of all enrolled students
- Student cards with progress bars
- Tap to view student details

#### **StudentDetailScreen**
- Student profile info
- Enrolled courses list
- Statistics (time spent, lessons, progress)
- Send message button

#### **StudentProgressScreen**
- Course-specific student progress
- Progress bar
- Lesson completion checklist
- Overall statistics (time, lessons, streak)

#### **EarningsScreen**
- Total earnings card
- Earnings breakdown stats
- Payment history
- Revenue per course

#### **MessageCenterScreen** (Trainer)
- List of student conversations
- Last message preview
- Timestamps

#### **ProfileSettingsScreen**
- Trainer profile info with rating
- Statistics (courses, students, earnings)
- Settings menu
- Certification management
- Payment settings
- Logout button

#### **CreateCourseScreen**
- Form for course name, description, price
- Validation on form fields
- Create course button

#### **EditCourseScreen**
- Prefilled form with existing course data
- Same fields as create
- Save changes button

---

## Data Flow & Navigation

### Auth to App Transition
```
User launches app
  ↓
AuthContext initializes + AsyncStorage check
  ↓
If user cached → isAuthenticated = true, loading = false
  ↓
RootNavigator renders based on user.role
  ↓
User sees either ClientNavigator or TrainerNavigator
```

### Login Flow
```
RoleSelectScreen
  ↓
Login to existing → LoginScreen
  → signIn() via AuthContext
  → On success: AuthContext sets isAuthenticated, user data
  → RootNavigator re-renders
  → ClientNavigator/TrainerNavigator mounts
```

### Signup Flow
```
RoleSelectScreen → "I'm a Client/Trainer"
  ↓
SignUpScreen (role passed as param)
  → Fill form → signUp() via AuthContext
  → Creates Firestore user document with role
  → AuthContext updates
  → Navigation to app

RoleSelectScreen → "Already have account?"
  ↓
LoginScreen (standard login)
```

---

## Installation & Setup

### Dependencies Installed in Phase 0.4

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/stack": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "react-native-screens": "^3.x",
  "react-native-safe-area-context": "^4.x",
  "react-native-gesture-handler": "^2.x",
  "expo": "^49.x (already installed)",
  "@expo/vector-icons": "^13.x"
}
```

### Navigation Setup in App.js
```jsx
<ErrorProvider>
  <AuthProvider>
    <StatusBar style="auto" />
    <RootNavigator />
  </AuthProvider>
</ErrorProvider>
```

---

## Key Features

### 1. **Role-Based Navigation**
Different UI/UX based on user role (client vs trainer) set during signup.

### 2. **Deep Linking Support** (future)
Navigation structure supports deep linking to specific screens.

### 3. **Loading States**
Root navigator shows loading spinner while auth state initializes.

### 4. **Error Handling**
ErrorContext integration with screens for displaying errors.

### 5. **Tab Navigation**
Bottom tab bar for main app navigation with icons and labels.

### 6. **Stack Navigation**
Nested stack navigators within tabs for nested screens.

### 7. **Screen Transitions**
Smooth animations between screens and stack transitions.

---

## File Structure

```
src/
├── navigation/
│   ├── RootNavigator.js (conditional, main router)
│   ├── AuthNavigator.js (stack for login/signup)
│   ├── ClientNavigator.js (tab + stack)
│   └── TrainerNavigator.js (tab + stack)
├── screens/
│   ├── auth/
│   │   ├── RoleSelectScreen.js
│   │   ├── LoginScreen.js
│   │   ├── SignUpScreen.js
│   │   └── ForgotPasswordScreen.js
│   ├── client/
│   │   ├── ExploreCoursesScreen.js
│   │   ├── MyCoursesScreen.js
│   │   ├── CourseDetailScreen.js
│   │   ├── LearnScreen.js
│   │   ├── ProgressScreen.js
│   │   ├── MessageCenterScreen.js
│   │   ├── AccountSettingsScreen.js
│   │   └── ProfileScreen.js
│   └── trainer/
│       ├── ManageCoursesScreen.js
│       ├── ManageStudentsScreen.js
│       ├── StudentDetailScreen.js
│       ├── StudentProgressScreen.js
│       ├── EarningsScreen.js
│       ├── MessageCenterScreen.js
│       ├── ProfileSettingsScreen.js
│       ├── CreateCourseScreen.js
│       └── EditCourseScreen.js
├── context/
│   ├── AuthContext.js (auth state)
│   └── ErrorContext.js (error state)
└── App.js (root with providers)
```

---

## Styling & UI

### Colors Used
- **Primary Blue**: #3b82f6 (buttons, active tabs, highlights)
- **Green**: #10b981 (success, completion)
- **Amber**: #f59e0b (warnings, stats)
- **Red**: #ef4444 (errors, logout)
- **Gray Scale**: #1f2937 (text), #6b7280 (secondary), #e5e7eb (borders)

### Common Components
- TouchableOpacity for buttons
- FlatList for lists
- ScrollView for content
- TextInput for forms
- Ionicons for all icons
- ActivityIndicator for loading

---

## Testing Navigation

### Manual Testing Checklist
- [ ] App loads without errors
- [ ] AuthContext initializes, checks AsyncStorage
- [ ] Show role select screen if not logged in
- [ ] Login flow works → navigates to app
- [ ] Client sees client navigator
- [ ] Trainer sees trainer navigator
- [ ] Tab switching works
- [ ] Stack navigation works (push/pop)
- [ ] Bottom tab icons are visible
- [ ] Screen titles display correctly
- [ ] Logout works → back to auth flow
- [ ] Errors display properly

### Test Scenarios
```javascript
1. Fresh Install (No cached user)
   App start → RoleSelectScreen → LoginScreen → App

2. Returning Client User
   App start → MyCoursesScreen (automatically)

3. Returning Trainer User
   App start → ManageCoursesScreen (automatically)

4. Login New Account
   RoleSelectScreen → SignUpScreen → Form fill → Create account → App

5. Role-specific UI
   Client: Explore, MyCourses, Messages, Account tabs
   Trainer: Courses, Students, Earnings, Messages, Profile tabs
```

---

## Next Phase: Phase 1 - MVP Features

Phase 1 will implement the actual feature logic within these screens:
- Firebase API integration
- Real data fetching and display
- Form submissions
- Real-time updates
- Image/video uploads
- Chat messaging

---

## Important Notes

1. **Navigation container must wrap provider hierarchy** - Already done in App.js
2. **All screens are placeholders with structure** - Ready for Phase 1 logic
3. **Icons from Ionicons** - No custom icons needed
4. **Responsive design** - All components are flex-based
5. **Error handling** - ErrorContext available in all screens
6. **Auth checks** - RootNavigator handles conditional rendering

---

## Performance Optimizations

- Stack navigators only render visible screen
- Tab navigator doesn't unmount hidden tabs (by default)
- AsyncStorage caches auth state for fast app startup
- useCallback optimized in navigators to prevent re-renders
- FlatList with keyExtractor for efficient list rendering

