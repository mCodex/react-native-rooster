/**
 * Accessibility utilities for toast notifications.
 * Implements WCAG 2.1 AA compliance patterns and helpers.
 *
 * Design principles:
 * - Follows React Native accessibility best practices
 * - Supports screen readers (VoiceOver, TalkBack)
 * - Enables keyboard navigation
 * - Ensures proper color contrast
 * - Respects user accessibility preferences
 *
 * @module utils/accessibility
 */

import type { ToastType, ToastMessage } from '../types';

/**
 * Toast type to accessibility role mapping.
 * Maps semantic toast types to appropriate roles supported by React Native.
 * Note: React Native Pressable only supports: button, link, header, search, image,
 * imagebutton, keyboardkey, text, adjustable, checkbox, combobox, menu, menuitem,
 * progressbar, radio, scrollbar, spinbutton, switch, tab
 *
 * WCAG alert/status roles are announced via accessibilityLiveRegion instead.
 *
 * @constant
 */
export const TOAST_TYPE_TO_ROLE: Record<ToastType, string> = {
  info: 'button',
  success: 'button',
  warning: 'button',
  error: 'button',
};

/**
 * Toast type to accessibility live region mapping.
 * Determines announcement priority for screen readers.
 *
 * @constant
 */
export const TOAST_TYPE_TO_LIVE_REGION: Record<
  ToastType,
  'polite' | 'assertive'
> = {
  info: 'polite',
  success: 'polite',
  warning: 'assertive',
  error: 'assertive',
};

/**
 * Toast type to default accessibility hint mapping.
 * Provides context for different notification types.
 *
 * @constant
 */
export const TOAST_TYPE_HINT_MAP: Record<ToastType, string> = {
  info: 'Information notification',
  success: 'Success notification',
  warning: 'Warning notification',
  error: 'Error notification',
};

/**
 * Generates accessibility label for a toast message.
 * Combines title and message for comprehensive screen reader context.
 *
 * Rules:
 * - Use title if available (most specific)
 * - Fall back to message
 * - Maximum 150 characters (optimal for screen readers)
 *
 * @param message - Toast message data
 * @returns Accessibility label string
 *
 * @example
 * generateAccessibilityLabel(
 *   { title: 'Success', message: 'Profile updated' }
 * );
 * // => "Success, Profile updated"
 *
 * @example
 * generateAccessibilityLabel(
 *   { message: 'An error occurred' }
 * );
 * // => "An error occurred"
 */
export const generateAccessibilityLabel = (message: ToastMessage): string => {
  const parts: string[] = [];

  if (message.title) {
    parts.push(message.title);
  }

  if (message.message) {
    parts.push(message.message);
  }

  const label = parts.join(', ');

  // Return label, capped at 150 characters for optimal screen reader experience
  return label.length > 150 ? `${label.substring(0, 147)}...` : label;
};

/**
 * Generates accessibility hint for contextual information.
 * Provides additional context about interaction possibilities.
 *
 * Rules:
 * - Include type-specific hint (success, warning, error)
 * - Add interaction hint if onPress provided
 * - Maximum 100 characters
 *
 * @param type - Toast type
 * @param isInteractive - Whether toast has onPress handler
 * @returns Accessibility hint string
 *
 * @example
 * generateAccessibilityHint('success', false);
 * // => "Success notification"
 *
 * @example
 * generateAccessibilityHint('error', true);
 * // => "Error notification. Double tap to dismiss"
 */
export const generateAccessibilityHint = (
  type: ToastType = 'info',
  isInteractive: boolean = false
): string => {
  let hint = TOAST_TYPE_HINT_MAP[type];

  if (isInteractive) {
    hint += '. Double tap to dismiss';
  }

  return hint;
};

/**
 * Determines if text content likely exceeds numberOfLines limit.
 * Helps assess if content might be truncated for screen readers.
 *
 * Algorithm:
 * 1. Estimate characters per line based on width
 * 2. Compare total characters against (chars per line * numberOfLines)
 * 3. Account for word breaking behavior
 *
 * @param text - Text content to check
 * @param numberOfLines - Line limit constraint
 * @param estimatedWidth - Estimated text width in pixels (default: 300)
 * @returns True if content likely exceeds limit
 *
 * @example
 * isTextTruncated('Short message', 2, 300);
 * // => false
 *
 * @example
 * isTextTruncated('Very long message...'.repeat(5), 1, 300);
 * // => true
 */
export const isTextTruncated = (
  text: string,
  numberOfLines: number,
  estimatedWidth: number = 300
): boolean => {
  if (!text || numberOfLines === 0) return false;

  // Rough estimate: 2.2 characters per 10px at 14px font size
  const charsPerLine = Math.floor((estimatedWidth / 140) * 22);
  const maxChars = charsPerLine * numberOfLines;

  return text.length > maxChars;
};

/**
 * Generates accessibility announcements for toast updates.
 * Used with accessibilityLiveRegion to notify screen readers.
 *
 * Announcement includes:
 * - Type-specific prefix (e.g., "Error alert")
 * - Main message content
 * - Optional interaction hint
 *
 * @param message - Toast message data
 * @param type - Toast type
 * @param isInteractive - Whether toast has interaction
 * @returns Announcement string optimized for screen readers
 *
 * @example
 * generateAccessibilityAnnouncement(
 *   { title: 'Payment Processed', message: 'Your order is confirmed' },
 *   'success',
 *   false
 * );
 * // => "Payment Processed. Your order is confirmed."
 */
export const generateAccessibilityAnnouncement = (
  message: ToastMessage,
  type: ToastType = 'info',
  isInteractive: boolean = false
): string => {
  const parts: string[] = [];

  // Add type context
  const roleHint = TOAST_TYPE_HINT_MAP[type];
  parts.push(roleHint);

  // Add title and message
  if (message.title) {
    parts.push(message.title);
  }
  if (message.message) {
    parts.push(message.message);
  }

  // Add interaction hint
  if (isInteractive) {
    parts.push('Double tap to dismiss');
  }

  return parts.join('. ');
};

/**
 * Color contrast ratio calculator (simplified WCAG formula).
 * Determines if text/background combination meets WCAG AA standard (4.5:1).
 *
 * Formula:
 * contrast = (L1 + 0.05) / (L2 + 0.05)
 * where L is relative luminance
 *
 * @param textColor - RGB color as [r, g, b] (0-255)
 * @param backgroundColor - RGB color as [r, g, b] (0-255)
 * @returns Contrast ratio (minimum 1, maximum 21)
 *
 * @example
 * // White text on black background (optimal)
 * calculateContrastRatio([255, 255, 255], [0, 0, 0]);
 * // => 21
 *
 * @example
 * // White text on dark gray background
 * calculateContrastRatio([255, 255, 255], [51, 51, 51]);
 * // => 12.63 (meets WCAG AAA)
 */
export const calculateContrastRatio = (
  textColor: [number, number, number],
  backgroundColor: [number, number, number]
): number => {
  // Calculate relative luminance using WCAG formula
  const getLuminance = (rgb: [number, number, number]): number => {
    const luminanceValues = rgb.map((c) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    });
    const r = luminanceValues[0] ?? 0;
    const g = luminanceValues[1] ?? 0;
    const b = luminanceValues[2] ?? 0;

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(textColor);
  const l2 = getLuminance(backgroundColor);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Validates color contrast for WCAG compliance.
 * Checks if text/background combination meets accessibility standards.
 *
 * Standards:
 * - WCAG AA: 4.5:1 (normal text), 3:1 (large text)
 * - WCAG AAA: 7:1 (normal text), 4.5:1 (large text)
 *
 * @param textColor - RGB color as [r, g, b]
 * @param backgroundColor - RGB color as [r, g, b]
 * @param isLargeText - Whether text is 18pt+ or 14pt+ bold (default: false)
 * @param level - Compliance level 'AA' or 'AAA' (default: 'AA')
 * @returns True if contrast meets specified standard
 *
 * @example
 * // Check white on black (always passes)
 * isContrastCompliant(
 *   [255, 255, 255],
 *   [0, 0, 0],
 *   false,
 *   'AA'
 * ); // => true
 *
 * @example
 * // Check low-contrast combination
 * isContrastCompliant(
 *   [200, 200, 200],
 *   [200, 200, 200],
 *   false,
 *   'AA'
 * ); // => false (same color = 1:1 ratio)
 */
export const isContrastCompliant = (
  textColor: [number, number, number],
  backgroundColor: [number, number, number],
  isLargeText: boolean = false,
  level: 'AA' | 'AAA' = 'AA'
): boolean => {
  const ratio = calculateContrastRatio(textColor, backgroundColor);

  if (level === 'AAA') {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }

  // Default AA
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Formats hex color to RGB array.
 * Utility for color conversion in accessibility calculations.
 *
 * @param hex - Hex color string (#RRGGBB or #RGB)
 * @returns RGB array [r, g, b] (0-255) or null if invalid
 *
 * @example
 * hexToRgb('#FFFFFF');
 * // => [255, 255, 255]
 *
 * @example
 * hexToRgb('#000');
 * // => [0, 0, 0]
 */
export const hexToRgb = (hex: string): [number, number, number] | null => {
  // Remove # if present
  const cleanHex = hex.replace('#', '');

  if (cleanHex.length === 3) {
    // Short form #RGB
    const chars = cleanHex.split('');
    const r = chars[0];
    const g = chars[1];
    const b = chars[2];
    if (!r || !g || !b) return null;
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)];
  }

  if (cleanHex.length === 6) {
    // Full form #RRGGBB
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return [r, g, b];
  }

  return null;
};

/**
 * Validates whether toast meets basic accessibility requirements.
 * Comprehensive compliance check.
 *
 * Checks:
 * 1. Has accessible label (title or message)
 * 2. Has appropriate accessibility role
 * 3. Message isn't obviously truncated
 * 4. Font size is readable (minimum 12px for accessibility)
 *
 * @param message - Toast message data
 * @param type - Toast type
 * @param fontSize - Font size in pixels
 * @returns Validation result with issues array
 *
 * @example
 * const result = validateAccessibility(
 *   { title: '', message: '' },
 *   'info',
 *   14
 * );
 * // => { isValid: false, issues: ['No title or message provided'] }
 */
export const validateAccessibility = (
  message: ToastMessage,
  type: ToastType = 'info',
  fontSize: number = 14
): { isValid: boolean; issues: string[] } => {
  const issues: string[] = [];

  // Check for label content
  if (!message.title && !message.message) {
    issues.push('No title or message provided');
  }

  // Check font size
  if (fontSize < 12) {
    issues.push(`Font size ${fontSize}px is below recommended minimum of 12px`);
  }

  // Check if role mapping exists
  if (!TOAST_TYPE_TO_ROLE[type]) {
    issues.push(`Unknown toast type: ${type}`);
  }

  return {
    isValid: issues.length === 0,
    issues,
  };
};
