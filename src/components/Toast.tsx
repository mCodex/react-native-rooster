import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import type { ToastConfig, ToastMessage, ToastPlacement } from '../types';

interface ToastProps {
  message: ToastMessage;
  config: ToastConfig;
  placement: ToastPlacement;
  offset: number;
  index: number;
  onRemove: (id: string) => void;
  onMeasured: (id: string, height: number) => void;
}

const ESTIMATED_TOAST_HEIGHT = 68;

const Toast: React.FC<ToastProps> = ({
  message,
  config,
  placement,
  offset,
  index,
  onRemove,
  onMeasured,
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

  const baseTextStyles = useMemo(
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
    ]).start(({ finished }: { finished: boolean }) => {
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

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const measuredHeight =
        event.nativeEvent.layout.height || ESTIMATED_TOAST_HEIGHT;
      onMeasured(message.id, measuredHeight);
    },
    [message.id, onMeasured]
  );

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

  const animatedStyle = useMemo(
    () => [
      styles.toast,
      { backgroundColor },
      placement === 'top' ? { top: offset } : { bottom: offset },
      { opacity, transform: [{ translateY: translate }] },
      toastStyle,
      { zIndex: 1000 - index },
    ],
    [backgroundColor, index, offset, opacity, placement, toastStyle, translate]
  );

  return (
    <Animated.View
      pointerEvents="box-none"
      style={animatedStyle}
      onLayout={handleLayout}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={message.title ?? message.message}
        onPress={handlePress}
        style={styles.pressable}
      >
        {message.icon ? <View style={styles.icon}>{message.icon}</View> : null}
        <View style={styles.content} pointerEvents="none">
          {message.title ? (
            <Text style={baseTextStyles.title}>{message.title}</Text>
          ) : null}
          <Text style={baseTextStyles.message}>{message.message}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default React.memo(Toast);

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 16,
    right: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 16,
    elevation: 8,
  },
  pressable: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  icon: {
    marginRight: 12,
    marginTop: 2,
  },
  content: {
    flex: 1,
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
