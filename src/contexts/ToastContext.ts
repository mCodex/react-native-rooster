import { createContext } from 'react';

import type { ToastContextProps } from '../types';

/**
 * Internal context backing the `useToast` hook.
 * Defaults to undefined so consumers receive a descriptive error.
 */
const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export default ToastContext;
