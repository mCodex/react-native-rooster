import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useKeyboard from '../hooks/useKeyboard';
import type {
  ToastConfig,
  ToastHorizontalPosition,
  ToastMessage,
  ToastPlacement,
} from '../types';
import Toast from './Toast';

interface ToastContainerProps {
  messages: ToastMessage[];
  toastConfig: ToastConfig;
  onRemove: (id: string) => void;
}

const ESTIMATED_HEIGHT = 68;

const ToastContainer: React.FC<ToastContainerProps> = ({
  messages,
  toastConfig,
  onRemove,
}) => {
  const [keyboardHeight] = useKeyboard();
  const insets = useSafeAreaInsets();
  const [heights, setHeights] = useState<Record<string, number>>({});

  const spacing = toastConfig.spacing ?? 12;
  const computedPlacement: ToastPlacement =
    toastConfig.position?.vertical ?? toastConfig.placement ?? 'bottom';
  const horizontalPosition: ToastHorizontalPosition =
    toastConfig.position?.horizontal ??
    toastConfig.horizontalPosition ??
    'center';
  const offset = toastConfig.offset ?? 20;

  const baseOffset = useMemo(() => {
    if (computedPlacement === 'top') {
      return insets.top + offset;
    }

    return insets.bottom + offset + keyboardHeight;
  }, [insets.bottom, insets.top, keyboardHeight, offset, computedPlacement]);

  const handleMeasured = useCallback((id: string, height: number) => {
    setHeights((current: Record<string, number>) => {
      if (current[id] === height) {
        return current;
      }

      return {
        ...current,
        [id]: height,
      };
    });
  }, []);

  const content = useMemo(() => {
    let accumulatedOffset = baseOffset;

    return messages.map((message: ToastMessage, index: number) => {
      const height = heights[message.id] ?? ESTIMATED_HEIGHT;
      const currentOffset = accumulatedOffset;
      accumulatedOffset += height + spacing;

      const defaultToast = (
        <Toast
          key={message.id}
          message={message}
          config={toastConfig}
          placement={computedPlacement}
          horizontalPosition={horizontalPosition}
          offset={currentOffset}
          index={index}
          onRemove={(id: string) => onRemove(id)}
          onMeasured={handleMeasured}
        />
      );

      if (!toastConfig.renderToast) {
        return defaultToast;
      }

      const rendered = toastConfig.renderToast({
        message,
        index,
        defaultToast,
      });

      return React.isValidElement(rendered)
        ? React.cloneElement(rendered, { key: message.id })
        : defaultToast;
    });
  }, [
    baseOffset,
    handleMeasured,
    heights,
    messages,
    onRemove,
    computedPlacement,
    horizontalPosition,
    spacing,
    toastConfig,
  ]);

  if (!messages.length) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <View
        pointerEvents="box-none"
        style={[
          styles.stack,
          computedPlacement === 'top' ? styles.stackTop : styles.stackBottom,
          horizontalPosition === 'left'
            ? styles.stackLeft
            : horizontalPosition === 'right'
              ? styles.stackRight
              : styles.stackCenter,
        ]}
      >
        {content}
      </View>
    </View>
  );
};

export default React.memo(ToastContainer);

const styles = StyleSheet.create({
  stack: {
    flex: 1,
  },
  stackBottom: {
    justifyContent: 'flex-end',
  },
  stackTop: {
    justifyContent: 'flex-start',
  },
  stackCenter: {
    alignItems: 'center',
  },
  stackLeft: {
    alignItems: 'flex-start',
  },
  stackRight: {
    alignItems: 'flex-end',
  },
});
