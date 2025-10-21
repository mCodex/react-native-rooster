/**
 * Haptic feedback utilities for enhanced user experience.
 * Provides cross-platform vibration feedback for toast interactions.
 *
 * Platform support:
 * - iOS: Full haptic engine support via React Native Vibration API
 * - Android: Vibration API support (with fallback to default pattern)
 * - Web: No-op (gracefully skipped)
 *
 * @module utils/haptics
 */

import { Vibration, Platform } from 'react-native';

/**
 * Haptic feedback patterns for different toast events.
 * Durations in milliseconds.
 */
export const HAPTIC_PATTERNS = {
  /** Light tap feedback (UI feedback) */
  light: [5] as const,
  /** Medium feedback (notification arrival) */
  medium: [20] as const,
  /** Heavy/Success feedback (important action) */
  success: [10, 20, 10] as const,
  /** Error/Warning feedback */
  error: [30, 20, 30] as const,
} as const;

export type HapticPattern = keyof typeof HAPTIC_PATTERNS;

/**
 * Triggers haptic feedback with the specified pattern.
 * Safely handles unsupported platforms.
 *
 * @param pattern - Haptic pattern to trigger ('light', 'medium', 'success', 'error')
 *
 * @example
 * // Trigger light tap when toast appears
 * triggerHaptic('light');
 *
 * @example
 * // Trigger success pattern for important notifications
 * triggerHaptic('success');
 */
export const triggerHaptic = (pattern: HapticPattern): void => {
  try {
    // Skip on web and unsupported platforms
    if (Platform.OS === 'web') {
      return;
    }

    const duration = HAPTIC_PATTERNS[pattern];

    if (!duration) {
      return;
    }

    // Convert readonly array to mutable for Vibration API
    const mutableDuration = Array.from(duration);

    // Single duration pattern: simple vibration
    if (mutableDuration.length === 1) {
      Vibration.vibrate(mutableDuration[0]);
    } else {
      // Complex pattern: vibrate with intervals
      Vibration.vibrate(mutableDuration);
    }
  } catch (error) {
    // Silently fail - some devices/environments don't support vibration
    console.debug('Haptic feedback not available:', error);
  }
};

/**
 * Cancels any ongoing haptic feedback.
 * Useful for cleanup or stopping repeated patterns.
 *
 * @example
 * // Stop haptic feedback
 * cancelHaptic();
 */
export const cancelHaptic = (): void => {
  try {
    if (Platform.OS !== 'web') {
      Vibration.cancel();
    }
  } catch (error) {
    // Silently fail - some environments don't support vibration
    console.debug('Haptic cancel not available:', error);
  }
};
