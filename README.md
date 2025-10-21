# 🐔 react-native-rooster

Fully-customisable toast notifications for React Native apps. Lightweight, animated, and built for delightful UX.

> [!TIP]
> Ready to try it out? Jump straight to the [Quick Start](#-quick-start) and ship your first toast in under a minute.

## 📚 Table of Contents

- [Why Rooster?](#-why-rooster)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Features](#-features)
- [Configuration Reference](#-configuration-reference)
- [Composable API](#-composable-api)
- [Designing Beautiful Toasts](#-designing-beautiful-toasts)
- [Performance Notes](#-performance-notes)
- [Example App](#-example-app)
- [Contributing](#-contributing)
- [Community & Support](#-community--support)
- [License](#-license)

## ❓ Why Rooster?

- ✅ **Production-proven API** – stable method signatures preserved from v1.
- 🎨 **Pixel-perfect theming** out of the box with font, colour, and layout overrides.
- ⚡️ **Smooth animation** powered by the native driver with configurable easing.
- 🧩 **Composable architecture** – render your own toast card or use the provided one.
- 💪 **TypeScript first** – complete declarations and JSDoc hints for confident usage.

> [!NOTE]
> Rooster respects safe areas and keyboard height automatically, making toasts safe for devices with notches or when the keyboard is visible.

## 📦 Installation

Using your preferred package manager:

```sh
yarn add react-native-rooster
# or
npm install react-native-rooster
```

`react-native-safe-area-context` is declared as a peer dependency. If you do not already depend on it:

```sh
yarn add react-native-safe-area-context
```

## 🚀 Quick Start

Wrap your app in the provider and start firing toasts from anywhere with the `useToast` hook.

```tsx
import React from 'react';
import { Button, SafeAreaView } from 'react-native';
import { ToastProvider, useToast } from 'react-native-rooster';

const Demo = () => {
	const { addToast } = useToast();

	return (
		<SafeAreaView>
			<Button
				title="Show toast"
				onPress={() => {
					addToast({
						type: 'success',
						title: 'Profile updated',
						message: 'Your changes were saved successfully.',
					});
				}}
			/>
		</SafeAreaView>
	);
};

export default function App() {
	return (
		<ToastProvider>
			<Demo />
		</ToastProvider>
	);
}
```

> [!IMPORTANT]
> Always mount `ToastProvider` **once** near the root of your tree. Every component below it can call `useToast()` without prop drilling.

## ✨ Features

- 🌈 **Themes & fonts** – override per-variant colours and fonts.
- 🪄 **Enter/exit animations** – configure easing, duration, and offset.
- 🧭 **Placement control** – render from the top or bottom and tweak spacing/off-sets.
- 🔔 **Per-toast behaviour** – set custom duration, icons, and press handlers.
- 🧱 **Render override** – supply `renderToast` to swap the default card while keeping stack logic.
- 🧪 **Strict TypeScript** – rich typings with `ToastMessage`, `ToastConfig`, and context helpers.

## 🧷 Configuration Reference

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `bgColor` | `Record<'success' \| 'error' \| 'warning' \| 'info', string>` | vibrant palette | Background colours per toast type. |
| `timeToDismiss` | `number` | `3000` | Global auto-dismiss duration (ms). Set `0` to keep toasts until manual removal. |
| `placement` | `'top' \| 'bottom'` | `'bottom'` | Screen edge for the stack. |
| `spacing` | `number` | `12` | Gap between stacked toasts. |
| `offset` | `number` | `20` | Additional inset from the safe area edge. |
| `font.fontFamilyRegular` | `string` | `undefined` | Custom family for message text. |
| `font.fontFamilyBold` | `string` | `undefined` | Custom family for title text. |
| `animation.initialTranslation` | `number` | `24` | Entrance/exit translation offset. |
| `animation.appearDuration` | `number` | `220` | Duration of apparition animation (ms). |
| `animation.disappearDuration` | `number` | `180` | Duration of dismissal animation (ms). |
| `animation.easing` | `(value: number) => number` | `Easing.out(Easing.cubic)` | Custom easing curve. |
| `toastStyle`, `titleStyle`, `messageStyle` | `StyleProp` | `undefined` | Extend container/text styling. |
| `renderToast` | Function | `undefined` | Provides complete control of toast rendering. |

### Extending the provider

```tsx
<ToastProvider
	initialConfig={{
		placement: 'top',
		spacing: 16,
		animation: {
			appearDuration: 180,
			disappearDuration: 140,
		},
		bgColor: {
			success: '#1db954',
			error: '#ef4444',
			warning: '#f59e0b',
			info: '#3b82f6',
		},
	}}
>
	{children}
</ToastProvider>
```

> [!TIP]
> Call `setToastConfig` from anywhere to merge runtime overrides, such as toggling placement when a modal opens.

## 🧰 Composable API

```ts
addToast(options: Omit<ToastMessage, 'id'>): void
removeToast(id?: string): void
setToastConfig(config: Partial<ToastConfig>): void
```

- `addToast` accepts `title`, `message`, `type`, `icon`, `duration`, and `onPress`.
- `removeToast()` with no arguments pops the most recent toast; supply an `id` to remove a specific one.
- `setToastConfig` merges deeply with the current configuration – safe for incremental updates.

## 🎨 Designing Beautiful Toasts

Use the render override for complete control:

```tsx
setToastConfig({
	renderToast: ({ message, defaultToast }) => (
		<CustomToastCard message={message}>{defaultToast}</CustomToastCard>
	),
});
```

> [!WARNING]
> When replacing the renderer, you are responsible for accessibility roles and colours. Keep contrast high for legibility.

## ⚙️ Performance Notes

- The stack keeps animations on the native driver for smooth transitions.
- Toast heights are measured lazily, so rendering custom content remains performant.
- Keyboard height is only observed on iOS (where it matters for bottom placement).

> [!CAUTION]
> Avoid rendering extremely heavy custom components inside toasts. Keep them focused on short-lived feedback.

## 📱 Example App

An Expo-powered playground lives inside the repository.

```sh
yarn install
yarn example start
```

> [!NOTE]
> The example mirrors the library source via workspaces. Any local edits appear immediately inside Expo.

## 🤝 Contributing

- Read the [contribution guide](CONTRIBUTING.md) for setup, coding standards, and release process.
- Adhere to the [Code of Conduct](CODE_OF_CONDUCT.md).
- Run `yarn typecheck` and `yarn test` before opening a PR.

> [!TIP]
> Small fixes are welcome! If you are planning a bigger change, open an issue first so we can discuss the approach.

## 🗣️ Community & Support

- File issues on [GitHub](https://github.com/mCodex/react-native-rooster/issues).
- Follow [@mCodex](https://github.com/mCodex) for release updates.
- Got a success story? Share it through a discussion or tweet with #ReactNativeRooster.

## 📄 License

MIT © [Mateus Andrade](https://github.com/mCodex)

---

Made with ❤️ using [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
