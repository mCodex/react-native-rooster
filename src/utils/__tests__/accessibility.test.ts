import type { ToastMessage } from '../../types';
import {
  generateAccessibilityHint,
  generateAccessibilityLabel,
  TOAST_TYPE_TO_LIVE_REGION,
  TOAST_TYPE_TO_ROLE,
} from '../accessibility';

describe('accessibility utilities', () => {
  describe('generateAccessibilityLabel', () => {
    it('joins title and message with a comma', () => {
      const msg: ToastMessage = {
        id: '1',
        title: 'Success',
        message: 'Profile updated',
      };
      expect(generateAccessibilityLabel(msg)).toBe('Success, Profile updated');
    });

    it('falls back to message when title is absent', () => {
      expect(
        generateAccessibilityLabel({ id: '1', message: 'An error occurred' }),
      ).toBe('An error occurred');
    });

    it('falls back to title when message is empty', () => {
      expect(
        generateAccessibilityLabel({ id: '1', title: 'Heads up', message: '' }),
      ).toBe('Heads up');
    });

    it('returns empty string when both are absent', () => {
      expect(generateAccessibilityLabel({ id: '1', message: '' })).toBe('');
    });

    it('truncates at 150 characters with an ellipsis', () => {
      const result = generateAccessibilityLabel({
        id: '1',
        message: 'a'.repeat(200),
      });
      expect(result.length).toBeLessThanOrEqual(150);
      expect(result.endsWith('...')).toBe(true);
    });
  });

  describe('generateAccessibilityHint', () => {
    it('returns the type-specific hint', () => {
      expect(generateAccessibilityHint('success')).toBe('Success notification');
      expect(generateAccessibilityHint('error')).toBe('Error notification');
      expect(generateAccessibilityHint('warning')).toBe('Warning notification');
      expect(generateAccessibilityHint('info')).toBe(
        'Information notification',
      );
    });

    it('appends a dismissal hint when interactive', () => {
      expect(generateAccessibilityHint('success', true)).toBe(
        'Success notification. Double tap to dismiss',
      );
    });

    it('defaults to info when no type is given', () => {
      expect(generateAccessibilityHint()).toBe('Information notification');
    });
  });

  describe('TOAST_TYPE_TO_ROLE', () => {
    it('maps every toast type to a Pressable-supported role', () => {
      expect(TOAST_TYPE_TO_ROLE.info).toBe('button');
      expect(TOAST_TYPE_TO_ROLE.success).toBe('button');
      expect(TOAST_TYPE_TO_ROLE.warning).toBe('button');
      expect(TOAST_TYPE_TO_ROLE.error).toBe('button');
    });
  });

  describe('TOAST_TYPE_TO_LIVE_REGION', () => {
    it('uses assertive for warnings and errors', () => {
      expect(TOAST_TYPE_TO_LIVE_REGION.warning).toBe('assertive');
      expect(TOAST_TYPE_TO_LIVE_REGION.error).toBe('assertive');
    });

    it('uses polite for info and success', () => {
      expect(TOAST_TYPE_TO_LIVE_REGION.info).toBe('polite');
      expect(TOAST_TYPE_TO_LIVE_REGION.success).toBe('polite');
    });
  });
});
