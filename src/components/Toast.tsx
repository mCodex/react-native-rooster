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
import {
  generateAccessibilityLabel,
  generateAccessibilityHint,
  TOAST_TYPE_TO_ROLE,
  TOAST_TYPE_TO_LIVE_REGION,
} from '../utils/accessibility';
import { triggerHaptic } from '../utils/haptics';
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
 * - Per-toast customizations (colors, padding, font sizes, styles)
 * - Respects press handlers and auto-dismiss timeouts
 * - Accessible (proper roles and labels for screen readers)
 * - Touch feedback with hitSlop for comfortable interaction
 * - **Responsive width**: For top/bottom positions, automatically expands to fill screen width minus margins
 * - **Orientation-aware**: Automatically adapts when device orientation changes
 * - **Customizable typography**: Global font sizes or per-toast overrides
 *
 * Width Behavior:
 * - **Top/Bottom positions**: Responsive width that respects `marginHorizontal`
 *   - Width = screenWidth - (2 × marginHorizontal)
 *   - Automatically updates on orientation change
 * - **Left/Right positions**: Fixed maximum width (420px) for consistency
 *
 * Typography Behavior:
 * - Default font sizes: title 16px, message 14px
 * - Override globally: Set `config.font.titleFontSize` and `config.font.messageFontSize`
 * - Override per-toast: Set `message.titleFontSize` and `message.messageFontSize`
 * - Per-toast overrides take precedence over global config
 *
 * Animation behavior:
 * - Enters: Slides in from placement edge while fading in
 * - Auto-dismisses: After configured timeout (if duration > 0)
 * - Press-dismiss: Immediately starts exit animation
 * - Exit: Slides back out while fading, removes from DOM when finished
 *
 * @example
 * <Toast
 *   message={{ id: '1', message: 'Success!', type: 'success', messageFontSize: 16 }}
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
  const animatedSequenceRef = useRef<any>(null);

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
  const textStyles = useMemo(() => {
    // Determine effective font sizes (per-toast > global > default)
    const effectiveTitleFontSize =
      message.titleFontSize ?? font?.titleFontSize ?? 16; // Default title size

    const effectiveMessageFontSize =
      message.messageFontSize ?? font?.messageFontSize ?? 14; // Default message size

    const titleStyles: any[] = [];
    const messageStyles: any[] = [];

    // Build title styles with explicit font size
    titleStyles.push({
      color: '#fff',
      fontSize: effectiveTitleFontSize,
      fontWeight: '600',
      marginBottom: 4,
    });

    if (font?.fontFamilyBold) {
      titleStyles.push({ fontFamily: font.fontFamilyBold });
    }

    if (titleStyle) {
      titleStyles.push(titleStyle);
    }

    // Build message styles with explicit font size
    messageStyles.push({
      color: '#fff',
      fontSize: effectiveMessageFontSize,
    });

    if (font?.fontFamilyRegular) {
      messageStyles.push({ fontFamily: font.fontFamilyRegular });
    }

    if (messageStyle) {
      messageStyles.push(messageStyle);
    }

    return {
      title: titleStyles,
      message: messageStyles,
    };
  }, [
    font?.fontFamilyBold,
    font?.fontFamilyRegular,
    font?.titleFontSize,
    font?.messageFontSize,
    message.titleFontSize,
    message.messageFontSize,
    titleStyle,
    messageStyle,
  ]);

  // Memoize accessibility props derived from message and config
  const accessibilityProps = useMemo(() => {
    const type = message.type ?? 'info';
    const isInteractive = !!message.onPress;

    // Use custom label if provided, otherwise generate from title/message
    const label =
      message.accessibilityLabel ?? generateAccessibilityLabel(message);

    // Use custom hint if provided, otherwise generate from type and interaction
    const hint =
      message.accessibilityHint ??
      generateAccessibilityHint(type, isInteractive);

    // Determine accessibility role (can be customized via config)
    const roleMap = config.accessibility?.roleMap;
    const role = roleMap?.[type] ?? TOAST_TYPE_TO_ROLE[type] ?? 'button';

    // Determine live region (polite for non-urgent, assertive for urgent)
    const liveRegion = TOAST_TYPE_TO_LIVE_REGION[type] ?? 'polite';

    return {
      label,
      hint,
      role,
      liveRegion,
    };
  }, [message, config.accessibility?.roleMap]);

  // Determine font scaling setting (per-toast override, then global config, then default false)
  const allowFontScaling =
    message.allowFontScaling ?? config.accessibility?.allowFontScaling ?? false;

  // Determine message max lines (per-toast override, then global config, then default 2)
  const messageMaxLines =
    message.messageMaxLines ?? config.accessibility?.messageMaxLines ?? 2;

  /**
   * Initiates toast dismissal animation.
   * Safe to call multiple times (guarded by isDismissing ref).
   * Ensures onRemove is only called after animation completes.
   * Properly cancels any running animations to prevent memory leaks.
   */
  const runDismiss = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;

    const dismissAnimation = Animated.parallel([
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
    ]);

    // Store animation reference for cleanup
    animatedSequenceRef.current = dismissAnimation;

    dismissAnimation.start(({ finished }) => {
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
   * Triggers haptic feedback if enabled in config.
   */
  const handlePress = useCallback(() => {
    // Trigger haptic feedback if enabled
    if (config.accessibility?.hapticFeedback) {
      triggerHaptic('light');
    }
    message.onPress?.();
    runDismiss();
  }, [message, runDismiss, config.accessibility?.hapticFeedback]);

  /**
   * Entry animation and auto-dismiss setup.
   * Plays enter animation immediately, then schedules auto-dismiss if enabled.
   * Cleanup properly cancels animations and removes timeouts to prevent memory leaks.
   */
  useEffect(() => {
    translate.setValue(initialTranslation);

    const enterAnimation = Animated.parallel([
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
    ]);

    enterAnimation.start();

    let timer: NodeJS.Timeout | null = null;

    if (shouldAutoDismiss) {
      timer = setTimeout(runDismiss, effectiveDuration);
    }

    return () => {
      // Clean up animation if component unmounts during animation
      if (animatedSequenceRef.current) {
        animatedSequenceRef.current.stop?.();
      }
      // Clean up timer
      if (timer) {
        clearTimeout(timer);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    appearDuration,
    easing,
    effectiveDuration,
    initialTranslation,
    runDismiss,
    shouldAutoDismiss,
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

  /**
   * Handles keyboard events for accessibility (Web only).
   * Allows dismissing toast with Escape key for keyboard-only users.
   * Note: This only works on web platform via custom implementation.
   */
  const handleKeyDown = useCallback(
    (event: any) => {
      // Handle Escape key to dismiss toast (accessibility)
      if (
        event.nativeEvent?.key === 'Escape' ||
        event.nativeEvent?.keyCode === 27
      ) {
        event.preventDefault?.();
        handlePress();
      }
    },
    [handlePress]
  );

  return (
    <Animated.View
      pointerEvents="box-none"
      style={containerStyle}
      accessible={true}
      accessibilityLiveRegion={accessibilityProps.liveRegion}
      // @ts-ignore - Web platform keyboard support
      onKeyDown={handleKeyDown}
    >
      <Pressable
        accessibilityRole={accessibilityProps.role}
        accessibilityLabel={accessibilityProps.label}
        accessibilityHint={accessibilityProps.hint}
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
              allowFontScaling={allowFontScaling}
              numberOfLines={1}
            >
              {message.title}
            </Text>
          )}
          <Text
            style={textStyles.message}
            allowFontScaling={allowFontScaling}
            numberOfLines={messageMaxLines}
          >
            {message.message}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(Toast);
