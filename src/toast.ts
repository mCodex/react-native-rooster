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
 * Imperative facade for use **outside the React tree** — services, fetch
 * interceptors, sagas, error boundaries, redux reducers, plain helpers.
 *
 * All methods mirror the {@link useToast} hook and operate on the same
 * internal store, so toasts triggered here appear in the same `<Toaster />`
 * mounted in your app.
 *
 * @example From an axios interceptor
 * ```ts
 * import { toast } from 'react-native-rooster';
 *
 * axios.interceptors.response.use(
 *   (r) => r,
 *   (err) => {
 *     toast.error({ title: 'Network error', message: err.message });
 *     return Promise.reject(err);
 *   },
 * );
 * ```
 *
 * @example One-off configuration at app startup
 * ```ts
 * toast.configure({ timeToDismiss: 4000, placement: 'top' });
 * ```
 *
 * @see {@link useToast} — same API as a React hook.
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

/**
 * Convenience alias of {@link ToastApi.configure}.
 *
 * @param config - Partial configuration merged into the global config.
 *
 * @example
 * ```ts
 * import { configureToast } from 'react-native-rooster';
 *
 * configureToast({ timeToDismiss: 5000, maxVisible: 3 });
 * ```
 */
export const configureToast = toast.configure;

export default toast;
