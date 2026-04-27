import { DEFAULT_TOAST_CONFIG } from '../constants/defaultConfig';
import type { ToastConfig, ToastMessage } from '../types';
import createToastId from '../utils/createToastId';
import mergeToastConfig from '../utils/mergeToastConfig';

/**
 * Module-level external store backing the Toaster, useToast hook and `toast`
 * imperative facade.
 *
 * Design goals:
 * - Zero React context. Subscriptions are scoped to the smallest possible slice
 *   so per-toast components only re-render when their own message changes.
 * - Microtask-batched dispatch — a burst of `add()` calls produces a single
 *   notification per slice.
 * - Bounded mount cost via `maxVisible` + `overflow` ('evict' | 'queue').
 * - Hover/focus pause for WCAG 2.2 SC 2.2.1 (Timing Adjustable).
 * - Auto-dismiss timers live here, not in components — survives mid-flight
 *   re-renders and never leaks on unmount.
 */

type Listener = () => void;

interface InternalState {
  /** Currently visible toasts, in insertion order (oldest first). */
  messages: ToastMessage[];
  /** O(1) id→message lookup, kept in sync with `messages`. */
  byId: Map<string, ToastMessage>;
  /** Stable reference to the visible message ids. */
  ids: string[];
  /** Pending toasts waiting for a slot when overflow === 'queue'. */
  queue: Array<Omit<ToastMessage, 'id'> & { id: string }>;
  /** Active config (deep-merged from {@link DEFAULT_TOAST_CONFIG}). */
  config: ToastConfig;
}

const FAST_EVICT_DURATION = 120;

const createState = (): InternalState => ({
  messages: [],
  byId: new Map(),
  ids: [],
  queue: [],
  config: DEFAULT_TOAST_CONFIG,
});

let state: InternalState = createState();

/* ------------------------------------------------------------------------- */
/* Subscriptions                                                             */
/* ------------------------------------------------------------------------- */

const idsListeners = new Set<Listener>();
const configListeners = new Set<Listener>();
const messageListeners = new Map<string, Set<Listener>>();

const notifyIds = () => {
  for (const l of idsListeners) l();
};
const notifyConfig = () => {
  for (const l of configListeners) l();
};
const notifyMessage = (id: string) => {
  const listeners = messageListeners.get(id);
  if (!listeners) return;
  for (const l of listeners) l();
};

/* ------------------------------------------------------------------------- */
/* Microtask batching                                                        */
/* ------------------------------------------------------------------------- */

const scheduleMicrotask: (cb: () => void) => void =
  typeof queueMicrotask === 'function'
    ? queueMicrotask
    : (cb) => Promise.resolve().then(cb);

let pendingFlush = false;
const pendingIdsNotify = { current: false };
const pendingConfigNotify = { current: false };
const pendingMessageNotify = new Set<string>();

const flush = () => {
  pendingFlush = false;
  if (pendingIdsNotify.current) {
    pendingIdsNotify.current = false;
    notifyIds();
  }
  if (pendingConfigNotify.current) {
    pendingConfigNotify.current = false;
    notifyConfig();
  }
  if (pendingMessageNotify.size > 0) {
    // Drain in-place — avoids the intermediate Array.from() allocation.
    const ids = pendingMessageNotify;
    const drained: string[] = [];
    for (const id of ids) drained.push(id);
    ids.clear();
    for (let i = 0; i < drained.length; i += 1)
      notifyMessage(drained[i] as string);
  }
};

const requestFlush = () => {
  if (pendingFlush) return;
  pendingFlush = true;
  scheduleMicrotask(flush);
};

const queueIdsNotification = () => {
  pendingIdsNotify.current = true;
  requestFlush();
};

const queueConfigNotification = () => {
  pendingConfigNotify.current = true;
  requestFlush();
};

const queueMessageNotification = (id: string) => {
  pendingMessageNotify.add(id);
  requestFlush();
};

/* ------------------------------------------------------------------------- */
/* Auto-dismiss timers                                                       */
/* ------------------------------------------------------------------------- */

interface TimerEntry {
  handle: ReturnType<typeof setTimeout>;
  remaining: number;
  startedAt: number;
  paused: boolean;
}

const timers = new Map<string, TimerEntry>();

const clearTimer = (id: string) => {
  const entry = timers.get(id);
  if (entry) {
    clearTimeout(entry.handle);
    timers.delete(id);
  }
};

const startTimer = (id: string, duration: number) => {
  clearTimer(id);
  if (duration <= 0 || !Number.isFinite(duration)) return;
  const handle = setTimeout(() => {
    timers.delete(id);
    remove(id);
  }, duration);
  timers.set(id, {
    handle,
    remaining: duration,
    startedAt: Date.now(),
    paused: false,
  });
};

/* ------------------------------------------------------------------------- */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------- */

const computeIds = (messages: ToastMessage[]): string[] => {
  const out = new Array<string>(messages.length);
  for (let i = 0; i < messages.length; i += 1)
    out[i] = (messages[i] as ToastMessage).id;
  return out;
};

const idsEqual = (a: string[], b: string[]): boolean => {
  if (a === b) return true;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
  return true;
};

/** Rebuild the byId index from a fresh messages array. */
const rebuildIndex = (messages: ToastMessage[]): Map<string, ToastMessage> => {
  const map = new Map<string, ToastMessage>();
  for (let i = 0; i < messages.length; i += 1) {
    const m = messages[i] as ToastMessage;
    map.set(m.id, m);
  }
  return map;
};

const setMessages = (next: ToastMessage[]) => {
  state.messages = next;
  state.byId = rebuildIndex(next);
  const nextIds = computeIds(next);
  if (!idsEqual(state.ids, nextIds)) {
    state.ids = nextIds;
    queueIdsNotification();
  }
};

const effectiveDurationFor = (message: ToastMessage): number => {
  if (state.config.disableAutoDismiss) return 0;
  return message.duration ?? state.config.timeToDismiss;
};

const promoteFromQueue = () => {
  const max = state.config.maxVisible ?? Number.POSITIVE_INFINITY;
  if (state.queue.length === 0 || state.messages.length >= max) return;

  // Batch every promotion into a single setMessages() call so listeners
  // are notified once and ids are allocated once.
  const promoted: typeof state.queue = [];
  while (
    state.queue.length > 0 &&
    state.messages.length + promoted.length < max
  ) {
    const next = state.queue.shift();
    if (!next) break;
    promoted.push(next);
  }
  if (promoted.length === 0) return;

  setMessages(state.messages.concat(promoted));
  for (let i = 0; i < promoted.length; i += 1) {
    const next = promoted[i] as (typeof promoted)[number];
    startTimer(next.id, effectiveDurationFor(next));
  }
};

/* ------------------------------------------------------------------------- */
/* Actions                                                                   */
/* ------------------------------------------------------------------------- */

const add = (input: Omit<ToastMessage, 'id'>): string => {
  const message: ToastMessage = { id: createToastId(), ...input };
  const max = state.config.maxVisible ?? Number.POSITIVE_INFINITY;

  if (state.messages.length >= max) {
    if ((state.config.overflow ?? 'evict') === 'queue') {
      state.queue = state.queue.concat(message);
      return message.id;
    }
    // 'evict' — drop the oldest with a fast exit
    const evicted = state.messages[0];
    if (evicted) {
      // Re-arm timer to fire (almost) immediately so the UI plays exit anim
      clearTimer(evicted.id);
      startTimer(evicted.id, FAST_EVICT_DURATION);
    }
  }

  setMessages(state.messages.concat(message));
  startTimer(message.id, effectiveDurationFor(message));
  return message.id;
};

const remove = (id?: string) => {
  if (state.messages.length === 0 && state.queue.length === 0) return;
  let target = id;
  if (!target) {
    const last = state.messages[state.messages.length - 1];
    target = last?.id;
  }
  if (!target) return;

  // Strip from queue first (cheaper, no timer). Single pass.
  if (state.queue.length > 0) {
    const queueIndex = state.queue.findIndex((m) => m.id === target);
    if (queueIndex >= 0) {
      const nextQueue = state.queue.slice();
      nextQueue.splice(queueIndex, 1);
      state.queue = nextQueue;
      return;
    }
  }

  // O(1) membership check via index.
  if (!state.byId.has(target)) return;

  clearTimer(target);
  setMessages(state.messages.filter((m) => m.id !== target));
  messageListeners.delete(target);
  promoteFromQueue();
};

const clear = () => {
  for (const m of state.messages) clearTimer(m.id);
  state.messages = [];
  state.byId.clear();
  state.queue = [];
  if (state.ids.length > 0) {
    state.ids = [];
    queueIdsNotification();
  }
  messageListeners.clear();
};

const setConfig = (partial: Partial<ToastConfig>) => {
  state.config = mergeToastConfig(state.config, partial);
  queueConfigNotification();
  promoteFromQueue();
};

const updateMessage = (id: string, patch: Partial<ToastMessage>) => {
  const current = state.byId.get(id);
  if (!current) return;
  // Locate index without a second linear scan when possible.
  const idx = state.messages.indexOf(current);
  if (idx < 0) return;
  const updated: ToastMessage = { ...current, ...patch, id };
  const next = state.messages.slice();
  next[idx] = updated;
  state.messages = next;
  state.byId.set(id, updated);
  queueMessageNotification(id);
};

const pause = (id: string) => {
  const entry = timers.get(id);
  if (!entry || entry.paused) return;
  clearTimeout(entry.handle);
  const elapsed = Date.now() - entry.startedAt;
  const remaining = Math.max(0, entry.remaining - elapsed);
  timers.set(id, { ...entry, remaining, paused: true });
};

const resume = (id: string) => {
  const entry = timers.get(id);
  if (!entry?.paused) return;
  startTimer(id, entry.remaining);
};

/* ------------------------------------------------------------------------- */
/* Selectors                                                                 */
/* ------------------------------------------------------------------------- */

const getIds = (): string[] => state.ids;
const getConfig = (): ToastConfig => state.config;
const getMessage = (id: string): ToastMessage | undefined => state.byId.get(id);
const getMessages = (): ToastMessage[] => state.messages;

/* ------------------------------------------------------------------------- */
/* Subscription registration                                                 */
/* ------------------------------------------------------------------------- */

const subscribeIds = (listener: Listener): (() => void) => {
  idsListeners.add(listener);
  return () => idsListeners.delete(listener);
};

const subscribeConfig = (listener: Listener): (() => void) => {
  configListeners.add(listener);
  return () => configListeners.delete(listener);
};

const subscribeMessage = (id: string, listener: Listener): (() => void) => {
  let bucket = messageListeners.get(id);
  if (!bucket) {
    bucket = new Set();
    messageListeners.set(id, bucket);
  }
  bucket.add(listener);
  return () => {
    bucket?.delete(listener);
    if (bucket && bucket.size === 0) {
      messageListeners.delete(id);
    }
  };
};

/* ------------------------------------------------------------------------- */
/* Test reset (internal)                                                     */
/* ------------------------------------------------------------------------- */

const __resetForTests = () => {
  for (const t of timers.values()) clearTimeout(t.handle);
  timers.clear();
  idsListeners.clear();
  configListeners.clear();
  messageListeners.clear();
  pendingMessageNotify.clear();
  pendingIdsNotify.current = false;
  pendingConfigNotify.current = false;
  pendingFlush = false;
  state = createState();
};

const toastStore = {
  add,
  remove,
  clear,
  setConfig,
  updateMessage,
  pause,
  resume,
  getIds,
  getConfig,
  getMessage,
  getMessages,
  subscribeIds,
  subscribeConfig,
  subscribeMessage,
  __resetForTests,
};

export type ToastStore = typeof toastStore;
export default toastStore;
