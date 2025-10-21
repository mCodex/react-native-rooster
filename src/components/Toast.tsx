import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import type {
  ToastConfig,
  ToastHorizontalPosition,
  ToastMessage,
  ToastPlacement,
} from '../types';

/** Props used by the animated toast card. */
export interface ToastProps {
  /** The toast instance to display. */
  message: ToastMessage;
  /** Active configuration provided by the container. */
  config: ToastConfig;
  /** Vertical placement controlling entry direction. */
  placement: ToastPlacement;
  /** Horizontal alignment selected by the container. */
  horizontalPosition: ToastHorizontalPosition;
  /** Removes the toast once its exit animation finishes. */
  onRemove: (id: string) => void;
}

const getHorizontalStyle = (position: ToastHorizontalPosition): ViewStyle => {
  switch (position) {
    case 'left':
      return styles.leftAlign;
    case 'right':
      return styles.rightAlign;
    default:
      return styles.centerAlign;
  }
};

const Toast: React.FC<ToastProps> = ({
  message,
  config,
  placement,
  horizontalPosition,
  onRemove,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(0)).current;
  const isDismissing = useRef(false);

  const { animation, font, toastStyle, titleStyle, messageStyle, bgColor } =
    config;

  const easing = animation?.easing;
  const appearDuration = animation?.appearDuration ?? 220;
  const disappearDuration = animation?.disappearDuration ?? 180;
  const initialTranslation =
    (animation?.initialTranslation ?? 24) * (placement === 'top' ? -1 : 1);

  const effectiveDuration = message.duration ?? config.timeToDismiss;
  const shouldAutoDismiss =
    typeof effectiveDuration === 'number' && effectiveDuration > 0;

  const backgroundColor = bgColor[message.type ?? 'info'];

  const textStyles = useMemo(
    () => ({
      title: [
        styles.title,
        font?.fontFamilyBold && { fontFamily: font.fontFamilyBold },
        titleStyle,
      ],
      message: [
        styles.message,
        font?.fontFamilyRegular && { fontFamily: font.fontFamilyRegular },
        messageStyle,
      ],
    }),
    [font?.fontFamilyBold, font?.fontFamilyRegular, titleStyle, messageStyle]
  );

  // Compute per-toast style overrides
  const toastStyleOverride = useMemo(() => {
    const overrides: Record<string, any> = {};
    if (message.backgroundColor) {
      overrides.backgroundColor = message.backgroundColor;
    }
    if (message.borderRadius !== undefined) {
      overrides.borderRadius = message.borderRadius;
    }
    if (message.padding) {
      if (message.padding.vertical !== undefined) {
        overrides.paddingVertical = message.padding.vertical;
      }
      if (message.padding.horizontal !== undefined) {
        overrides.paddingHorizontal = message.padding.horizontal;
      }
    }
    return overrides;
  }, [message.backgroundColor, message.borderRadius, message.padding]);

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

  const handlePress = useCallback(() => {
    message.onPress?.();
    runDismiss();
  }, [message, runDismiss]);

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

  const containerStyle = useMemo(
    () => [
      styles.toast,
      getHorizontalStyle(horizontalPosition),
      { backgroundColor },
      { opacity, transform: [{ translateY: translate }] },
      toastStyleOverride,
      toastStyle,
      message.style,
    ],
    [
      backgroundColor,
      horizontalPosition,
      opacity,
      toastStyle,
      translate,
      toastStyleOverride,
      message.style,
    ]
  );

  return (
    <Animated.View pointerEvents="box-none" style={containerStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={message.title ?? message.message}
        onPress={handlePress}
        style={styles.pressable}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {message.icon ? (
          <View style={styles.icon} pointerEvents="none">
            {message.icon}
          </View>
        ) : null}
        <View style={styles.content} pointerEvents="none">
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

const styles = StyleSheet.create({
  toast: {
    minWidth: 200,
    maxWidth: 420,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 8,
    backgroundColor: '#1f2937',
  },
  centerAlign: {
    alignSelf: 'center',
    width: '100%',
  },
  leftAlign: {
    alignSelf: 'flex-start',
    marginEnd: 16,
  },
  rightAlign: {
    alignSelf: 'flex-end',
    marginStart: 16,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  message: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
  },
});
