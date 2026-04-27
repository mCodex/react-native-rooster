# 🐔 react-native-rooster

<div align="center">

**Providerless, high-performance toast notifications for React Native**

![Version](https://img.shields.io/badge/version-4.0.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue?style=for-the-badge)
![WCAG](https://img.shields.io/badge/WCAG-2.2%20AA-brightgreen?style=for-the-badge)

*No provider • No external animations • WCAG 2.2 AA • TypeScript-first*

</div>

---

## ✨ What's new in v4

- 🪶 **Providerless.** Drop a single `<Toaster />` anywhere in the tree — no `<Context.Provider>` wrapping required.
- 📡 **External store + `useSyncExternalStore`.** Per-toast subscriptions: a thousand sibling toasts won't trigger sibling re-renders.
- ⚡ **Microtask-batched dispatch.** Bursts of `toast.show()` collapse into a single render commit.
- 🎬 **Smooth, dependency-free animation.** Native-driver `Animated` only. No Reanimated, no gesture-handler.
- ♿ **WCAG 2.2 AA.** Reduce-motion (SC 2.3.3), 24×24 hit-targets (SC 2.5.8), live regions, full keyboard support.
- 👆 **Opt-in swipe-to-dismiss** using core `PanResponder`.
- 🎯 **Zero new peer deps.** Same install footprint as v3.

---

## 📦 Installation

```bash
yarn add react-native-rooster react-native-safe-area-context
# or
npm install react-native-rooster react-native-safe-area-context
```

---

## 🚀 Quick Start

```tsx
import { Toaster, useToast } from 'react-native-rooster';
import { Pressable, Text, View } from 'react-native';

function Screen() {
  const { addToast } = useToast();

  return (
    <View>
      <Pressable onPress={() => addToast({ message: 'Saved!', type: 'success' })}>
        <Text>Save</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  return (
    <>
      <Screen />
      <Toaster />
    </>
  );
}
```

`<Toaster />` renders nothing until the first toast is added (lazy mount).

### Recommended: the `useToast` hook

For most React Native apps written today (function components + hooks), the `useToast` hook is the most ergonomic entry point. It returns the **same singleton API** as the imperative `toast` object, but lives inside the React tree so destructured methods feel natural in event handlers.

```tsx
import { useToast } from 'react-native-rooster';
import { Pressable, Text, View } from 'react-native';

function SaveButton() {
  // The hook returns a stable reference. It does NOT subscribe to toast
  // state, so this component never re-renders when toasts change.
  const { success, error } = useToast();

  const onPress = async () => {
    try {
      await api.save();
      success('Saved!');
    } catch (e) {
      error({ title: 'Oops', message: 'Try again', duration: 5000 });
    }
  };

  return (
    <Pressable onPress={onPress}>
      <Text>Save</Text>
    </Pressable>
  );
}
```

**Why prefer the hook?**

- ✅ Stable reference — safe to put in `useCallback`/`useEffect` dep arrays without causing re-runs.
- ✅ Zero re-renders — the hook does not subscribe to store updates.
- ✅ Full TypeScript autocomplete on every method, including the `success` / `error` / `warning` / `info` shortcuts.
- ✅ Same `id` is returned from each method, so you can dismiss precisely:
  ```tsx
  const { addToast, dismiss } = useToast();
  const id = addToast({ message: 'Uploading…', duration: 0 });
  // later, when upload completes:
  dismiss(id);
  ```

> **Tip:** `useToast()` and the imperative `toast` are interchangeable — they share the same store. Use the hook inside components and the imperative facade in services / interceptors / reducers.

### Imperative usage (no hook required)

```ts
import { toast } from 'react-native-rooster';

toast.success('Saved!');
toast.error({ title: 'Oops', message: 'Something went wrong' });
toast.info('Heads up');
toast.warning('Be careful');
toast.show({ message: 'Custom toast', type: 'info', duration: 2000 });
toast.dismiss();   // dismiss most recent
toast.clear();     // dismiss all
toast.configure({ timeToDismiss: 5000 });
```

The `toast` object works **outside of any component** — perfect for API clients, error boundaries, and reducers.

---

## ⚙️ Configuration

Pass a `config` prop to `<Toaster />` or call `toast.configure(...)` at runtime.

```tsx
<Toaster
  config={{
    timeToDismiss: 3000,
    maxVisible: 5,
    overflow: 'evict',          // 'evict' | 'queue'
    swipeToDismiss: true,
    staggerMs: 30,
    placement: 'bottom',
    horizontalPosition: 'center',
    bgColor: { success: '#16a34a', error: '#dc2626', warning: '#d97706', info: '#2563eb' },
    font: { titleFontSize: 16, messageFontSize: 14 },
  }}
/>
```

| Option | Default | Description |
| --- | --- | --- |
| `timeToDismiss` | `3000` | ms before auto-dismiss. `0` keeps the toast pinned. |
| `maxVisible` | `5` | Maximum visible toasts at once. |
| `overflow` | `'evict'` | `'evict'` removes the oldest, `'queue'` waits for a slot. |
| `swipeToDismiss` | `false` | Enables horizontal swipe-to-dismiss (PanResponder). |
| `staggerMs` | `30` | Delay between successive toast entrance animations. |
| `respectFocus` | `true` | Pause auto-dismiss while focused/hovered. |
| `disableAutoDismiss` | `false` | Disable timers globally. |
| `highContrast` | `false` | Boost contrast for low-vision users. |
| `placement` | `'bottom'` | `'top'` or `'bottom'`. |
| `horizontalPosition` | `'center'` | `'left'`, `'center'`, or `'right'`. |

See `src/types.ts` for the full type definition.

---

## 📡 API

| Symbol | Description |
| --- | --- |
| `Toaster` | Mount once near the root; renders the toast stack lazily. |
| `useToast()` | Returns the same `toast` object — re-render-free. |
| `toast` | Imperative facade callable from anywhere. |
| `configureToast(config)` | Alias for `toast.configure(...)`. |

### `ToastApi`

```ts
type ToastApi = {
  addToast(input: string | ToastInput): string;
  show(input: string | ToastInput): string;       // alias
  removeToast(id?: string): void;
  dismiss(id?: string): void;                     // alias
  clear(): void;
  setToastConfig(config: Partial<ToastConfig>): void;
  configure(config: Partial<ToastConfig>): void;  // alias
  success(input: string | ToastInput): string;
  error(input: string | ToastInput): string;
  warning(input: string | ToastInput): string;
  info(input: string | ToastInput): string;
};
```

Every method that adds a toast returns its **id**, which you can pass to `removeToast(id)` for fine-grained control.

---

## ♿ Accessibility (WCAG 2.2 AA)

| SC | Requirement | How Rooster handles it |
| --- | --- | --- |
| 1.4.3 | Contrast minimum 4.5:1 | Default palette ships compliant. Override per type via `config.bgColor`. |
| 2.1.1 | Keyboard accessible | Toasts are focusable; <kbd>Escape</kbd> dismisses. |
| 2.2.1 | Timing adjustable | Auto-dismiss pauses on focus/hover; `disableAutoDismiss` opts out globally. |
| 2.3.3 | Animation from interactions | Reduce Motion fades only — no translation, halved durations. |
| 2.5.8 | Target size ≥ 24×24 | `Pressable` + 12dp `hitSlop` on every side. |
| 4.1.3 | Status messages | `accessibilityLiveRegion` set per type (errors/warnings = `assertive`). |

---

## ⚡ Performance & multi-toast queue

Rooster is engineered for bursts:

1. **Per-toast subscriptions.** Each toast subscribes via `useSyncExternalStore` to its own slice — sibling updates don't propagate.
2. **Microtask-batched dispatch.** Calling `toast.show()` 50 times in the same tick produces a single render commit.
3. **`maxVisible` + `overflow`.** Stay smooth under load. With `overflow: 'evict'` (default), the oldest visible toast slides out gracefully when capacity is exceeded; with `overflow: 'queue'`, extras wait off-screen.
4. **Native-driver animations only.** Every entrance/exit runs on the UI thread.
5. **No external animation dependencies.** Zero impact on app startup.

```ts
toast.configure({ maxVisible: 3, overflow: 'queue' });
for (let i = 0; i < 100; i += 1) toast.success(`Notification ${i}`);
```

---

## 🔄 Migration: v3 → v4

The migration is a **single rename** in 99% of apps.

| v3 | v4 |
| --- | --- |
| `import { ToastProvider } from 'react-native-rooster'` | `import { Toaster } from 'react-native-rooster'` |
| `<ToastProvider>{children}</ToastProvider>` | `<>{children}<Toaster /></>` |
| `<ToastProvider initialConfig={cfg}>` | `<Toaster config={cfg} />` |
| `useToast()` | `useToast()` *(unchanged)* |
| `addToast`, `removeToast`, `setToastConfig` | *(unchanged)* |
| `ToastContextProps`, `ToastProviderProps` *(deprecated v3 type aliases)* | Removed — use `ToastApi` and `ToasterProps` |

There is **no Context** anymore. `useToast()` returns the same singleton `toast` object — components no longer re-render when toasts change.

```diff
- import { ToastProvider, useToast } from 'react-native-rooster';
+ import { Toaster, useToast } from 'react-native-rooster';

  export default function App() {
    return (
-     <ToastProvider initialConfig={{ timeToDismiss: 4000 }}>
-       <Screen />
-     </ToastProvider>
+     <>
+       <Screen />
+       <Toaster config={{ timeToDismiss: 4000 }} />
+     </>
    );
  }
```

> **Note:** Mounting more than one `<Toaster />` logs a development warning — only the first one is honored.

### Why these changes?

| Change | Reason |
| --- | --- |
| **Provider → `<Toaster />` sibling** | Eliminates a Context boundary. With `useSyncExternalStore`, components that call `useToast()` no longer re-render when toasts change — only the `Toaster` itself does. Apps with deeply-nested providers see immediate render-cost savings. |
| **External store + per-id subscriptions** | Each visible toast subscribes to its own slice of state. Adding/updating one toast can no longer cascade into sibling re-renders, so 50 stacked toasts stay buttery smooth. |
| **Microtask-batched dispatch** | Bursts of `toast.show()` calls collapse into a single render commit instead of one per call — important for retries, multi-error flows, and stress tests. |
| **`maxVisible` + `overflow`** | Prevents runaway stacks. Defaults (`maxVisible: 5`, `overflow: 'evict'`) keep the screen usable even under load; opt into `'queue'` if you'd rather show every toast in order. |
| **Native-driver `Animated` only — no Reanimated, no gesture-handler** | Zero new peer dependencies. Animations run on the UI thread and the install footprint stays identical to v3. |
| **WCAG 2.2 AA defaults (reduce-motion, 24×24 hit-targets, live regions, ESC to dismiss)** | Compliance shouldn't be opt-in. Reduce-motion is honored automatically; auto-dismiss pauses on focus/hover. |
| **Single, minimal entry point** | The package exposes a small public surface: `Toaster`, `useToast`, `toast`, `configureToast`, plus the type definitions. Combined with `"sideEffects": false`, bundlers strip everything you don't use — no need for subpath imports or extra ceremony. |
| **Removed deprecated `ToastContextProps` / `ToastProviderProps` aliases** | They were holdovers from the Context era. v4 uses the canonical `ToastApi` and `ToasterProps` names. |
| **Single shared `HapticFeedback` type** | Was duplicated as a 7-member union in two places; now a single named alias kept in sync automatically. |

---

## 🧪 Testing

Wrap store mutations that trigger renders in async `act()`:

```ts
import { act } from '@testing-library/react-native';

await act(async () => {
  toast.success('hi');
});
```

---

## 🛠️ Local development

```bash
yarn install
yarn workspace react-native-rooster-example start
yarn test
yarn lint
yarn typecheck
yarn prepare         # build with react-native-builder-bob
```

---

## 📄 License

MIT © [Mateus Andrade](https://github.com/mCodex)
