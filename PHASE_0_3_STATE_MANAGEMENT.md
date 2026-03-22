# Phase 0.3: State Management Setup

## Complete State Management Architecture for Travel Fitness App

---

## Overview

Phase 0.3 establishes a centralized state management system using React Context API, custom hooks, and a service layer wrapper. This provides a clean, scalable foundation for managing authentication, errors, and API interactions throughout the app.

## Architecture Components

### 1. **AuthContext** (`src/context/AuthContext.js`)

Manages global authentication state and provides auth-related methods to the entire app.

**State Properties:**

- `user` - Current logged-in user object with Firebase UID
- `loading` - Boolean indicating if auth is being initialized
- `error` - Error object if auth operation fails
- `isAuthenticated` - Boolean flag for quick auth status checks

**Methods:**

- `signUp(email, password, role, userData)` - Create new user account
- `signIn(email, password)` - Login existing user
- `signOut()` - Logout current user
- `updateProfile(updates)` - Update user profile data
- `clearError()` - Clear error state

**Features:**

- Firebase auth subscription on mount for real-time auth updates
- AsyncStorage persistence for offline support
- Automatic user data loading on app startup
- Comprehensive error handling with user-friendly messages

**Usage in App.js:**

```jsx
<ErrorProvider>
  <AuthProvider>
    <AppContent />
  </AuthProvider>
</ErrorProvider>
```

---

### 2. **ErrorContext** (`src/context/ErrorContext.js`)

Centralized error state management separate from auth errors.

**State Properties:**

- `error` - Current error object with message, type, and timestamp
- `errorHistory` - Array of last 10 errors for debugging

**Methods:**

- `addError(errorMessage, errorType)` - Add new error
- `clearError()` - Clear current error
- `clearErrorHistory()` - Clear error history

**Error Types:**

- `"general"` - General application error
- `"network"` - Network/connectivity error
- `"validation"` - Form validation error
- `"auth"` - Authentication error
- `"firebase"` - Firebase operation error

---

### 3. **Custom Hooks**

#### a. **useAuthContext** (`src/hooks/useAuthContext.js`)

Easy access to AuthContext throughout the app.

**Usage:**

```jsx
import { useAuthContext } from "../hooks";

function MyComponent() {
  const { user, isAuthenticated, signOut, loading } = useAuthContext();

  if (loading) return <LoadingScreen />;

  return isAuthenticated ? <Dashboard /> : <LoginScreen />;
}
```

#### b. **useError** (`src/hooks/useError.js`)

Easy access to ErrorContext for displaying errors.

**Usage:**

```jsx
import { useError } from "../hooks";

function MyComponent() {
  const { error, addError, clearError } = useError();

  const submitForm = async (data) => {
    try {
      await API.posts.createPost(courseId, userId, data);
    } catch (err) {
      addError(err.message, "validation");
    }
  };

  return (
    <>
      {error && <ErrorBanner message={error.message} onDismiss={clearError} />}
      <FormComponent onSubmit={submitForm} />
    </>
  );
}
```

#### c. **useAuth** (`src/hooks/useAuth.js`)

Lower-level hook wrapping Firebase auth directly (used by AuthContext).

---

### 4. **API Service Layer** (`src/services/apiService.js`)

Centralized wrapper around all Firebase operations. Single point of contact for API calls.

**Structure:**

```
API.auth.* - Authentication operations
API.courses.* - Course management
API.enrollments.* - Enrollment and progress tracking
API.posts.* - Posts and messaging
API.storage.* - File uploads
```

**Benefits:**

- Single point of contact for all API calls
- Consistent error handling via `handleError` utility
- Easy to mock for testing
- Easy to switch Firebase backend to REST API later
- Centralized logging and monitoring capabilities

**Usage:**

```jsx
import API from "../services/apiService";

// Via hooks in components
const { signIn } = useAuthContext(); // Uses API internally

// Direct usage (if needed)
const courses = await API.courses.getTrainerCourses(trainerId);
```

---

## Data Flow

### Authentication Flow

```
User Input → Component → useAuthContext()
  → AuthContext.signIn()
  → API.auth.loginUser()
  → Firebase Auth
  → Update Context State
  → Component Re-renders
  → Navigation Updated
```

### Error Handling Flow

```
API Operation Fails
  → handleError() utility processes error
  → Error thrown to caller
  → Component catches via try/catch
  → useError().addError() called
  → ErrorContext state updated
  → Error Display Component mounts
  → User sees friendly error message
```

---

## Integration Points

### With Components

Components now follow this pattern:

```jsx
import { useAuthContext, useError } from "../hooks";
import API from "../services/apiService";

function MyComponent() {
  const { user, loading } = useAuthContext();
  const { error, addError, clearError } = useError();
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await API.courses.getTrainerCourses(user.uid);
        setData(result);
      } catch (err) {
        addError(err.message);
      }
    };

    if (!loading && user) {
      loadData();
    }
  }, [user, loading]);

  return (
    <>
      {error && <ErrorBanner message={error.message} />}
      {data && <CoursesList courses={data} />}
    </>
  );
}
```

---

## File Structure

```
src/
├── context/
│   ├── AuthContext.js (Global auth state)
│   └── ErrorContext.js (Global error state)
├── hooks/
│   ├── useAuth.js (Firebase auth hook)
│   ├── useAuthContext.js (Auth context accessor)
│   ├── useError.js (Error context accessor)
│   └── index.js (Central export point)
├── services/
│   └── apiService.js (API wrapper layer)
└── ...
```

---

## Next Steps: Phase 0.4 - Navigation

Phase 0.4 will:

1. Install React Navigation packages
2. Create role-based navigation (Client vs Trainer)
3. Set up stack and tab navigators
4. Connect AuthContext to conditional rendering
5. Create placeholder screens for Phase 1

---

## Testing State Management

### Manual Testing Checklist

- [ ] App starts without errors
- [ ] AuthContext loads previous user from AsyncStorage
- [ ] Sign up creates new user
- [ ] Sign in logs in user
- [ ] Sign out clears auth state
- [ ] Errors display in error context
- [ ] useAuthContext hook accessible in components
- [ ] useError hook captures API errors
- [ ] API service layer routes calls correctly

### Example Test Cases

```javascript
// Test AuthContext persistence
1. Launch app → User auto-logs in from AsyncStorage
2. Sign out → Clear AsyncStorage
3. Relaunch app → User not logged in

// Test Error Handling
1. Try to sign in with wrong password → Error in context
2. Try to upload to storage without network → Error captured
3. Clear error → Error state reset
```

---

## Best Practices

1. **Always use useAuthContext/useError hooks** - Don't access context directly with useContext()
2. **Use API service layer** - Don't call Firebase modules directly from components
3. **Handle loading states** - Check `loading` before accessing `user`
4. **Clear errors appropriately** - Dismiss errors when user takes action
5. **Test offline scenarios** - AsyncStorage persistence should handle offline

---

## Important Notes

- AuthContext wrapper must be inside ErrorProvider in App.js
- All components using hooks must be children of providers
- AsyncStorage persists user session even after app restart
- Firebase auth unsubscriber runs on component unmount
- Error history keeps last 10 errors for debugging
