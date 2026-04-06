// Accessibility & UX Utilities
import { AccessibilityInfo } from "react-native";

/**
 * Announce a message to screen readers for accessibility
 */
export async function announceForAccessibility(message: string) {
  try {
    await AccessibilityInfo.announceForAccessibility(message);
  } catch (error) {
    console.error("Announcement failed:", error);
  }
}

/**
 * Check if screen reader is enabled
 */
export async function isScreenReaderEnabled(): Promise<boolean> {
  try {
    return await AccessibilityInfo.isScreenReaderEnabled();
  } catch {
    return false;
  }
}

/**
 * Set accessibility label for interactive elements
 * Improves voice-over descriptions
 */
export function getAccessibilityLabel(
  type: string,
  label: string,
  state?: string,
): string {
  let description = `${type}: ${label}`;
  if (state) {
    description += `, ${state}`;
  }
  return description;
}

/**
 * Common accessibility labels for UI patterns
 */
export const AccessibilityLabels = {
  BUTTON_CLOSE: "Close",
  BUTTON_SUBMIT: "Submit",
  BUTTON_CANCEL: "Cancel",
  BUTTON_DELETE: "Delete",
  BUTTON_BACK: "Go back",
  LOADING: "Loading content",
  ERROR: "An error occurred",
  EMPTY_STATE: "No items to display",
  LOADING_MORE: "Loading more items",
  EXPAND: "Expand",
  COLLAPSE: "Collapse",
  MENU: "Menu",
  OPTIONS: "More options",
};

/**
 * Get semantic heading level
 * Ensures proper document structure for screen readers
 */
export function getHeadingLevel(level: 1 | 2 | 3 | 4 | 5 | 6): string {
  const levels = ["h1", "h2", "h3", "h4", "h5", "h6"];
  return levels[level - 1];
}

/**
 * Enhanced button props for accessibility
 */
export function getButtonAccessibilityProps(
  label: string,
  disabled?: boolean,
  hint?: string,
) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: "button" as const,
    accessibilityState: { disabled: disabled || false },
    accessibilityHint: hint,
  };
}

/**
 * Enhanced input props for accessibility
 */
export function getInputAccessibilityProps(
  label: string,
  hint?: string,
  required?: boolean,
) {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityRole: "text" as const,
    accessibilityHint: hint || (required ? "Required field" : "Optional field"),
  };
}
