import { createContext } from 'react';
import type { ToastContextProps } from '../types';

const ToastContext = createContext<ToastContextProps>({} as ToastContextProps);

export default ToastContext;
