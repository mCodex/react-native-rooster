import useToast from './hooks/useToast';
import ToastProvider from './providers/ToastProvider';

export { ToastProvider, useToast };

export type {
  ToastConfig,
  ToastContextProps,
  ToastHorizontalPosition,
  ToastMessage,
  ToastPlacement,
  ToastPosition,
  ToastProviderProps,
  ToastType,
} from './types';

// Export accessibility utilities for WCAG 2.1 compliance
export {
  calculateContrastRatio,
  generateAccessibilityAnnouncement,
  generateAccessibilityHint,
  generateAccessibilityLabel,
  hexToRgb,
  isContrastCompliant,
  isTextTruncated,
  TOAST_TYPE_HINT_MAP,
  TOAST_TYPE_TO_LIVE_REGION,
  TOAST_TYPE_TO_ROLE,
  validateAccessibility,
} from './utils/accessibility';
export type { HapticPattern } from './utils/haptics';
// Export haptic feedback utilities
export { cancelHaptic, HAPTIC_PATTERNS, triggerHaptic } from './utils/haptics';

// Re-export utility types
export type { DimensionConfig } from './utils/sizing';
// Export sizing utilities for advanced customization
export {
  calculateLineHeight,
  calculateMinimumWidth,
  calculateResponsiveWidth,
  calculateSingleLineHeight,
  calculateToastHeight,
  getOptimalHeight,
  isValidDimensionConfig,
} from './utils/sizing';
