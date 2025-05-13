import React, { useEffect, useRef, useCallback } from 'react';
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
} from 'react-native';
import useToast from 'hooks/useToast';

interface IToastComponent {
  message: IToastMessage;
  toastConfig: IConfig;
  index: number;            // stack index
  bottomOffset: number;     // base bottom inset (safe area + keyboard)
}

const Toast: React.FC<IToastComponent> = ({
  message,
  toastConfig,
  index,
  bottomOffset,
}) => {
  const { removeToast } = useToast();
  const { id, title, message: text, type } = message;
  const { bgColor, font, timeToDismiss } = toastConfig;

  // Animated values
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // auto-dismiss
    const t = setTimeout(() => handleDismiss(), timeToDismiss);
    return () => clearTimeout(t);
  }, []);

  // Exit animation + remove
  const handleDismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 20,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) removeToast(id);
    });
  }, [opacity, translateY, removeToast, id]);

  const backgroundColor = bgColor[type || 'info'];

  // stack offset per toast (~60px height each)
  const offset = index * 60;
  // compute absolute bottom
  const bottomPosition = bottomOffset + offset;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.toast,
        { backgroundColor, bottom: bottomPosition },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleDismiss}
        style={styles.content}
      >
        {title ? (
          <Text style={[styles.title, font?.fontFamilyBold && { fontFamily: font.fontFamilyBold }]}>
            {title}
          </Text>
        ) : null}
        <Text style={[styles.message, font?.fontFamilyRegular && { fontFamily: font.fontFamilyRegular }]}>
          {text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
    overflow: 'hidden',
    zIndex: 999,
  },
  content: {
    flexDirection: 'column',
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
  },
});