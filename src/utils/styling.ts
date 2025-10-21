/**
 * Styling utilities for toast cards.
 * Pure functions that compute visual properties from configuration.
 *
 * Design principles:
 * - All functions are pure (no side effects)
 * - Strong return types (never ambiguous)
 * - Clear JSDoc with examples
 * - Testable in isolation
 *
 * @module utils/styling
 */

import { StyleSheet } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ToastConfig, ToastMessage } from '../types';

/**
 * Builds the complete style object for a toast card.
 * Merges base styles with per-toast customizations and animation styles.
 *
 * Style hierarchy (lowest to highest precedence):
 * 1. Base toast styles (size, padding, shadows)
 * 2. Alignment styles (position-dependent width/margins)
 * 3. Per-toast color overrides (backgroundColor, borderRadius, padding)
 * 4. Global config overrides (toastStyle)
 * 5. Per-toast custom style (message.style) - highest priority
 *
 * Animation styles (opacity, transform) are applied separately.
 *
 * @param config - Global toast configuration
 * @param message - Individual toast message with optional overrides
 * @param alignmentStyle - Position-dependent alignment style from positioning utils
 * @param animationStyle - Animation properties (opacity, transform)
 * @returns Complete style for the toast Animated.View
 *
 * @example
 * const style = buildToastStyle(config, message, alignmentStyle, animationStyle);
 * // Returns array suitable for React Native View styling
 */
export const buildToastStyle = (
  config: ToastConfig,
  message: ToastMessage,
  alignmentStyle: ViewStyle,
  animationStyle: { opacity: any; transform: any[] }
): (ViewStyle | any)[] => [
  getBaseToastStyle(config),
  alignmentStyle,
  { backgroundColor: config.bgColor[message.type ?? 'info'] },
  animationStyle,
  getToastCustomizationStyle(message),
  config.toastStyle,
  message.style,
];

/**
 * Creates the base toast card styles.
 * These are the foundation styles applied to every toast.
 *
 * Sizing:
 * - `minWidth: 200`: Minimum size for content
 * - No maxWidth here (applied by alignment styles based on position)
 * - `minHeight: 44`: Accessibility tap target (can be exceeded with large fonts)
 *
 * Spacing:
 * - `paddingVertical: 16`: Breathing room for content
 * - `paddingHorizontal: 16`: Side margins for content
 *
 * Visual:
 * - `borderRadius: 12`: Rounded corners (can be overridden per-toast)
 * - Shadow properties: Elevation effect (configurable)
 * - Font sizes: Configurable via config.font (defaults: title 16px, message 14px)
 *
 * @param config - Toast configuration for shadows, padding, and typography
 * @returns ViewStyle object with base properties
 */
export const getBaseToastStyle = (config: ToastConfig): ViewStyle => ({
  minWidth: 200,
  minHeight: 44,
  paddingVertical: config.padding?.vertical ?? 16,
  paddingHorizontal: config.padding?.horizontal ?? 16,
  borderRadius: config.borderRadius ?? 12,
  // Shadow defaults (can be overridden in config)
  shadowColor: config.shadow?.color ?? '#000',
  shadowOpacity: config.shadow?.opacity ?? 0.2,
  shadowOffset: config.shadow?.offset ?? { width: 0, height: 12 },
  shadowRadius: config.shadow?.radius ?? 16,
  elevation: 8,
  // Ensure content is visible
  backgroundColor: '#1f2937',
});

/**
 * Extracts per-toast customization overrides.
 * Allows individual toasts to override global config.
 *
 * Supported overrides:
 * - `backgroundColor`: Card background color
 * - `borderRadius`: Corner radius
 * - `padding`: Content spacing (vertical/horizontal)
 * - `messageFontSize`: Font size for message text
 * - `titleFontSize`: Font size for title text
 *
 * Returns empty object if no overrides are present.
 *
 * @param message - Toast message with optional customization properties
 * @returns Partial ViewStyle with only specified overrides
 *
 * @example
 * // With overrides
 * getToastCustomizationStyle({
 *   message: 'Hello',
 *   backgroundColor: '#ff0000',
 *   borderRadius: 8,
 *   messageFontSize: 16,
 * });
 * // => { backgroundColor: '#ff0000', borderRadius: 8, messageFontSize: 16 }
 *
 * @example
 * // Without overrides
 * getToastCustomizationStyle({ message: 'Hello' });
 * // => {} (empty, safe to spread)
 */
export const getToastCustomizationStyle = (
  message: ToastMessage
): ViewStyle => {
  const overrides: Record<string, any> = {};

  if (message.backgroundColor) {
    overrides.backgroundColor = message.backgroundColor;
  }

  if (message.borderRadius !== undefined) {
    overrides.borderRadius = message.borderRadius;
  }

  if (message.padding) {
    if (message.padding.vertical !== undefined) {
      overrides.paddingVertical = message.padding.vertical;
    }
    if (message.padding.horizontal !== undefined) {
      overrides.paddingHorizontal = message.padding.horizontal;
    }
  }

  if (message.messageFontSize !== undefined) {
    overrides.messageFontSize = message.messageFontSize;
  }

  if (message.titleFontSize !== undefined) {
    overrides.titleFontSize = message.titleFontSize;
  }

  return overrides as ViewStyle;
};

/**
 * Base font sizes for toast text.
 * Can be overridden globally via ToastConfig.font or per-toast.
 *
 * @constant
 */
export const DEFAULT_FONT_SIZES = {
  title: 16,
  message: 14,
} as const;

/**
 * Predefined stylesheet for toast components.
 * Structured for reusability and performance optimization.
 *
 * Font sizes use defaults but can be overridden via config or per-toast.
 * Usage: Import and apply to Animated.View or View components.
 * Defined separately from dynamic styles for better performance.
 */
export const toastStyles = StyleSheet.create({
  /** Pressable container - handles touch and layout of content. */
  pressable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 44,
  },

  /** Icon container - right margin prevents text overlap. */
  icon: {
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },

  /** Content container - grows to fill available space. */
  content: {
    flex: 1,
    justifyContent: 'center',
  },

  /** Title text styling (fontSize overridable). */
  title: {
    color: '#fff',
    fontSize: DEFAULT_FONT_SIZES.title,
    fontWeight: '600',
    marginBottom: 4,
  },

  /** Message text styling (fontSize overridable). */
  message: {
    color: '#fff',
    fontSize: DEFAULT_FONT_SIZES.message,
  },
});

/**
 * Container host styles - positioned overlay for toast stack.
 *
 * The host container:
 * - Covers the entire screen (position: absolute)
 * - Uses pointerEvents="box-none" (clicks pass through)
 * - Applies positioning and alignment from utility functions
 */
export const containerStyles = StyleSheet.create({
  /** Transparent overlay - allows background interaction. */
  overlay: {
    backgroundColor: 'transparent',
  },

  /** Host container - positions and aligns the toast stack. */
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    flexDirection: 'column',
  },
});
