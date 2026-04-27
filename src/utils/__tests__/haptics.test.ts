import { Platform, Vibration } from 'react-native';

import { normalizeHapticPattern, triggerHaptic } from '../haptics';

jest.mock('react-native', () => ({
  Vibration: { vibrate: jest.fn() },
  Platform: { OS: 'ios' },
}));

describe('haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (Platform as { OS: string }).OS = 'ios';
  });

  describe('normalizeHapticPattern', () => {
    it.each([
      ['light', 'light'],
      ['medium', 'medium'],
      ['success', 'success'],
      ['error', 'error'],
      ['heavy', 'medium'],
      ['warning', 'error'],
    ] as const)('maps %s -> %s', (input: string, expected: string) => {
      expect(normalizeHapticPattern(input as never)).toBe(expected);
    });

    it('returns null when feedback is disabled', () => {
      expect(normalizeHapticPattern(false)).toBeNull();
      expect(normalizeHapticPattern(undefined)).toBeNull();
    });
  });

  describe('triggerHaptic', () => {
    it('vibrates with single duration for light/medium', () => {
      triggerHaptic('light');
      expect(Vibration.vibrate).toHaveBeenCalledWith(5);

      triggerHaptic('medium');
      expect(Vibration.vibrate).toHaveBeenCalledWith(20);
    });

    it('vibrates with pattern arrays for success/error', () => {
      triggerHaptic('success');
      expect(Vibration.vibrate).toHaveBeenCalledWith([10, 20, 10]);

      triggerHaptic('error');
      expect(Vibration.vibrate).toHaveBeenCalledWith([30, 20, 30]);
    });

    it('maps fuller vocabulary onto internal patterns', () => {
      triggerHaptic('heavy');
      expect(Vibration.vibrate).toHaveBeenCalledWith(20);

      triggerHaptic('warning');
      expect(Vibration.vibrate).toHaveBeenCalledWith([30, 20, 30]);
    });

    it('is a no-op when feedback is disabled', () => {
      triggerHaptic(false);
      triggerHaptic(undefined);
      expect(Vibration.vibrate).not.toHaveBeenCalled();
    });

    it('is a no-op on web', () => {
      (Platform as { OS: string }).OS = 'web';
      triggerHaptic('light');
      expect(Vibration.vibrate).not.toHaveBeenCalled();
    });
  });
});
