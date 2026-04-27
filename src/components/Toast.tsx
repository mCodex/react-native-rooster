import React, { useCallback, useMemo, useRef } from 'react';
import {
  Animated,
  type NativeSyntheticEvent,
  PanResponder,
  type PanResponderGestureState,
  Pressable,
  type StyleProp,
  Text,
  type TextStyle,
  useWindowDimensions,
  View,
} from 'react-native';

import useToastAnimation from '../hooks/useToastAnimation';
import toastStore from '../store/toastStore';
import { useToastMessage } from '../store/useToastSelector';
import type {
  ToastConfig,
  ToastHorizontalPosition,
  ToastPlacement,
} from '../types';
import {
  generateAccessibilityHint,
  generateAccessibilityLabel,
  TOAST_TYPE_TO_LIVE_REGION,
  TOAST_TYPE_TO_ROLE,
} from '../utils/accessibility';
import { triggerHaptic } from '../utils/haptics';
import { getToastAlignment } from '../utils/positioning';
import { buildToastStyle, toastStyles } from '../utils/styling';

export interface ToastItemProps {
  /** Toast id used to subscribe to the store. */
  id: string;
  /** Position in the visible stack (used for stagger + spacing). */
  index: number;
  /** Active global config (passed from container to avoid duplicate subscribes). */
  config: ToastConfig;
  placement: ToastPlacement;
  horizontalPosition: ToastHorizontalPosition;
  /** Called once the exit animation has completed. */
  onRemove: (id: string) => void;
}

const SWIPE_VELOCITY_THRESHOLD = 0.6;
const SWIPE_DISTANCE_RATIO = 0.4;

/**
 * Individual toast view. Subscribes to its own slice of the store so sibling
 * toasts don't re-render when this one updates. All animations run on the
 * native driver via {@link useToastAnimation}.
 */
const ToastItem: React.FC<ToastItemProps> = ({
  id,
  index,
  config,
  placement,
  horizontalPosition,
  onRemove,
}) => {
  const message = useToastMessage(id);
  const { width: screenWidth } = useWindowDimensions();

  const {
    opacity,
    translateY,
    translateX,
    dismiss,
    pauseAutoDismiss,
    resumeAutoDismiss,
  } = useToastAnimation({
    message: message ?? { id, message: '' },
    config,
    placement,
    index,
    onRemove,
  });

  const isPressing = useRef(false);

  const handlePress = useCallback(() => {
    if (isPressing.current) return;
    isPressing.current = true;
    try {
      const haptic =
        message?.hapticFeedback ?? config.accessibility?.hapticFeedback;
      if (haptic) {
        // Map fuller toast haptic vocabulary onto the patterns supported by
        // our haptics util.
        const pattern =
          haptic === 'heavy'
            ? 'medium'
            : haptic === 'warning'
              ? 'error'
              : haptic;
        triggerHaptic(pattern);
      }
      message?.onPress?.();
      dismiss();
    } finally {
      setTimeout(() => {
        isPressing.current = false;
      }, 100);
    }
  }, [
    config.accessibility?.hapticFeedback,
    dismiss,
    message?.hapticFeedback,
    message?.onPress,
  ]);

  /* ------------------------- Swipe-to-dismiss (opt-in) ------------------- */

  const panResponder = useMemo(() => {
    if (!config.swipeToDismiss) return null;
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, g) =>
        Math.abs(g.dx) > 6 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderGrant: () => {
        toastStore.pause(id);
      },
      onPanResponderMove: Animated.event([null, { dx: translateX }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_evt, g: PanResponderGestureState) => {
        const past =
          Math.abs(g.dx) > screenWidth * SWIPE_DISTANCE_RATIO ||
          Math.abs(g.vx) > SWIPE_VELOCITY_THRESHOLD;
        if (past) {
          const direction = g.dx >= 0 ? 1 : -1;
          Animated.timing(translateX, {
            toValue: direction * screenWidth,
            duration: 160,
            useNativeDriver: true,
          }).start(() => dismiss());
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
          toastStore.resume(id);
        }
      },
      onPanResponderTerminate: () => {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        toastStore.resume(id);
      },
    });
  }, [config.swipeToDismiss, dismiss, id, screenWidth, translateX]);

  /* ------------------------------ A11y ----------------------------------- */

  const accessibilityProps = useMemo(() => {
    if (!message) {
      return {
        label: '',
        hint: '',
        role: 'button' as string,
        liveRegion: 'polite' as 'polite' | 'assertive',
      };
    }
    const type = message.type ?? 'info';
    const isInteractive = !!message.onPress;
    const label =
      message.accessibilityLabel ?? generateAccessibilityLabel(message);
    const hint =
      message.accessibilityHint ??
      generateAccessibilityHint(type, isInteractive);
    const roleMap = config.accessibility?.roleMap;
    const role = roleMap?.[type] ?? TOAST_TYPE_TO_ROLE[type] ?? 'button';
    const liveRegion = TOAST_TYPE_TO_LIVE_REGION[type] ?? 'polite';
    return { label, hint, role, liveRegion };
  }, [message, config.accessibility?.roleMap]);

  const allowFontScaling =
    message?.allowFontScaling ??
    config.accessibility?.allowFontScaling ??
    false;
  const messageMaxLines =
    message?.messageMaxLines ?? config.accessibility?.messageMaxLines ?? 2;

  /* ------------------------------ Styles --------------------------------- */

  const textStyles = useMemo(() => {
    const titleSize =
      message?.titleFontSize ?? config.font?.titleFontSize ?? 16;
    const messageSize =
      message?.messageFontSize ?? config.font?.messageFontSize ?? 14;

    const title: StyleProp<TextStyle>[] = [
      {
        color: '#fff',
        fontSize: titleSize,
        fontWeight: '600',
        marginBottom: 4,
      },
    ];
    if (config.font?.fontFamilyBold)
      title.push({ fontFamily: config.font.fontFamilyBold });
    if (config.titleStyle) title.push(config.titleStyle);

    const messageStyle: StyleProp<TextStyle>[] = [
      { color: '#fff', fontSize: messageSize },
    ];
    if (config.font?.fontFamilyRegular)
      messageStyle.push({ fontFamily: config.font.fontFamilyRegular });
    if (config.messageStyle) messageStyle.push(config.messageStyle);

    return { title, message: messageStyle };
  }, [
    message?.titleFontSize,
    message?.messageFontSize,
    config.font?.titleFontSize,
    config.font?.messageFontSize,
    config.font?.fontFamilyBold,
    config.font?.fontFamilyRegular,
    config.titleStyle,
    config.messageStyle,
  ]);

  const alignmentStyle = useMemo(
    () =>
      getToastAlignment(
        horizontalPosition,
        placement,
        config.marginHorizontal ?? 16,
        screenWidth,
      ),
    [horizontalPosition, placement, config.marginHorizontal, screenWidth],
  );

  const animationStyle = useMemo(
    () => ({
      opacity,
      transform: [{ translateY }, { translateX }],
    }),
    [opacity, translateY, translateX],
  );

  const containerStyle = useMemo(() => {
    if (!message) return [alignmentStyle, animationStyle];
    return buildToastStyle(config, message, alignmentStyle, animationStyle);
  }, [config, message, alignmentStyle, animationStyle]);

  const handleKeyDown = useCallback(
    (event: NativeSyntheticEvent<{ key?: string; keyCode?: number }>) => {
      const native = event.nativeEvent;
      if (native?.key === 'Escape' || native?.keyCode === 27) {
        (
          event as unknown as { preventDefault?: () => void }
        ).preventDefault?.();
        dismiss();
      }
    },
    [dismiss],
  );

  if (!message) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={containerStyle}
      accessible={true}
      accessibilityLiveRegion={accessibilityProps.liveRegion}
      // @ts-expect-error - Web platform keyboard support
      onKeyDown={handleKeyDown}
      {...(panResponder ? panResponder.panHandlers : {})}
    >
      <Pressable
        accessibilityRole={accessibilityProps.role as never}
        accessibilityLabel={accessibilityProps.label}
        accessibilityHint={accessibilityProps.hint}
        onPress={handlePress}
        onFocus={pauseAutoDismiss}
        onBlur={resumeAutoDismiss}
        // @ts-expect-error - RN Web hover events
        onHoverIn={pauseAutoDismiss}
        // @ts-expect-error - RN Web hover events
        onHoverOut={resumeAutoDismiss}
        style={toastStyles.pressable}
        // WCAG 2.2 SC 2.5.8 — minimum tap target 24x24, we exceed via hitSlop.
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        {message.icon ? (
          <View style={toastStyles.icon} pointerEvents="none">
            {message.icon}
          </View>
        ) : null}
        <View style={toastStyles.content} pointerEvents="none">
          {message.title ? (
            <Text
              style={textStyles.title}
              allowFontScaling={allowFontScaling}
              numberOfLines={1}
            >
              {message.title}
            </Text>
          ) : null}
          <Text
            style={textStyles.message}
            allowFontScaling={allowFontScaling}
            numberOfLines={messageMaxLines || undefined}
          >
            {message.message}
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(ToastItem);
