import toastStore from './store/toastStore';
import type { ToastApi, ToastMessage } from './types';

const normalizeInput = (
  input: string | Omit<ToastMessage, 'id' | 'type'>,
  type: ToastMessage['type'],
): Omit<ToastMessage, 'id'> => {
  if (typeof input === 'string') {
    return { type, message: input };
  }
  return { ...input, type };
};

const addToast: ToastApi['addToast'] = (message) => toastStore.add(message);
const removeToast: ToastApi['removeToast'] = (id) => toastStore.remove(id);
const setToastConfig: ToastApi['setToastConfig'] = (config) =>
  toastStore.setConfig(config);
const clear: ToastApi['clear'] = () => toastStore.clear();

/**
 * Imperative facade for use outside the React tree (services, interceptors,
 * sagas, plain helpers). All methods mirror {@link useToast}.
 *
 * @example
 * import { toast } from 'react-native-rooster';
 *
 * toast.success('Saved!');
 * toast.error({ title: 'Oops', message: 'Try again' });
 * toast.configure({ position: { vertical: 'top' } });
 */
export const toast: ToastApi = {
  addToast,
  show: addToast,
  removeToast,
  dismiss: removeToast,
  clear,
  setToastConfig,
  configure: setToastConfig,
  success: (m) => addToast(normalizeInput(m, 'success')),
  error: (m) => addToast(normalizeInput(m, 'error')),
  warning: (m) => addToast(normalizeInput(m, 'warning')),
  info: (m) => addToast(normalizeInput(m, 'info')),
};

/** Convenience alias of {@link toast.configure}. */
export const configureToast = toast.configure;

export default toast;
