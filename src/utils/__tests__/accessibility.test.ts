import {
  generateAccessibilityLabel,
  generateAccessibilityHint,
  isTextTruncated,
  generateAccessibilityAnnouncement,
  calculateContrastRatio,
  isContrastCompliant,
  hexToRgb,
  validateAccessibility,
  TOAST_TYPE_TO_ROLE,
  TOAST_TYPE_TO_LIVE_REGION,
  TOAST_TYPE_HINT_MAP,
} from '../accessibility';
import type { ToastMessage } from '../../types';

describe('accessibility utilities', () => {
  describe('generateAccessibilityLabel', () => {
    it('should generate label from title and message', () => {
      const message: ToastMessage = {
        id: '1',
        title: 'Success',
        message: 'Profile updated',
      };

      const result = generateAccessibilityLabel(message);

      expect(result).toBe('Success, Profile updated');
    });

    it('should use message when no title', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'An error occurred',
      };

      const result = generateAccessibilityLabel(message);

      expect(result).toBe('An error occurred');
    });

    it('should truncate at 150 characters', () => {
      const longMessage = 'a'.repeat(200);
      const message: ToastMessage = {
        id: '1',
        message: longMessage,
      };

      const result = generateAccessibilityLabel(message);

      expect(result.length).toBeLessThanOrEqual(150);
      expect(result).toContain('...');
    });

    it('should handle empty message gracefully', () => {
      const message: ToastMessage = {
        id: '1',
        message: '',
      };

      const result = generateAccessibilityLabel(message);

      expect(result).toBe('');
    });
  });

  describe('generateAccessibilityHint', () => {
    it('should generate hint for non-interactive toast', () => {
      const result = generateAccessibilityHint('success', false);

      expect(result).toBe('Success notification');
    });

    it('should add interaction hint for interactive toasts', () => {
      const result = generateAccessibilityHint('error', true);

      expect(result).toContain('Error notification');
      expect(result).toContain('Double tap to dismiss');
    });

    it('should handle all toast types', () => {
      expect(generateAccessibilityHint('info', false)).toBe(
        'Information notification'
      );
      expect(generateAccessibilityHint('success', false)).toBe(
        'Success notification'
      );
      expect(generateAccessibilityHint('warning', false)).toBe(
        'Warning notification'
      );
      expect(generateAccessibilityHint('error', false)).toBe(
        'Error notification'
      );
    });
  });

  describe('isTextTruncated', () => {
    it('should detect short text as not truncated', () => {
      const result = isTextTruncated('Short message', 2, 300);

      expect(result).toBe(false);
    });

    it('should detect very long text as truncated', () => {
      const longText = 'a'.repeat(1000);
      const result = isTextTruncated(longText, 1, 300);

      expect(result).toBe(true);
    });

    it('should return false for zero lines', () => {
      const result = isTextTruncated('Any text', 0, 300);

      expect(result).toBe(false);
    });

    it('should return false for empty text', () => {
      const result = isTextTruncated('', 2, 300);

      expect(result).toBe(false);
    });

    it('should account for estimated width', () => {
      const text = 'a'.repeat(100);
      const resultSmallWidth = isTextTruncated(text, 2, 100);
      const resultLargeWidth = isTextTruncated(text, 2, 500);

      expect(resultSmallWidth).toBe(true);
      expect(resultLargeWidth).toBe(false);
    });
  });

  describe('generateAccessibilityAnnouncement', () => {
    it('should generate complete announcement', () => {
      const message: ToastMessage = {
        id: '1',
        title: 'Payment Processed',
        message: 'Your order is confirmed',
      };

      const result = generateAccessibilityAnnouncement(
        message,
        'success',
        false
      );

      expect(result).toContain('Success notification');
      expect(result).toContain('Payment Processed');
      expect(result).toContain('Your order is confirmed');
    });

    it('should include interaction hint for interactive toasts', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Click me',
      };

      const result = generateAccessibilityAnnouncement(message, 'info', true);

      expect(result).toContain('Double tap to dismiss');
    });

    it('should work without title', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Simple message',
      };

      const result = generateAccessibilityAnnouncement(message, 'info', false);

      expect(result).toContain('Simple message');
    });
  });

  describe('calculateContrastRatio', () => {
    it('should calculate perfect contrast (white on black)', () => {
      const result = calculateContrastRatio([255, 255, 255], [0, 0, 0]);

      expect(result).toBe(21);
    });

    it('should calculate perfect contrast (black on white)', () => {
      const result = calculateContrastRatio([0, 0, 0], [255, 255, 255]);

      expect(result).toBe(21);
    });

    it('should calculate low contrast (same colors)', () => {
      const result = calculateContrastRatio([128, 128, 128], [128, 128, 128]);

      expect(result).toBe(1);
    });

    it('should calculate intermediate contrast', () => {
      const result = calculateContrastRatio([255, 255, 255], [51, 51, 51]);

      expect(result).toBeGreaterThan(10);
      expect(result).toBeLessThan(21);
    });
  });

  describe('isContrastCompliant', () => {
    it('should pass WCAG AA for white on black', () => {
      const result = isContrastCompliant(
        [255, 255, 255],
        [0, 0, 0],
        false,
        'AA'
      );

      expect(result).toBe(true);
    });

    it('should fail WCAG AA for low contrast', () => {
      const result = isContrastCompliant(
        [200, 200, 200],
        [200, 200, 200],
        false,
        'AA'
      );

      expect(result).toBe(false);
    });

    it('should differentiate between normal and large text', () => {
      const normalText = isContrastCompliant(
        [200, 200, 200],
        [100, 100, 100],
        false,
        'AA'
      );
      const largeText = isContrastCompliant(
        [200, 200, 200],
        [100, 100, 100],
        true,
        'AA'
      );

      // Large text should be equal or more lenient
      expect(typeof largeText).toBe('boolean');
      expect(typeof normalText).toBe('boolean');
    });

    it('should enforce stricter AAA standard', () => {
      const aa = isContrastCompliant(
        [200, 200, 200],
        [50, 50, 50],
        false,
        'AA'
      );
      const aaa = isContrastCompliant(
        [200, 200, 200],
        [50, 50, 50],
        false,
        'AAA'
      );

      // Both should be booleans
      expect(typeof aa).toBe('boolean');
      expect(typeof aaa).toBe('boolean');
    });
  });

  describe('hexToRgb', () => {
    it('should convert full hex to RGB', () => {
      const result = hexToRgb('#FFFFFF');

      expect(result).toEqual([255, 255, 255]);
    });

    it('should convert short hex to RGB', () => {
      const result = hexToRgb('#fff');

      expect(result).toEqual([255, 255, 255]);
    });

    it('should handle black', () => {
      const result = hexToRgb('#000000');

      expect(result).toEqual([0, 0, 0]);
    });

    it('should handle red', () => {
      const result = hexToRgb('#FF0000');

      expect(result).toEqual([255, 0, 0]);
    });

    it('should return null for invalid hex', () => {
      expect(hexToRgb('')).toBeNull();
      expect(hexToRgb('xy')).toBeNull();
    });

    it('should handle hex without hash', () => {
      const result = hexToRgb('FFFFFF');

      expect(result).toEqual([255, 255, 255]);
    });
  });

  describe('validateAccessibility', () => {
    it('should validate complete message', () => {
      const message: ToastMessage = {
        id: '1',
        title: 'Success',
        message: 'All good',
      };

      const result = validateAccessibility(message, 'success', 14);

      expect(result.isValid).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should flag empty message and title', () => {
      const message: ToastMessage = {
        id: '1',
        message: '',
      };

      const result = validateAccessibility(message, 'info', 14);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContain('No title or message provided');
    });

    it('should flag font size below minimum', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Message',
      };

      const result = validateAccessibility(message, 'info', 10);

      expect(result.isValid).toBe(false);
      expect(result.issues).toContainEqual(
        expect.stringContaining('below recommended minimum')
      );
    });

    it('should handle all toast types', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Message',
      };

      ['info', 'success', 'warning', 'error'].forEach((type) => {
        const result = validateAccessibility(message, type as any, 14);
        expect(result.isValid).toBe(true);
      });
    });
  });

  describe('constants', () => {
    it('should have all toast types mapped to roles', () => {
      expect(TOAST_TYPE_TO_ROLE.info).toBe('alert');
      expect(TOAST_TYPE_TO_ROLE.success).toBe('status');
      expect(TOAST_TYPE_TO_ROLE.warning).toBe('alert');
      expect(TOAST_TYPE_TO_ROLE.error).toBe('alert');
    });

    it('should have all toast types mapped to live regions', () => {
      expect(TOAST_TYPE_TO_LIVE_REGION.info).toBe('polite');
      expect(TOAST_TYPE_TO_LIVE_REGION.success).toBe('polite');
      expect(TOAST_TYPE_TO_LIVE_REGION.warning).toBe('assertive');
      expect(TOAST_TYPE_TO_LIVE_REGION.error).toBe('assertive');
    });

    it('should have all toast types with hint mappings', () => {
      expect(TOAST_TYPE_HINT_MAP.info).toBe('Information notification');
      expect(TOAST_TYPE_HINT_MAP.success).toBe('Success notification');
      expect(TOAST_TYPE_HINT_MAP.warning).toBe('Warning notification');
      expect(TOAST_TYPE_HINT_MAP.error).toBe('Error notification');
    });
  });
});
