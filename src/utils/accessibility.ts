import type { ToastMessage, ToastType } from '../types';

/** Accessibility role announced by Pressable for each toast variant. */
export const TOAST_TYPE_TO_ROLE: Record<ToastType, string> = {
  info: 'button',
  success: 'button',
  warning: 'button',
  error: 'button',
};

/** Live-region urgency for screen readers — errors/warnings interrupt. */
export const TOAST_TYPE_TO_LIVE_REGION: Record<
  ToastType,
  'polite' | 'assertive'
> = {
  info: 'polite',
  success: 'polite',
  warning: 'assertive',
  error: 'assertive',
};

const HINTS: Record<ToastType, string> = {
  info: 'Information notification',
  success: 'Success notification',
  warning: 'Warning notification',
  error: 'Error notification',
};

/** Joins title + message for screen readers, capped at 150 chars. */
export const generateAccessibilityLabel = (message: ToastMessage): string => {
  const parts: string[] = [];
  if (message.title) parts.push(message.title);
  if (message.message) parts.push(message.message);
  const label = parts.join(', ');
  return label.length > 150 ? `${label.substring(0, 147)}...` : label;
};

/** Type-specific hint, with dismissal note when the toast is interactive. */
export const generateAccessibilityHint = (
  type: ToastType = 'info',
  isInteractive = false,
): string =>
  isInteractive ? `${HINTS[type]}. Double tap to dismiss` : HINTS[type];
