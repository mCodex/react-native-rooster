import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import { getToastAlignment, isVerticalPlacement } from '../utils/positioning';
import { buildToastStyle, toastStyles } from '../utils/styling';
import type {
  ToastConfig,
  ToastHorizontalPosition,
  ToastMessage,
  ToastPlacement,
} from '../types';

/**
 * Props for the Toast component.
 *
 * @interface ToastProps
 * @property message - The toast message to display with optional customizations
 * @property config - Global toast configuration and styling defaults
 * @property placement - Vertical position ('top' or 'bottom')
 * @property horizontalPosition - Horizontal alignment ('left', 'center', or 'right')
 * @property onRemove - Callback to remove the toast after animation completes
 *
 * @example
 * <Toast
 *   message={{ id: '1', message: 'Hello' }}
 *   config={config}
 *   placement="bottom"
 *   horizontalPosition="center"
 *   onRemove={handleRemove}
 * />
 */
export interface ToastProps {
  message: ToastMessage;
  config: ToastConfig;
  placement: ToastPlacement;
  horizontalPosition: ToastHorizontalPosition;
  onRemove: (id: string) => void;
}

/**
 * Toast component - displays individual toast notifications with animations.
 *
 * Features:
 * - Enter/exit animations (customizable duration and easing)
 * - Per-toast customizations (colors, padding, styles)
 * - Respects press handlers and auto-dismiss timeouts
 * - Accessible (proper roles and labels for screen readers)
 * - Touch feedback with hitSlop for comfortable interaction
 * - **Responsive width**: For top/bottom positions, automatically expands to fill screen width minus margins
 * - **Orientation-aware**: Automatically adapts when device orientation changes
 *
 * Width Behavior:
 * - **Top/Bottom positions**: Responsive width that respects `marginHorizontal`
 *   - Width = screenWidth - (2 × marginHorizontal)
 *   - Automatically updates on orientation change
 * - **Left/Right positions**: Fixed maximum width (420px) for consistency
 *
 * Animation behavior:
 * - Enters: Slides in from placement edge while fading in
 * - Auto-dismisses: After configured timeout (if duration > 0)
 * - Press-dismiss: Immediately starts exit animation
 * - Exit: Slides back out while fading, removes from DOM when finished
 *
 * @example
 * <Toast
 *   message={{ id: '1', message: 'Success!', type: 'success' }}
 *   config={toastConfig}
 *   placement="bottom"
 *   horizontalPosition="center"
 *   onRemove={(id) => console.log(`Toast ${id} removed`)}
 * />
 */
const Toast: React.FC<ToastProps> = ({
  message,
  config,
  placement,
  horizontalPosition,
  onRemove,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(0)).current;
  const isDismissing = useRef(false);

  // Destructure with defaults for animation and spacing config
  const {
    animation,
    font,
    titleStyle,
    messageStyle,
    marginHorizontal = 16,
  } = config;

  const easing = animation?.easing;
  const appearDuration = animation?.appearDuration ?? 220;
  const disappearDuration = animation?.disappearDuration ?? 180;
  const initialTranslation =
    (animation?.initialTranslation ?? 24) *
    (isVerticalPlacement(placement) && placement === 'top' ? -1 : 1);

  const effectiveDuration = message.duration ?? config.timeToDismiss;
  const shouldAutoDismiss =
    typeof effectiveDuration === 'number' && effectiveDuration > 0;

  // Memoize font styling only when font config changes
  const textStyles = useMemo(
    () => ({
      title: [
        toastStyles.title,
        font?.fontFamilyBold && { fontFamily: font.fontFamilyBold },
        titleStyle,
      ],
      message: [
        toastStyles.message,
        font?.fontFamilyRegular && { fontFamily: font.fontFamilyRegular },
        messageStyle,
      ],
    }),
    [font?.fontFamilyBold, font?.fontFamilyRegular, titleStyle, messageStyle]
  );

  /**
   * Initiates toast dismissal animation.
   * Safe to call multiple times (guarded by isDismissing ref).
   * Ensures onRemove is only called after animation completes.
   */
  const runDismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: disappearDuration,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(translate, {
        toValue: initialTranslation,
        duration: disappearDuration,
        easing,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        onRemove(message.id);
      }
    });
  }, [
    disappearDuration,
    easing,
    initialTranslation,
    message.id,
    onRemove,
    opacity,
    translate,
  ]);

  /**
   * Handles user press on the toast.
   * Calls message.onPress if provided, then dismisses.
   */
  const handlePress = useCallback(() => {
    message.onPress?.();
    runDismiss();
  }, [message, runDismiss]);

  /**
   * Entry animation and auto-dismiss setup.
   * Plays enter animation immediately, then schedules auto-dismiss if enabled.
   * Cleanup removes the timeout to prevent memory leaks.
   */
  useEffect(() => {
    translate.setValue(initialTranslation);

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: appearDuration,
        easing,
        useNativeDriver: true,
      }),
      Animated.spring(translate, {
        toValue: 0,
        speed: 18,
        bounciness: 9,
        useNativeDriver: true,
      }),
    ]).start();

    if (shouldAutoDismiss) {
      const timer = setTimeout(runDismiss, effectiveDuration);
      return () => {
        clearTimeout(timer);
      };
    }

    return undefined;
  }, [
    appearDuration,
    easing,
    effectiveDuration,
    initialTranslation,
    runDismiss,
    shouldAutoDismiss,
    translate,
    opacity,
  ]);

  /**
   * Compute complete toast style from utilities and overrides.
   * Uses buildToastStyle to manage complex style hierarchy.
   */
  const alignmentStyle = useMemo(
    () =>
      getToastAlignment(
        horizontalPosition,
        placement,
        marginHorizontal,
        screenWidth
      ),
    [horizontalPosition, placement, marginHorizontal, screenWidth]
  );

  const animationStyle = useMemo(
    () => ({ opacity, transform: [{ translateY: translate }] }),
    [opacity, translate]
  );

  const containerStyle = useMemo(
    () => buildToastStyle(config, message, alignmentStyle, animationStyle),
    [config, message, alignmentStyle, animationStyle]
  );

  return (
    <Animated.View pointerEvents="box-none" style={containerStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={message.title ?? message.message}
        onPress={handlePress}
        style={toastStyles.pressable}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {message.icon ? (
          <View style={toastStyles.icon} pointerEvents="none">
            {message.icon}
          </View>
        ) : null}
        <View style={toastStyles.content} pointerEvents="none">
          {message.title && (
            <Text
              style={textStyles.title}
              allowFontScaling={false}
              numberOfLines={1}
            >
              {message.title}
            </Text>
          )}
          <Text
            style={textStyles.message}
            allowFontScaling={false}
            numberOfLines={2}
          >
            {message.message}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(Toast);
