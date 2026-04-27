import { Platform, Vibration } from 'react-native';

import type { HapticFeedback } from '../types';

/** Internal vibration patterns (ms). Web is a no-op. */
const PATTERNS = {
  light: 5,
  medium: 20,
  success: [10, 20, 10],
  error: [30, 20, 30],
} as const;

type Pattern = keyof typeof PATTERNS;

/**
 * Maps the public `HapticFeedback` vocabulary onto the small internal pattern
 * set. Returns `null` when feedback is disabled or the platform is web.
 */
export const normalizeHapticPattern = (
  feedback: HapticFeedback | undefined,
): Pattern | null => {
  if (!feedback) return null;
  switch (feedback) {
    case 'heavy':
      return 'medium';
    case 'warning':
      return 'error';
    default:
      return feedback;
  }
};

/** Trigger a haptic pattern. Safe to call from any platform. */
export const triggerHaptic = (feedback: HapticFeedback | undefined): void => {
  if (Platform.OS === 'web') return;
  const pattern = normalizeHapticPattern(feedback);
  if (!pattern) return;
  const value = PATTERNS[pattern];
  Vibration.vibrate(typeof value === 'number' ? value : Array.from(value));
};
