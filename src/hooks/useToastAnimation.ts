import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated } from 'react-native';

import toastStore from '../store/toastStore';
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
  /** Pause auto-dismiss timer (e.g. on focus/hover). Forwards to the store. */
  pauseAutoDismiss: () => void;
  /** Resume auto-dismiss timer. Forwards to the store. */
  resumeAutoDismiss: () => void;
}

/**
 * Owns the entire animation lifecycle for a single toast (SRP).
 *
 * Responsibilities:
 * - Native-driver Animated.Values for opacity + translateY/X (no Reanimated).
 * - Enter animation with stagger via `delay = index * staggerMs`.
 * - Exit animation that interrupts the enter animation cleanly when the user
 *   taps mid-flight, so the toast is always immediately dismissible.
 * - Reduced-motion path: fade-only with halved durations, zero translate.
 * - Disposes animations on unmount; never leaks.
 *
 * Auto-dismiss timing is owned exclusively by `toastStore` (single source of
 * truth). The hook registers a dismiss-request handler so the store can ask
 * the animation layer to play the exit animation — the toast is only removed
 * from the store after that animation finishes.
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

  const dismiss = useCallback(() => {
    if (dismissingRef.current || removedRef.current) return;
    dismissingRef.current = true;
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
    disappearDuration,
    easing,
    initialTranslation,
    message.id,
    onRemove,
    opacity,
    translateY,
  ]);

  const pauseAutoDismiss = useCallback(() => {
    toastStore.pause(message.id);
  }, [message.id]);

  const resumeAutoDismiss = useCallback(() => {
    toastStore.resume(message.id);
  }, [message.id]);

  // Register a dismiss-request handler so the store-owned auto-dismiss timer
  // triggers the exit animation instead of unmounting the toast abruptly.
  // biome-ignore lint/correctness/useExhaustiveDependencies: registration must run once on mount
  useEffect(() => {
    const unregister = toastStore.registerDismissHandler(message.id, () => {
      dismiss();
    });
    return unregister;
  }, [message.id]);

  // Run enter animation exactly once on mount. Read animation parameters from
  // a ref so the entrance only plays once even if config props change —
  // re-running would cancel the animation mid-flight.
  const enterParamsRef = useRef({
    appearDuration,
    delay: index * staggerMs,
    easing,
    initialTranslation,
  });
  enterParamsRef.current = {
    appearDuration,
    delay: index * staggerMs,
    easing,
    initialTranslation,
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

    return () => {
      animationRef.current?.stop();
      animationRef.current = null;
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
