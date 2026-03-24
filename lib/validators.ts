// Email validation
export function validateEmail(email: string): { valid: boolean; error?: string } {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return { valid: false, error: 'Email is required' };
  if (!emailRegex.test(email)) return { valid: false, error: 'Invalid email format' };
  return { valid: true };
}

// Password validation
export function validatePassword(password: string): { valid: boolean; error?: string } {
  if (!password) return { valid: false, error: 'Password is required' };
  if (password.length < 6) return { valid: false, error: 'Password must be at least 6 characters' };
  return { valid: true };
}

// Name validation
export function validateName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) return { valid: false, error: 'Name is required' };
  if (name.trim().length < 2) return { valid: false, error: 'Name must be at least 2 characters' };
  return { valid: true };
}

// Number validation (weight, height, age, etc)
export function validateNumber(
  value: string | number,
  label: string,
  min?: number,
  max?: number
): { valid: boolean; error?: string } {
  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) return { valid: false, error: `${label} must be a valid number` };
  if (min !== undefined && num < min)
    return { valid: false, error: `${label} must be at least ${min}` };
  if (max !== undefined && num > max)
    return { valid: false, error: `${label} must be no more than ${max}` };

  return { valid: true };
}

// Validate client profile form
export function validateClientProfileForm(data: {
  name?: string;
  weight?: string | number;
  height?: string | number;
  age?: string | number;
  gender?: string;
  bodyFatPercentage?: string | number;
  musclePercentage?: string | number;
  goalWeight?: string | number;
  goalDescription?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (data.name) {
    const nameValidation = validateName(data.name);
    if (!nameValidation.valid) errors.name = nameValidation.error || 'Invalid name';
  }

  if (data.weight) {
    const weightValidation = validateNumber(data.weight, 'Weight', 20, 300);
    if (!weightValidation.valid) errors.weight = weightValidation.error || 'Invalid weight';
  }

  if (data.height) {
    const heightValidation = validateNumber(data.height, 'Height', 100, 250);
    if (!heightValidation.valid) errors.height = heightValidation.error || 'Invalid height';
  }

  if (data.age) {
    const ageValidation = validateNumber(data.age, 'Age', 13, 120);
    if (!ageValidation.valid) errors.age = ageValidation.error || 'Invalid age';
  }

  if (data.gender && !['male', 'female', 'other'].includes(data.gender)) {
    errors.gender = 'Invalid gender selection';
  }

  if (data.bodyFatPercentage) {
    const bfValidation = validateNumber(data.bodyFatPercentage, 'Body Fat %', 2, 60);
    if (!bfValidation.valid) errors.bodyFatPercentage = bfValidation.error || 'Invalid body fat %';
  }

  if (data.musclePercentage) {
    const muscleValidation = validateNumber(data.musclePercentage, 'Muscle %', 10, 80);
    if (!muscleValidation.valid) errors.musclePercentage = muscleValidation.error || 'Invalid muscle %';
  }

  if (data.goalWeight) {
    const goalValidation = validateNumber(data.goalWeight, 'Goal Weight', 20, 300);
    if (!goalValidation.valid) errors.goalWeight = goalValidation.error || 'Invalid goal weight';
  }

  if (data.goalDescription && data.goalDescription.length > 500) {
    errors.goalDescription = 'Goal description must be less than 500 characters';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// Validate trainer profile form
export function validateTrainerProfileForm(data: {
  name?: string;
  bio?: string;
  specialties?: string[];
  themeColor?: string;
}): { valid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (data.name) {
    const nameValidation = validateName(data.name);
    if (!nameValidation.valid) errors.name = nameValidation.error || 'Invalid name';
  }

  if (data.bio && data.bio.length > 500) {
    errors.bio = 'Bio must be less than 500 characters';
  }

  if (data.specialties && (!Array.isArray(data.specialties) || data.specialties.length === 0)) {
    errors.specialties = 'At least one specialty is required';
  }

  if (data.themeColor && !/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(data.themeColor)) {
    errors.themeColor = 'Invalid color format (use hex: #RRGGBB)';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// Validate signup form
export function validateSignupForm(email: string, password: string): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) errors.email = emailValidation.error || 'Invalid email';

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) errors.password = passwordValidation.error || 'Invalid password';

  return { valid: Object.keys(errors).length === 0, errors };
}

// Validate trainer password
export function validateTrainerPassword(password: string): { valid: boolean; error?: string } {
  if (!password) return { valid: false, error: 'Password is required' };
  const correctPassword = process.env.EXPO_PUBLIC_TRAINER_PASSWORD;
  if (password !== correctPassword) {
    return { valid: false, error: 'Incorrect trainer password' };
  }
  return { valid: true };
}
