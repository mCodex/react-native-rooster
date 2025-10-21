import {
  buildToastStyle,
  getBaseToastStyle,
  getToastCustomizationStyle,
  DEFAULT_FONT_SIZES,
  toastStyles,
  containerStyles,
} from '../styling';
import type { ToastConfig, ToastMessage } from '../../types';

describe('styling utilities', () => {
  const baseConfig: ToastConfig = {
    bgColor: {
      error: '#d92027',
      success: '#35d0ba',
      warning: '#ff9100',
      info: '#7890f0',
    },
    timeToDismiss: 3000,
    borderRadius: 12,
    padding: {
      vertical: 16,
      horizontal: 16,
    },
    shadow: {
      color: '#000',
      opacity: 0.2,
      offset: { width: 0, height: 12 },
      radius: 16,
    },
  };

  describe('buildToastStyle', () => {
    it('should build complete style array', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        type: 'info',
      };
      const alignmentStyle = { alignSelf: 'center' as const };
      const animationStyle = { opacity: 1, transform: [] };

      const result = buildToastStyle(
        baseConfig,
        message,
        alignmentStyle,
        animationStyle
      );

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include background color from message type', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        type: 'success',
      };
      const alignmentStyle = {};
      const animationStyle = { opacity: 1, transform: [] };

      const result = buildToastStyle(
        baseConfig,
        message,
        alignmentStyle,
        animationStyle
      );

      // Result is an array, should include bgColor
      expect(result).toContainEqual(
        expect.objectContaining({
          backgroundColor: baseConfig.bgColor.success,
        })
      );
    });

    it('should apply per-toast custom style', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        backgroundColor: '#ff0000',
        style: { borderWidth: 2 },
      };
      const alignmentStyle = {};
      const animationStyle = { opacity: 1, transform: [] };

      const result = buildToastStyle(
        baseConfig,
        message,
        alignmentStyle,
        animationStyle
      );

      // Per-toast style should be in the array
      expect(result).toContainEqual(
        expect.objectContaining({ borderWidth: 2 })
      );
    });
  });

  describe('getBaseToastStyle', () => {
    it('should return base style with config properties', () => {
      const result = getBaseToastStyle(baseConfig);

      expect(result.minWidth).toBe(200);
      expect(result.minHeight).toBe(44);
      expect(result.paddingVertical).toBe(16);
      expect(result.paddingHorizontal).toBe(16);
      expect(result.borderRadius).toBe(12);
    });

    it('should use default shadow when not specified', () => {
      const configWithoutShadow = { ...baseConfig, shadow: undefined };
      const result = getBaseToastStyle(configWithoutShadow);

      expect(result.shadowColor).toBe('#000');
      expect(result.shadowOpacity).toBe(0.2);
    });

    it('should use custom shadow from config', () => {
      const customConfig = {
        ...baseConfig,
        shadow: {
          color: '#ff0000',
          opacity: 0.5,
          offset: { width: 2, height: 2 },
          radius: 4,
        },
      };
      const result = getBaseToastStyle(customConfig);

      expect(result.shadowColor).toBe('#ff0000');
      expect(result.shadowOpacity).toBe(0.5);
    });

    it('should use default padding when not specified', () => {
      const configWithoutPadding = { ...baseConfig, padding: undefined };
      const result = getBaseToastStyle(configWithoutPadding);

      expect(result.paddingVertical).toBe(16);
      expect(result.paddingHorizontal).toBe(16);
    });

    it('should apply elevation on Android', () => {
      const result = getBaseToastStyle(baseConfig);

      expect(result.elevation).toBe(8);
    });
  });

  describe('getToastCustomizationStyle', () => {
    it('should return empty object when no customizations', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
      };

      const result = getToastCustomizationStyle(message);

      expect(result).toEqual({});
    });

    it('should extract backgroundColor override', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        backgroundColor: '#ff0000',
      };

      const result = getToastCustomizationStyle(message);

      expect(result.backgroundColor).toBe('#ff0000');
    });

    it('should extract borderRadius override', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        borderRadius: 8,
      };

      const result = getToastCustomizationStyle(message);

      expect(result.borderRadius).toBe(8);
    });

    it('should extract font size overrides', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        messageFontSize: 16,
        titleFontSize: 18,
      };

      const result = getToastCustomizationStyle(message);

      expect((result as any).messageFontSize).toBe(16);
      expect((result as any).titleFontSize).toBe(18);
    });

    it('should extract padding overrides', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        padding: {
          vertical: 20,
          horizontal: 24,
        },
      };

      const result = getToastCustomizationStyle(message);

      expect(result.paddingVertical).toBe(20);
      expect(result.paddingHorizontal).toBe(24);
    });

    it('should handle partial padding overrides', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        padding: {
          vertical: 20,
        },
      };

      const result = getToastCustomizationStyle(message);

      expect(result.paddingVertical).toBe(20);
      expect(result.paddingHorizontal).toBeUndefined();
    });

    it('should include all customizations together', () => {
      const message: ToastMessage = {
        id: '1',
        message: 'Test',
        backgroundColor: '#00ff00',
        borderRadius: 16,
        messageFontSize: 15,
      };

      const result = getToastCustomizationStyle(message);

      expect(Object.keys(result).length).toBe(3);
      expect(result.backgroundColor).toBe('#00ff00');
      expect(result.borderRadius).toBe(16);
      expect((result as any).messageFontSize).toBe(15);
    });
  });

  describe('DEFAULT_FONT_SIZES', () => {
    it('should have title font size', () => {
      expect(DEFAULT_FONT_SIZES.title).toBe(16);
    });

    it('should have message font size', () => {
      expect(DEFAULT_FONT_SIZES.message).toBe(14);
    });
  });

  describe('toastStyles stylesheet', () => {
    it('should have pressable style', () => {
      expect(toastStyles.pressable).toBeDefined();
      expect(toastStyles.pressable.flexDirection).toBe('row');
      expect(toastStyles.pressable.minHeight).toBe(44);
    });

    it('should have icon style', () => {
      expect(toastStyles.icon).toBeDefined();
      expect(toastStyles.icon.marginRight).toBe(12);
      expect(toastStyles.icon.flexShrink).toBe(0);
    });

    it('should have content style', () => {
      expect(toastStyles.content).toBeDefined();
      expect(toastStyles.content.flex).toBe(1);
    });

    it('should have title style', () => {
      expect(toastStyles.title).toBeDefined();
      expect(toastStyles.title.fontSize).toBe(DEFAULT_FONT_SIZES.title);
      expect(toastStyles.title.fontWeight).toBe('600');
    });

    it('should have message style', () => {
      expect(toastStyles.message).toBeDefined();
      expect(toastStyles.message.fontSize).toBe(DEFAULT_FONT_SIZES.message);
    });
  });

  describe('containerStyles stylesheet', () => {
    it('should have overlay style', () => {
      expect(containerStyles.overlay).toBeDefined();
      expect(containerStyles.overlay.backgroundColor).toBe('transparent');
    });

    it('should have host style', () => {
      expect(containerStyles.host).toBeDefined();
      expect(containerStyles.host.position).toBe('absolute');
      expect(containerStyles.host.width).toBe('100%');
    });
  });
});
