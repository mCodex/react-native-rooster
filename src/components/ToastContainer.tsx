import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useKeyboard from '../hooks/useKeyboard';
import type {
  ToastConfig,
  ToastHorizontalPosition,
  ToastPlacement,
} from '../types';
import {
  getHorizontalContainerAlignment,
  getHostPaddingHorizontal,
  getVerticalPosition,
} from '../utils/positioning';
import { containerStyles } from '../utils/styling';
import ToastItem from './Toast';

export interface ToastContainerProps {
  /** Visible toast ids in insertion order (oldest first). */
  ids: string[];
  /** Active global config. */
  toastConfig: ToastConfig;
  /** Called once a toast's exit animation completes. */
  onRemove: (id: string) => void;
}

/**
 * Layout host for the toast stack. Pure layout: no state of its own.
 *
 * Maps the `ids` list (subscribed by {@link Toaster}) to {@link ToastItem}
 * children. Each item subscribes to its own message slice, so the container
 * itself only re-renders when the id list changes.
 */
const ToastContainer: React.FC<ToastContainerProps> = ({
  ids,
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
  const marginHorizontal = toastConfig.marginHorizontal ?? 16;

  const baseOffset = useMemo(
    () =>
      placement === 'top'
        ? insets.top + offset
        : insets.bottom + offset + keyboardHeight,
    [insets.bottom, insets.top, keyboardHeight, offset, placement],
  );

  const positionStyle = useMemo(
    () => ({
      ...getVerticalPosition(placement, baseOffset),
      ...getHorizontalContainerAlignment(horizontalPosition),
    }),
    [placement, baseOffset, horizontalPosition],
  );

  const hostPaddingHorizontal = useMemo(
    () => getHostPaddingHorizontal(placement, marginHorizontal),
    [placement, marginHorizontal],
  );

  /**
   * Order ids based on placement:
   * - Top: oldest first (stack downward, newest at the bottom of the stack)
   * - Bottom: newest first (stack upward, newest closest to the edge)
   */
  const orderedIds = useMemo(
    () => (placement === 'top' ? ids : ids.slice().reverse()),
    [ids, placement],
  );

  const renderItem = useCallback(
    (id: string, index: number) => {
      const spacingStyle =
        index === 0 || spacing === 0 ? undefined : { marginTop: spacing };
      return (
        <View key={id} pointerEvents="box-none" style={spacingStyle}>
          <ToastItem
            id={id}
            index={index}
            config={toastConfig}
            placement={placement}
            horizontalPosition={horizontalPosition}
            onRemove={onRemove}
          />
        </View>
      );
    },
    [spacing, toastConfig, placement, horizontalPosition, onRemove],
  );

  if (ids.length === 0) return null;

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
        {orderedIds.map((id, index) => renderItem(id, index))}
      </View>
    </View>
  );
};

export default React.memo(ToastContainer);
