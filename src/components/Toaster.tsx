import type React from 'react';
import { useEffect, useRef } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import toastStore from '../store/toastStore';
import { useToastConfig, useToastIds } from '../store/useToastSelector';
import type { ToasterProps } from '../types';
import ToastContainer from './ToastContainer';

let mountedInstances = 0;

/**
 * Mount point for the toast stack. Replaces the v3 `<ToastProvider>`.
 *
 * Render once anywhere in your tree (typically as a sibling of your app
 * root). Renders nothing until the first toast appears, so it has zero cost
 * when idle. There is no Context boundary, so components calling
 * {@link useToast} are not subscribed to toast state and never re-render
 * when toasts change.
 *
 * @remarks
 * - Mount only **one** instance. A development-mode warning fires if more
 *   than one is mounted; only the first is honored.
 * - The component lazily renders `<ToastContainer />` once toasts exist.
 * - The optional `config` prop is merged into the store on mount and
 *   re-applied whenever the prop reference changes.
 *
 * @example Minimal setup
 * ```tsx
 * import { Toaster } from 'react-native-rooster';
 *
 * export default function App() {
 *   return (
 *     <>
 *       <RootNavigator />
 *       <Toaster />
 *     </>
 *   );
 * }
 * ```
 *
 * @example With initial configuration
 * ```tsx
 * <Toaster
 *   config={{
 *     placement: 'top',
 *     timeToDismiss: 4000,
 *     swipeToDismiss: true,
 *   }}
 * />
 * ```
 *
 * @see {@link useToast} — access the toast API from a component.
 * @see {@link toast} — access the toast API outside React.
 */
const Toaster: React.FC<ToasterProps> = ({ config }) => {
  const ids = useToastIds();
  const liveConfig = useToastConfig();
  const lastConfigRef = useRef<typeof config>(undefined);

  // Apply the `config` prop into the store on mount and whenever it changes.
  useEffect(() => {
    if (!config) return;
    if (lastConfigRef.current === config) return;
    lastConfigRef.current = config;
    toastStore.setConfig(config);
  }, [config]);

  // Single-instance dev warning to surface common mistakes.
  useEffect(() => {
    mountedInstances += 1;
    if (__DEV__ && mountedInstances > 1) {
      // eslint-disable-next-line no-console
      console.warn(
        '[react-native-rooster] More than one <Toaster /> is mounted. ' +
          'Only one should exist in the tree; behaviour with multiple ' +
          'instances is unsupported.',
      );
    }
    return () => {
      mountedInstances -= 1;
    };
  }, []);

  const handleRemove = (id: string) => toastStore.remove(id);

  // Lazy: render nothing until the first toast appears. Keeps the SafeArea
  // provider tree absent when idle so consumers can mount Toaster anywhere
  // without paying a cost.
  if (ids.length === 0) return null;

  return (
    <SafeAreaProvider>
      <ToastContainer
        ids={ids}
        toastConfig={liveConfig}
        onRemove={handleRemove}
      />
    </SafeAreaProvider>
  );
};

export default Toaster;
