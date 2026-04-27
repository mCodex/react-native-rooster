import { useSyncExternalStore } from 'react';

import type { ToastConfig, ToastMessage } from '../types';
import toastStore from './toastStore';

/**
 * Subscribe to the visible toast id list. Causes the consumer to re-render
 * only when ids are added/removed/reordered (microtask-batched).
 */
export const useToastIds = (): string[] =>
  useSyncExternalStore(
    toastStore.subscribeIds,
    toastStore.getIds,
    toastStore.getIds,
  );

/**
 * Subscribe to the active global {@link ToastConfig}. Re-renders only when the
 * config object reference changes (after `setConfig` / `configure` calls).
 */
export const useToastConfig = (): ToastConfig =>
  useSyncExternalStore(
    toastStore.subscribeConfig,
    toastStore.getConfig,
    toastStore.getConfig,
  );

/**
 * Subscribe to a single toast message by id. Returns `undefined` while the
 * message is unmounted. Per-id subscriptions ensure sibling toasts never
 * re-render when one toast updates.
 */
export const useToastMessage = (id: string): ToastMessage | undefined => {
  const subscribe = (listener: () => void) =>
    toastStore.subscribeMessage(id, listener);
  const getSnapshot = () => toastStore.getMessage(id);
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
};
