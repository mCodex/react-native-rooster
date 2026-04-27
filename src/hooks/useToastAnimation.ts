import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import type { ToastConfig, ToastMessage, ToastPlacement } from '../types';
import useReducedMotion from './useReducedMotion';

interface UseToastAnimationOptions {
  message: ToastMessage;
  config: ToastConfig;
  placement: ToastPlacement;
  index: number;
  onRemove: (id: string) => void;
}

interface UseToastAnimationResult {
  opacity: Animated.Value;
  translateY: Animated.Value;
  translateX: Animated.Value;
  /** Begins the dismiss animation. Idempotent and safe to call mid-flight. */
  dismiss: () => void;
  /** Pause auto-dismiss timer (e.g. on focus/hover). */
  pauseAutoDismiss: () => void;
  /** Resume auto-dismiss timer. */
  resumeAutoDismiss: () => void;
}

/**
 * Owns the entire animation lifecycle for a single toast (SRP).
 *
 * Responsibilities:
 * - Native-driver Animated.Values for opacity + translateY/X (no Reanimated).
 * - Enter animation with stagger via `delay = index * staggerMs`.
 * - Auto-dismiss timer (pausable for WCAG 2.2 SC 2.2.1).
 * - Exit animation that interrupts the enter animation cleanly when the user
 *   taps mid-flight, so the toast is always immediately dismissible.
 * - Reduced-motion path: fade-only with halved durations, zero translate.
 * - Disposes timers + animations on unmount; never leaks.
 */
const useToastAnimation = ({
  message,
  config,
  placement,
  index,
  onRemove,
}: UseToastAnimationOptions): UseToastAnimationResult => {
  const reduceMotion = useReducedMotion();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef<number>(0);
  const startedAtRef = useRef<number>(0);
  const pausedRef = useRef(false);
  const dismissingRef = useRef(false);
  const removedRef = useRef(false);

  const animation = config.animation;
  const easing = animation?.easing;
  const baseAppear = animation?.appearDuration ?? 220;
  const baseDisappear = animation?.disappearDuration ?? 180;
  const baseTranslation = animation?.initialTranslation ?? 24;
  const staggerMs = config.staggerMs ?? 30;

  const appearDuration = reduceMotion ? Math.round(baseAppear / 2) : baseAppear;
  const disappearDuration = reduceMotion
    ? Math.round(baseDisappear / 2)
    : baseDisappear;
  const initialTranslation = useMemo(() => {
    if (reduceMotion) return 0;
    return baseTranslation * (placement === 'top' ? -1 : 1);
  }, [reduceMotion, baseTranslation, placement]);

  const effectiveDuration = useMemo(() => {
    if (config.disableAutoDismiss) return 0;
    const value = message.duration ?? config.timeToDismiss;
    if (typeof value !== 'number' || value <= 0) return 0;
    return reduceMotion ? value * 2 : value;
  }, [
    config.disableAutoDismiss,
    config.timeToDismiss,
    message.duration,
    reduceMotion,
  ]);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    if (dismissingRef.current || removedRef.current) return;
    dismissingRef.current = true;
    clearDismissTimer();
    animationRef.current?.stop();

    const exit = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: disappearDuration,
        easing,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: initialTranslation,
        duration: disappearDuration,
        easing,
        useNativeDriver: true,
      }),
    ]);
    animationRef.current = exit;

    exit.start(({ finished }) => {
      if (removedRef.current) return;
      removedRef.current = true;
      // Always remove even if interrupted to avoid orphan toasts.
      void finished;
      onRemove(message.id);
    });
  }, [
    clearDismissTimer,
    disappearDuration,
    easing,
    initialTranslation,
    message.id,
    onRemove,
    opacity,
    translateY,
  ]);

  const startAutoDismiss = useCallback(
    (duration: number) => {
      clearDismissTimer();
      if (duration <= 0) return;
      remainingRef.current = duration;
      startedAtRef.current = Date.now();
      pausedRef.current = false;
      dismissTimerRef.current = setTimeout(() => {
        dismissTimerRef.current = null;
        dismiss();
      }, duration);
    },
    [clearDismissTimer, dismiss],
  );

  const pauseAutoDismiss = useCallback(() => {
    if (pausedRef.current || !dismissTimerRef.current) return;
    pausedRef.current = true;
    const elapsed = Date.now() - startedAtRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
    clearDismissTimer();
  }, [clearDismissTimer]);

  const resumeAutoDismiss = useCallback(() => {
    if (!pausedRef.current) return;
    pausedRef.current = false;
    if (remainingRef.current > 0) {
      startAutoDismiss(remainingRef.current);
    }
  }, [startAutoDismiss]);

  // Run enter animation + schedule auto-dismiss exactly once on mount. Read
  // animation parameters from a ref so the entrance only plays once even if
  // config props change — re-running would cancel the animation mid-flight.
  const enterParamsRef = useRef({
    appearDuration,
    delay: index * staggerMs,
    easing,
    initialTranslation,
    effectiveDuration,
  });
  enterParamsRef.current = {
    appearDuration,
    delay: index * staggerMs,
    easing,
    initialTranslation,
    effectiveDuration,
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: enter animation must run only once on mount
  useEffect(() => {
    const params = enterParamsRef.current;
    translateY.setValue(params.initialTranslation);
    opacity.setValue(0);

    const enter = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: params.appearDuration,
        delay: params.delay,
        easing: params.easing,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: params.appearDuration,
        delay: params.delay,
        easing: params.easing,
        useNativeDriver: true,
      }),
    ]);
    animationRef.current = enter;
    enter.start();

    if (params.effectiveDuration > 0) {
      startAutoDismiss(params.effectiveDuration + params.delay);
    }

    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
      clearDismissTimer();
    };
  }, []);

  return {
    opacity,
    translateY,
    translateX,
    dismiss,
    pauseAutoDismiss,
    resumeAutoDismiss,
  };
};

export default useToastAnimation;
