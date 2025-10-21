import React, { useMemo, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getVerticalPosition,
  getHorizontalContainerAlignment,
  getHostPaddingHorizontal,
} from '../utils/positioning';
import { containerStyles } from '../utils/styling';
import useKeyboard from '../hooks/useKeyboard';
import type {
  ToastConfig,
  ToastHorizontalPosition,
  ToastMessage,
  ToastPlacement,
} from '../types';
import Toast from './Toast';

/**
 * Props for the ToastContainer component.
 *
 * @interface ToastContainerProps
 * @property messages - Array of currently displayed toasts
 * @property toastConfig - Global configuration for all toasts
 * @property onRemove - Callback when a toast is removed
 *
 * @example
 * <ToastContainer
 *   messages={[{ id: '1', message: 'Hello' }]}
 *   toastConfig={config}
 *   onRemove={(id) => console.log('Removed:', id)}
 * />
 */
export interface ToastContainerProps {
  messages: ToastMessage[];
  toastConfig: ToastConfig;
  onRemove: (id: string) => void;
}

/**
 * Toast container - manages the toast stack layout and lifecycle.
 *
 * Responsibilities:
 * - Positions toast stack at correct viewport location (respects safe areas)
 * - Stacks multiple toasts with spacing
 * - Handles keyboard avoidance
 * - Provides custom rendering hooks
 * - Prevents clicks from passing to components behind toasts
 *
 * Features:
 * - Smart vertical positioning (top/bottom with safe-area offset)
 * - Smart horizontal alignment (left/center/right)
 * - Keyboard-aware offset adjustment
 * - Configurable spacing between stacked toasts
 * - Custom toast renderer support (for advanced use cases)
 *
 * Performance:
 * - Only renders container when toasts exist (null render when empty)
 * - Uses useMemo to prevent unnecessary recalculations
 * - Toast components are memoized to prevent re-renders
 *
 * @example
 * const [messages, setMessages] = React.useState<ToastMessage[]>([]);
 *
 * <ToastContainer
 *   messages={messages}
 *   toastConfig={config}
 *   onRemove={(id) => {
 *     setMessages(prev => prev.filter(m => m.id !== id));
 *   }}
 * />
 */
const ToastContainer: React.FC<ToastContainerProps> = ({
  messages,
  toastConfig,
  onRemove,
}) => {
  const [keyboardHeight] = useKeyboard();
  const insets = useSafeAreaInsets();

  // Extract configuration with sensible defaults
  const spacing = toastConfig.spacing ?? 12;
  const placement: ToastPlacement =
    toastConfig.position?.vertical ?? toastConfig.placement ?? 'bottom';
  const horizontalPosition: ToastHorizontalPosition =
    toastConfig.position?.horizontal ??
    toastConfig.horizontalPosition ??
    'center';
  const offset = toastConfig.offset ?? 20;
  const marginHorizontal = toastConfig.marginHorizontal ?? 16;

  /**
   * Compute the vertical offset considering:
   * - Safe area insets (notches, home indicators)
   * - Configuration offset
   * - Keyboard height (when at bottom)
   *
   * This ensures toasts are visible and don't overlap safe areas or keyboard.
   */
  const baseOffset = useMemo(
    () =>
      placement === 'top'
        ? insets.top + offset
        : insets.bottom + offset + keyboardHeight,
    [insets.bottom, insets.top, keyboardHeight, offset, placement]
  );

  /**
   * Combine vertical position (top/bottom + offset) with alignment.
   * Placed in a single useMemo to avoid recalculating when deps unchanged.
   */
  const positionStyle = useMemo(
    () => ({
      ...getVerticalPosition(placement, baseOffset),
      ...getHorizontalContainerAlignment(horizontalPosition),
    }),
    [placement, baseOffset, horizontalPosition]
  );

  /**
   * Host padding handles edge spacing differently by placement:
   * - Top/bottom: No padding (toasts handle their own margins)
   * - Left/right positions: Padding applied for consistent edge spacing
   *
   * This prevents double-spacing and maintains clean spacing logic.
   */
  const hostPaddingHorizontal = useMemo(
    () => getHostPaddingHorizontal(placement, marginHorizontal),
    [placement, marginHorizontal]
  );

  /**
   * Renders individual toast with spacing.
   * Supports custom rendering through toastConfig.renderToast.
   *
   * @param message - Toast message data
   * @param index - Position in the stack (used for custom renderers)
   * @returns JSX element wrapped with spacing
   */
  const renderToastItem = useCallback(
    (message: ToastMessage, index: number) => {
      // First toast in stack has no spacing
      const spacingStyle =
        index === 0 || spacing === 0 ? undefined : { marginTop: spacing };

      // Build default toast component
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

      // If no custom renderer, return wrapped default
      if (!toastConfig.renderToast) {
        return (
          <View key={message.id} pointerEvents="box-none" style={spacingStyle}>
            {defaultToast}
          </View>
        );
      }

      // Custom renderer receives default toast for reuse
      const rendered = toastConfig.renderToast({
        message,
        index,
        defaultToast,
      });

      // Ensure rendered element has key prop
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

  /**
   * Order toasts based on placement:
   * - Top: oldest first (stack downward)
   * - Bottom: newest first (stack upward, so newest is on top)
   *
   * This ensures visual coherence with arrival order.
   */
  const orderedMessages = useMemo(
    () => (placement === 'top' ? messages : [...messages].reverse()),
    [messages, placement]
  );

  // Performance: don't render overlay if no toasts
  if (messages.length === 0) {
    return null;
  }

  /**
   * Toast content structure:
   * - Outer View: Absolute fill overlay (transparent, clicks pass through)
   * - Host View: Positioned container (top/bottom/left/right aligned)
   * - Individual toasts: Wrapped with spacing
   *
   * pointerEvents="box-none" allows clicks to pass through transparent areas.
   */
  return (
    <View
      pointerEvents="box-none"
      style={[StyleSheet.absoluteFill, containerStyles.overlay]}
    >
      <View
        pointerEvents="box-none"
        style={[
          containerStyles.host,
          positionStyle,
          { paddingHorizontal: hostPaddingHorizontal },
        ]}
      >
        {orderedMessages.map((message: ToastMessage, index: number) =>
          renderToastItem(message, index)
        )}
      </View>
    </View>
  );
};

export default React.memo(ToastContainer);
