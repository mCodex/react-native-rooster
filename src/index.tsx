import ToastProvider from './providers/ToastProvider';
import useToast from './hooks/useToast';

export { ToastProvider, useToast };

// Export sizing utilities for advanced customization
export {
  calculateLineHeight,
  calculateSingleLineHeight,
  calculateToastHeight,
  calculateMinimumWidth,
  calculateResponsiveWidth,
  getOptimalHeight,
  isValidDimensionConfig,
} from './utils/sizing';

// Export accessibility utilities for WCAG 2.1 compliance
export {
  TOAST_TYPE_TO_ROLE,
  TOAST_TYPE_TO_LIVE_REGION,
  TOAST_TYPE_HINT_MAP,
  generateAccessibilityLabel,
  generateAccessibilityHint,
  isTextTruncated,
  generateAccessibilityAnnouncement,
  calculateContrastRatio,
  isContrastCompliant,
  hexToRgb,
  validateAccessibility,
} from './utils/accessibility';

// Export haptic feedback utilities
export { HAPTIC_PATTERNS, triggerHaptic, cancelHaptic } from './utils/haptics';

export type {
  ToastMessage,
  ToastConfig,
  ToastContextProps,
  ToastProviderProps,
  ToastPlacement,
  ToastHorizontalPosition,
  ToastPosition,
  ToastType,
} from './types';

// Re-export utility types
export type { DimensionConfig } from './utils/sizing';
export type { HapticPattern } from './utils/haptics';
