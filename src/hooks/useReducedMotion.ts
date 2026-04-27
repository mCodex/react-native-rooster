import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Subscribe to the device's "Reduce Motion" accessibility preference.
 * Returns the current value and stays in sync with system changes.
 *
 * Used by the toast animation hook to honor WCAG 2.3.3 / 2.2.1 by switching
 * to fade-only enter/exit when the user has reduced motion enabled.
 */
const useReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;

    AccessibilityInfo.isReduceMotionEnabled?.()
      .then((value) => {
        if (mounted) setReduced(Boolean(value));
      })
      .catch(() => {
        // Some platforms don't implement this — treat as motion allowed.
      });

    const sub = AccessibilityInfo.addEventListener?.(
      'reduceMotionChanged',
      (value) => setReduced(Boolean(value)),
    );

    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);

  return reduced;
};

export default useReducedMotion;
