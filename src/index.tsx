/**
 * Public entry point for `react-native-rooster`.
 *
 * The package re-exports a small, tree-shakeable surface:
 *
 * | Export | Kind | Use it for |
 * | --- | --- | --- |
 * | {@link Toaster} | Component | Mount once near the root of your app. |
 * | {@link useToast} | Hook | Recommended way to access the toast API from components. |
 * | {@link toast} | Singleton | Imperative facade for code outside the React tree. |
 * | {@link configureToast} | Function | Shorthand for `toast.configure(...)`. |
 *
 * Combined with `"sideEffects": false`, bundlers strip everything you don't
 * use — there are no subpath imports to remember.
 *
 * @packageDocumentation
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
