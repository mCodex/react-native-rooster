import { toast } from '../toast';
import type { ToastApi } from '../types';

/**
 * React hook returning the toast API.
 *
 * Recommended entry point for **function components**. The hook returns a
 * stable singleton bound to the internal store — it does not subscribe to any
 * state, so the calling component **never re-renders** when toasts are added,
 * removed, or updated.
 *
 * @returns The {@link ToastApi} object. Reference is stable across renders
 * and identical to the imperative {@link toast} export.
 *
 * @example Show a success toast
 * ```tsx
 * const { success } = useToast();
 * success('Saved!');
 * ```
 *
 * @example Capture an id and dismiss later
 * ```tsx
 * const { addToast, dismiss } = useToast();
 * const id = addToast({ message: 'Uploading…', duration: 0 });
 * // …later
 * dismiss(id);
 * ```
 *
 * @example Configure at runtime
 * ```tsx
 * const { configure } = useToast();
 * useEffect(() => {
 *   configure({ timeToDismiss: 5000, maxVisible: 3 });
 * }, [configure]);
 * ```
 *
 * @see {@link toast} — same API, callable from outside React.
 * @see {@link Toaster} — the mount point you must render once.
 */
const useToast = (): ToastApi => toast;

export default useToast;
