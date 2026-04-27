import { toast } from '../toast';
import type { ToastApi } from '../types';

/**
 * Access the toast API.
 *
 * In v4 there is no provider — the hook returns a stable singleton bound to
 * the internal store. Calling `useToast()` does not subscribe to any state
 * and therefore never causes the calling component to re-render.
 *
 * The v3 method names (`addToast`, `removeToast`, `setToastConfig`) are
 * preserved verbatim. `show`, `dismiss`, `configure`, `clear`, and the
 * type-specific helpers (`success`, `error`, `warning`, `info`) are aliases
 * provided for ergonomics.
 *
 * @example
 * const { addToast } = useToast();
 * addToast({ type: 'success', message: 'Saved!' });
 *
 * @example
 * const { success, error } = useToast();
 * success('Saved!');
 * error({ title: 'Oops', message: 'Try again' });
 */
const useToast = (): ToastApi => toast;

export default useToast;
