import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import type { ToastConfig, ToastMessage } from '../types';

const DEFAULT_PADDING = 16;
const DEFAULT_BORDER_RADIUS = 12;
const DEFAULT_SHADOW_OFFSET = { width: 0, height: 12 };

/**
 * Composes the final card style from base + alignment + animation +
 * per-toast/global overrides. Highest precedence: `message.style`.
 */
export const buildToastStyle = (
  config: ToastConfig,
  message: ToastMessage,
  alignmentStyle: ViewStyle,
  // biome-ignore lint/suspicious/noExplicitAny: animated transform is dynamic
  animationStyle: { opacity: any; transform: any[] },
  // biome-ignore lint/suspicious/noExplicitAny: legacy compatibility
): (ViewStyle | any)[] => [
  getBaseToastStyle(config),
  alignmentStyle,
  { backgroundColor: config.bgColor[message.type ?? 'info'] },
  animationStyle,
  getToastCustomizationStyle(message),
  config.toastStyle,
  message.style,
];

/** Foundation style shared by every toast card. */
export const getBaseToastStyle = (config: ToastConfig): ViewStyle => ({
  minWidth: 200,
  minHeight: 44,
  paddingVertical: config.padding?.vertical ?? DEFAULT_PADDING,
  paddingHorizontal: config.padding?.horizontal ?? DEFAULT_PADDING,
  borderRadius: config.borderRadius ?? DEFAULT_BORDER_RADIUS,
  shadowColor: config.shadow?.color ?? '#000',
  shadowOpacity: config.shadow?.opacity ?? 0.2,
  shadowOffset: config.shadow?.offset ?? DEFAULT_SHADOW_OFFSET,
  shadowRadius: config.shadow?.radius ?? 16,
  elevation: 8,
  backgroundColor: '#1f2937',
});

/** Per-toast overrides as a sparse style object — empty if none provided. */
export const getToastCustomizationStyle = (
  message: ToastMessage,
): ViewStyle => ({
  ...(message.backgroundColor && { backgroundColor: message.backgroundColor }),
  ...(message.borderRadius !== undefined && {
    borderRadius: message.borderRadius,
  }),
  ...(message.padding?.vertical !== undefined && {
    paddingVertical: message.padding.vertical,
  }),
  ...(message.padding?.horizontal !== undefined && {
    paddingHorizontal: message.padding.horizontal,
  }),
  // Note: messageFontSize/titleFontSize are applied to <Text>, not the card,
  // but kept here for backwards compatibility with v3 consumers.
  ...(message.messageFontSize !== undefined && {
    // biome-ignore lint/suspicious/noExplicitAny: accept arbitrary key for compat
    messageFontSize: message.messageFontSize as any,
  }),
  ...(message.titleFontSize !== undefined && {
    // biome-ignore lint/suspicious/noExplicitAny: accept arbitrary key for compat
    titleFontSize: message.titleFontSize as any,
  }),
});

const DEFAULT_FONT_SIZES = { title: 16, message: 14 } as const;

/** Static styles shared across every toast card. */
export const toastStyles = StyleSheet.create({
  pressable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  icon: { marginRight: 12, marginTop: 2, flexShrink: 0 },
  content: { flex: 1, justifyContent: 'center' },
  title: {
    color: '#fff',
    fontSize: DEFAULT_FONT_SIZES.title,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: { color: '#fff', fontSize: DEFAULT_FONT_SIZES.message },
});

/** Host overlay styles for the toast stack. */
export const containerStyles = StyleSheet.create({
  overlay: { backgroundColor: 'transparent' },
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    flexDirection: 'column',
  },
});
