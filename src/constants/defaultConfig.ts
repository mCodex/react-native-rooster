import { Easing } from 'react-native';

import type { ToastConfig } from '../types';

/** Library defaults used when the provider mounts. */
export const DEFAULT_TOAST_CONFIG: ToastConfig = {
  bgColor: {
    error: '#d92027',
    success: '#35d0ba',
    warning: '#ff9100',
    info: '#7890f0',
  },
  timeToDismiss: 3000,
  spacing: 12,
  placement: 'bottom',
  horizontalPosition: 'center',
  position: {
    vertical: 'bottom',
    horizontal: 'center',
  },
  offset: 20,
  animation: {
    initialTranslation: 24,
    appearDuration: 220,
    disappearDuration: 180,
    easing: Easing.out(Easing.cubic),
  },
};
