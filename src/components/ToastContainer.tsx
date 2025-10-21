import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useKeyboard from '../hooks/useKeyboard';
import type {
  ToastConfig,
  ToastHorizontalPosition,
  ToastMessage,
  ToastPlacement,
} from '../types';
import Toast from './Toast';

/**
 * Props used to render and manage the toast stack.
 */
export interface ToastContainerProps {
  messages: ToastMessage[];
  toastConfig: ToastConfig;
  onRemove: (id: string) => void;
}

/**
 * Computes the base host position (top/bottom) including safe-area and keyboard offsets.
 */
const getVerticalHostStyle = (
  placement: ToastPlacement,
  offset: number
): ViewStyle =>
  placement === 'top'
    ? { top: offset, justifyContent: 'flex-start' }
    : { bottom: offset, justifyContent: 'flex-end' };

/**
 * Maps horizontal alignment enum to container alignment styles.
 */
const getHorizontalAlignmentStyle = (
  alignment: ToastHorizontalPosition
): ViewStyle => {
  switch (alignment) {
    case 'left':
      return { alignItems: 'flex-start' };
    case 'right':
      return { alignItems: 'flex-end' };
    default:
      return { alignItems: 'center' };
  }
};

const ToastContainer: React.FC<ToastContainerProps> = ({
  messages,
  toastConfig,
  onRemove,
}) => {
  const [keyboardHeight] = useKeyboard();

  const insets = useSafeAreaInsets();

  const spacing = toastConfig.spacing ?? 12;
  const placement: ToastPlacement =
    toastConfig.position?.vertical ?? toastConfig.placement ?? 'bottom';
  const horizontalPosition: ToastHorizontalPosition =
    toastConfig.position?.horizontal ??
    toastConfig.horizontalPosition ??
    'center';
  const offset = toastConfig.offset ?? 20;

  const baseOffset = useMemo(
    () =>
      placement === 'top'
        ? insets.top + offset
        : insets.bottom + offset + keyboardHeight,
    [insets.bottom, insets.top, keyboardHeight, offset, placement]
  );

  const hostPositionStyle = useMemo(
    () => getVerticalHostStyle(placement, baseOffset),
    [placement, baseOffset]
  );

  const horizontalAlignmentStyle = useMemo(
    () => getHorizontalAlignmentStyle(horizontalPosition),
    [horizontalPosition]
  );

  // Render toast item with optional custom renderer
  const renderToastItem = useCallback(
    (message: ToastMessage, index: number) => {
      const spacingStyle =
        index === 0 || spacing === 0 ? undefined : { marginTop: spacing };

      const defaultToast = (
        <Toast
          key={message.id}
          message={message}
          config={toastConfig}
          placement={placement}
          horizontalPosition={horizontalPosition}
          onRemove={onRemove}
        />
      );

      if (!toastConfig.renderToast) {
        return (
          <View key={message.id} pointerEvents="box-none" style={spacingStyle}>
            {defaultToast}
          </View>
        );
      }

      const rendered = toastConfig.renderToast({
        message,
        index,
        defaultToast,
      });

      const element = React.isValidElement(rendered)
        ? React.cloneElement(rendered, { key: message.id })
        : defaultToast;

      return (
        <View key={message.id} pointerEvents="box-none" style={spacingStyle}>
          {element}
        </View>
      );
    },
    [toastConfig, placement, horizontalPosition, onRemove, spacing]
  );

  const orderedMessages = useMemo(
    () => (placement === 'top' ? messages : [...messages].reverse()),
    [messages, placement]
  );

  const hasToasts = messages.length > 0;

  const toastContent = useMemo(
    () => (
      <View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, styles.overlay]}
      >
        <View
          pointerEvents="box-none"
          style={[styles.host, hostPositionStyle, horizontalAlignmentStyle]}
        >
          {orderedMessages.map((message: ToastMessage, index: number) =>
            renderToastItem(message, index)
          )}
        </View>
      </View>
    ),
    [
      orderedMessages,
      hostPositionStyle,
      horizontalAlignmentStyle,
      renderToastItem,
    ]
  );

  // Only render if toasts exist (prevents blocking clicks when not needed)
  if (!hasToasts) {
    return null;
  }

  return toastContent;
};

export default React.memo(ToastContainer);

const styles = StyleSheet.create({
  overlay: {
    // Transparent overlay that only covers toast area
    // pointerEvents="box-none" allows clicks to pass through
    backgroundColor: 'transparent',
  },
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    width: '100%',
    flexDirection: 'column',
  },
});
