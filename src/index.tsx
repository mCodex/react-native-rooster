/**
 * Public entry point for `react-native-rooster`.
 *
 * Only the core API ships here so consumers get the smallest possible bundle
 * with the best tree-shaking. Advanced helpers live behind subpath imports:
 *
 *   import { validateWcag22 } from 'react-native-rooster/accessibility';
 *   import { triggerHaptic }  from 'react-native-rooster/haptics';
 *   import { calculateToastHeight } from 'react-native-rooster/sizing';
 */

export { default as Toaster } from './components/Toaster';
export { default as useToast } from './hooks/useToast';
export { configureToast, toast } from './toast';

export type {
  HapticFeedback,
  ToastApi,
  ToastConfig,
  ToasterProps,
  ToastHorizontalPosition,
  ToastMessage,
  ToastPlacement,
  ToastPosition,
  ToastType,
} from './types';
