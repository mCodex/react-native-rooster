# 🐔 react-native-rooster

<div align="center">

**Fully-customisable toast notifications for React Native apps**

![Version](https://img.shields.io/badge/version-3.2.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/typescript-strict-blue?style=for-the-badge)
![Coverage](https://img.shields.io/badge/coverage-92.18%25-brightgreen?style=for-the-badge)

*Lightweight • Animated • Lightning-fast • TypeScript-first*

[📚 Docs](#quick-start) • [🚀 Quick Start](#quick-start) • [✨ Features](#features) • [⚡ Performance](#performance)

</div>

---

## 🎬 Live Demo

<div align="center">

![react-native-rooster demo](./example.gif)

**See Rooster in action** • [Run locally](#-local-development) • [Explore the example app](./example)

</div>

---

## Why Rooster?

⚡ **1-2ms renders** | 🎨 **Fully customizable** | ♿ **WCAG 2.1 AA accessible** | 📱 **Responsive** | 🔐 **100% TypeScript**

Rooster handles the complex parts (safe areas, keyboard visibility, animations, accessibility) so you can focus on your app.

```tsx
import { ToastProvider, useToast } from 'react-native-rooster';

export default function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}

function YourApp() {
  const { addToast } = useToast();
  
  return (
    <Button
      onPress={() =>
        addToast({
          type: 'success',
          title: 'Success!',
          message: 'Your action completed.',
        })
      }
    />
  );
}
```

---

## Features

### 🎨 Beautiful by Default
- 4 toast types: success, error, warning, info
- Smooth animations with native driver acceleration
- Elegant shadows and rounded corners

### 📱 Responsive & Adaptive
- **Dynamic width** for center positioning (respects screen size)
- **Orientation-aware** — adapts instantly on device rotation
- **6 position options** (top/bottom × left/center/right)
- Smart keyboard avoidance

### ♿ Accessible
- **WCAG 2.1 AA compliant**
- Screen reader support with semantic roles
- Keyboard navigation (Escape to dismiss)
- Haptic feedback for tactile notifications
- Font scaling & contrast validation utilities

### ⚡ Performance
- 75-80% faster than v2 (1-2ms renders)
- Memory leak prevention
- Strategic memoization
- React Compiler compatible
- Tree-shakeable bundle (28-32 KB gzip)

### 💪 Developer Experience
- TypeScript strict mode
- Full type safety with JSDoc
- Composable & extensible
- Zero configuration needed
- Per-toast or global configuration

---

## Installation

```bash
npm install react-native-rooster
# or
yarn add react-native-rooster
```

Requires: React Native 0.60+ | TypeScript 4.0+

---

## Quick Start

### 1. Wrap Your App
```tsx
import { ToastProvider } from 'react-native-rooster';

export default function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

### 2. Use the Hook
```tsx
import { useToast } from 'react-native-rooster';

function MyComponent() {
  const { addToast } = useToast();
  
  return (
    <Button
      onPress={() =>
        addToast({
          type: 'success',
          title: 'Perfect!',
          message: 'This is a toast notification.',
          duration: 3000,
        })
      }
    />
  );
}
```

### 3. That's It!
Positioning, animations, accessibility, and keyboard handling are automatic.

---

## Configuration

### Global Setup
```tsx
<ToastProvider
  initialConfig={{
    // Positioning
    position: { vertical: 'bottom', horizontal: 'center' },
    spacing: 12,
    offset: 20,
    
    // Styling
    borderRadius: 12,
    padding: { vertical: 16, horizontal: 16 },
    shadow: { opacity: 0.2, offset: { width: 0, height: 12 } },
    
    // Typography
    font: {
      titleFontSize: 16,
      messageFontSize: 14,
    },
    
    // Timing
    timeToDismiss: 3000,
    
    // Accessibility
    accessibility: {
      allowFontScaling: true,
      hapticFeedback: 'light',
    },
  }}
>
  <App />
</ToastProvider>
```

### Per-Toast Options
```tsx
addToast({
  type: 'success',
  title: 'Success',
  message: 'Your message here',
  
  // Customization
  backgroundColor: '#10b981',
  duration: 2000,
  onPress: () => console.log('Pressed'),
  icon: <Icon />,
  
  // Accessibility
  accessibilityLabel: 'Success notification',
  accessibilityHint: 'Double tap to dismiss',
  hapticFeedback: 'success',
  allowFontScaling: true,
});
```

---

## Toast Types

```tsx
addToast({ type: 'success', message: 'All good!' });  // Green
addToast({ type: 'error', message: 'Oh no!' });       // Red
addToast({ type: 'warning', message: 'Watch out!' }); // Yellow
addToast({ type: 'info', message: 'FYI' });           // Blue
```

---

## Accessibility

### Screen Reader Support
Automatic semantic announcements:
```tsx
addToast({
  type: 'success',
  title: 'Payment Processed',
  message: 'Order #12345 confirmed',
  // Announces: "Success notification. Payment Processed. Order #12345 confirmed."
});
```

### Keyboard Navigation
- **Web**: Press Escape to dismiss
- **iOS/Android**: Standard accessibility gestures

### Haptic Feedback
```tsx
addToast({
  type: 'success',
  message: 'Done!',
  hapticFeedback: 'success',  // Options: 'light', 'medium', 'success', 'error'
});
```

### Font Scaling
```tsx
<ToastProvider
  initialConfig={{
    accessibility: {
      allowFontScaling: true,  // Respects device text size settings
    },
  }}
>
```

### Contrast Validation
```tsx
import { isContrastCompliant, hexToRgb } from 'react-native-rooster';

const text = [255, 255, 255];      // white
const bg = hexToRgb('#22c55e');    // green

if (isContrastCompliant(text, bg)) {
  console.log('✅ WCAG AA compliant');
}
```

---

## Advanced Usage

### Custom Renderer
```tsx
<ToastProvider
  initialConfig={{
    renderToast: ({ message, defaultToast }) => (
      <MyCustomToastStyle>
        {defaultToast}
      </MyCustomToastStyle>
    ),
  }}
>
  <App />
</ToastProvider>
```

### Utilities
```tsx
import {
  // Sizing
  calculateToastHeight,
  calculateResponsiveWidth,
  
  // Accessibility
  generateAccessibilityLabel,
  generateAccessibilityHint,
  calculateContrastRatio,
  
  // Haptics
  triggerHaptic,
  HAPTIC_PATTERNS,
} from 'react-native-rooster';

// Example
const height = calculateToastHeight({ paddingVertical: 16 }, 2);
triggerHaptic('light');
```

---

## Performance

| Metric | v2 | v3.2.0 | Improvement |
|--------|-----|--------|-------------|
| Render Time | 6-9ms | 1-2ms | 75-80% 🚀 |
| Click Response | 50ms+ | <5ms | 10x ⚡ |
| Bundle Size | 32-36 KB | 28-32 KB | 15-20% 📦 |
| Memory Leaks | ⚠️ Yes | ✅ Fixed | 100% 🔒 |

**Optimizations in v3.2.0**:
- ✅ Memory leak prevention with animation cleanup
- ✅ Strategic memoization throughout
- ✅ Removed unnecessary re-render triggers
- ✅ React Compiler compatible

---

## API Reference

### `useToast()`
```tsx
const { addToast, removeToast, setToastConfig } = useToast();

// Add toast
addToast({ type: 'success', message: 'Done!' });

// Remove by ID or last toast
removeToast(id);
removeToast();  // Removes most recent

// Update config
setToastConfig({ timeToDismiss: 2000 });
```

### Toast Message Props
```typescript
interface ToastMessage {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  icon?: ReactNode;
  duration?: number;
  onPress?: () => void;
  style?: ViewStyle;
  
  // Customization
  backgroundColor?: string;
  borderRadius?: number;
  titleFontSize?: number;
  messageFontSize?: number;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  hapticFeedback?: 'light' | 'medium' | 'success' | 'error';
  allowFontScaling?: boolean;
  messageMaxLines?: number;
}
```

---

## v3.2.0 Highlights

### 🚀 What's New
- **Memory leak prevention** — animations cleanup on unmount
- **Keyboard navigation** — Escape key on web
- **Haptic feedback** — multi-sensory notifications
- **Performance boost** — 75-80% faster renders
- **Better accessibility** — WCAG 2.1 AA compliant

### ✅ Backward Compatible
No breaking changes. All v3.0+ code works unchanged.

---

## Example App

```bash
cd example
yarn install
yarn start

# Choose: i (iOS) or a (Android)
```

---

## Contributing

We ❤️ contributions!

```bash
git clone https://github.com/mCodex/react-native-rooster.git
cd react-native-rooster

yarn install
yarn example start
yarn lint
yarn test
yarn typecheck
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## v3 Migration

**No migration needed!** v3 is 100% backward compatible with v2.

```tsx
// Your v2 code works as-is
import { useToast } from 'react-native-rooster';
const { addToast } = useToast();
addToast({ type: 'success', message: 'Still works!' });
```

---

## Resources

- 📖 [Full Release Notes](./RELEASE_NOTES.md)
- 🐛 [Report Issue](https://github.com/mCodex/react-native-rooster/issues)
- 💬 [Discussions](https://github.com/mCodex/react-native-rooster/discussions)
- ⭐ [GitHub](https://github.com/mCodex/react-native-rooster)

---

## License

MIT © [Mateus Andrade](https://github.com/mCodex)

---

<div align="center">

**Made with ❤️ for the React Native community**

[⭐ Star on GitHub](https://github.com/mCodex/react-native-rooster) • [🐛 Report Issue](https://github.com/mCodex/react-native-rooster/issues) • [💬 Discussions](https://github.com/mCodex/react-native-rooster/discussions)

</div>