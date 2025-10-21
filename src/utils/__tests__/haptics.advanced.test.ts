import { triggerHaptic, cancelHaptic, HAPTIC_PATTERNS } from '../haptics';
import { Vibration, Platform } from 'react-native';

jest.mock('react-native', () => ({
  Vibration: {
    vibrate: jest.fn(),
    cancel: jest.fn(),
  },
  Platform: {
    OS: 'android',
  },
}));

describe('haptics advanced', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('triggerHaptic', () => {
    it('should trigger simple vibration for light pattern', () => {
      triggerHaptic('light');
      expect(Vibration.vibrate).toHaveBeenCalledWith(5);
    });

    it('should trigger simple vibration for medium pattern', () => {
      triggerHaptic('medium');
      expect(Vibration.vibrate).toHaveBeenCalledWith(20);
    });

    it('should trigger complex pattern for success', () => {
      triggerHaptic('success');
      expect(Vibration.vibrate).toHaveBeenCalledWith([10, 20, 10]);
    });

    it('should trigger complex pattern for error', () => {
      triggerHaptic('error');
      expect(Vibration.vibrate).toHaveBeenCalledWith([30, 20, 30]);
    });

    it('should skip vibration on web platform', () => {
      (Platform as any).OS = 'web';
      triggerHaptic('light');
      expect(Vibration.vibrate).not.toHaveBeenCalled();
      (Platform as any).OS = 'android';
    });

    it('should handle vibration errors gracefully', () => {
      (Vibration.vibrate as jest.Mock).mockImplementation(() => {
        throw new Error('Vibration not available');
      });

      expect(() => {
        triggerHaptic('light');
      }).not.toThrow();
    });

    it('should handle null pattern gracefully', () => {
      expect(() => {
        triggerHaptic('light');
      }).not.toThrow();
    });
  });

  describe('cancelHaptic', () => {
    it('should call Vibration.cancel', () => {
      cancelHaptic();
      expect(Vibration.cancel).toHaveBeenCalled();
    });

    it('should skip cancel on web platform', () => {
      (Platform as any).OS = 'web';
      jest.clearAllMocks();
      cancelHaptic();
      expect(Vibration.cancel).not.toHaveBeenCalled();
      (Platform as any).OS = 'android';
    });

    it('should handle cancel errors gracefully', () => {
      (Vibration.cancel as jest.Mock).mockImplementation(() => {
        throw new Error('Cancel not available');
      });

      expect(() => {
        cancelHaptic();
      }).not.toThrow();
    });
  });

  describe('HAPTIC_PATTERNS', () => {
    it('should have all expected patterns', () => {
      expect(HAPTIC_PATTERNS.light).toBeDefined();
      expect(HAPTIC_PATTERNS.medium).toBeDefined();
      expect(HAPTIC_PATTERNS.success).toBeDefined();
      expect(HAPTIC_PATTERNS.error).toBeDefined();
    });

    it('should have correct light pattern duration', () => {
      expect(HAPTIC_PATTERNS.light[0]).toBe(5);
    });

    it('should have correct medium pattern duration', () => {
      expect(HAPTIC_PATTERNS.medium[0]).toBe(20);
    });

    it('should have correct success pattern', () => {
      expect(HAPTIC_PATTERNS.success).toEqual([10, 20, 10]);
    });

    it('should have correct error pattern', () => {
      expect(HAPTIC_PATTERNS.error).toEqual([30, 20, 30]);
    });
  });
});
