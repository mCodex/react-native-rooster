import { triggerHaptic, cancelHaptic, HAPTIC_PATTERNS } from '../haptics';

describe('haptics utilities', () => {
  describe('HAPTIC_PATTERNS', () => {
    it('should have all pattern types', () => {
      expect(HAPTIC_PATTERNS.light).toBeDefined();
      expect(HAPTIC_PATTERNS.medium).toBeDefined();
      expect(HAPTIC_PATTERNS.success).toBeDefined();
      expect(HAPTIC_PATTERNS.error).toBeDefined();
    });

    it('should have correct light pattern', () => {
      expect(HAPTIC_PATTERNS.light).toEqual([5]);
    });

    it('should have correct medium pattern', () => {
      expect(HAPTIC_PATTERNS.medium).toEqual([20]);
    });

    it('should have correct success pattern', () => {
      expect(HAPTIC_PATTERNS.success).toEqual([10, 20, 10]);
    });

    it('should have correct error pattern', () => {
      expect(HAPTIC_PATTERNS.error).toEqual([30, 20, 30]);
    });
  });

  describe('triggerHaptic', () => {
    it('should not throw when triggering haptics', () => {
      expect(() => {
        triggerHaptic('light');
      }).not.toThrow();

      expect(() => {
        triggerHaptic('medium');
      }).not.toThrow();

      expect(() => {
        triggerHaptic('success');
      }).not.toThrow();

      expect(() => {
        triggerHaptic('error');
      }).not.toThrow();
    });

    it('should handle invalid pattern gracefully', () => {
      expect(() => {
        triggerHaptic('invalid' as any);
      }).not.toThrow();
    });
  });

  describe('cancelHaptic', () => {
    it('should not throw when canceling haptics', () => {
      expect(() => {
        cancelHaptic();
      }).not.toThrow();
    });
  });
});
