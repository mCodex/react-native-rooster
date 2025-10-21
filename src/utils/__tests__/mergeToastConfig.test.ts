import { Easing } from 'react-native';
import mergeToastConfig from '../mergeToastConfig';
import type { ToastConfig } from '../../types';

describe('mergeToastConfig', () => {
  const baseConfig: ToastConfig = {
    bgColor: {
      error: '#d92027',
      success: '#35d0ba',
      warning: '#ff9100',
      info: '#7890f0',
    },
    timeToDismiss: 3000,
    spacing: 12,
    placement: 'bottom',
    horizontalPosition: 'center',
    font: {
      fontFamilyRegular: null,
      fontFamilyBold: null,
      messageFontSize: 14,
      titleFontSize: 16,
    },
    animation: {
      initialTranslation: 24,
      appearDuration: 220,
      disappearDuration: 180,
      easing: Easing.out(Easing.cubic),
    },
  };

  describe('basic merging', () => {
    it('should merge simple properties', () => {
      const patch = { timeToDismiss: 5000 };
      const result = mergeToastConfig(baseConfig, patch);

      expect(result.timeToDismiss).toBe(5000);
      expect(result.spacing).toBe(12); // Unchanged
    });

    it('should not mutate the base config', () => {
      const patch = { timeToDismiss: 5000 };
      const originalToDismiss = baseConfig.timeToDismiss;

      mergeToastConfig(baseConfig, patch);

      expect(baseConfig.timeToDismiss).toBe(originalToDismiss);
    });

    it('should not mutate the patch config', () => {
      const patch = { timeToDismiss: 5000 };
      const originalToDismiss = patch.timeToDismiss;

      mergeToastConfig(baseConfig, patch);

      expect(patch.timeToDismiss).toBe(originalToDismiss);
    });
  });

  describe('bgColor merging', () => {
    it('should merge background colors', () => {
      const patch = {
        bgColor: {
          success: '#00ff00',
          error: '#d92027',
          warning: '#ff9100',
          info: '#7890f0',
        },
      };
      const result = mergeToastConfig(baseConfig, patch);

      expect(result.bgColor.success).toBe('#00ff00');
      expect(result.bgColor.error).toBe('#d92027'); // Unchanged
    });

    it('should handle empty bgColor patch', () => {
      const patch = {
        bgColor: {
          success: '#00ff00',
          error: '#d92027',
          warning: '#ff9100',
          info: '#7890f0',
        },
      };
      const result = mergeToastConfig(baseConfig, patch as any);

      expect(result.bgColor).toEqual(patch.bgColor);
    });
  });

  describe('font merging', () => {
    it('should merge font sizes', () => {
      const patch = {
        font: {
          messageFontSize: 16,
          titleFontSize: 18,
        },
      };
      const result = mergeToastConfig(baseConfig, patch);

      expect(result.font?.messageFontSize).toBe(16);
      expect(result.font?.titleFontSize).toBe(18);
    });

    it('should merge font families', () => {
      const patch = {
        font: {
          fontFamilyRegular: 'Helvetica',
          fontFamilyBold: 'Helvetica-Bold',
        },
      };
      const result = mergeToastConfig(baseConfig, patch);

      expect(result.font?.fontFamilyRegular).toBe('Helvetica');
      expect(result.font?.fontFamilyBold).toBe('Helvetica-Bold');
    });

    it('should preserve font properties when not patched', () => {
      const patch = {
        font: {
          messageFontSize: 15,
        },
      };
      const result = mergeToastConfig(baseConfig, patch);

      expect(result.font?.messageFontSize).toBe(15);
      expect(result.font?.titleFontSize).toBe(16); // Unchanged
      expect(result.font?.fontFamilyRegular).toBeNull();
    });

    it('should handle undefined font in base', () => {
      const configWithoutFont = { ...baseConfig, font: undefined };
      const patch = {
        font: {
          messageFontSize: 20,
        },
      };
      const result = mergeToastConfig(configWithoutFont, patch);

      expect(result.font?.messageFontSize).toBe(20);
    });
  });

  describe('animation merging', () => {
    it('should merge animation properties', () => {
      const patch = {
        animation: {
          appearDuration: 300,
        },
      };
      const result = mergeToastConfig(baseConfig, patch);

      expect(result.animation?.appearDuration).toBe(300);
      expect(result.animation?.disappearDuration).toBe(180); // Unchanged
    });

    it('should preserve easing function', () => {
      const patch = {
        animation: {
          appearDuration: 300,
        },
      };
      const result = mergeToastConfig(baseConfig, patch);

      expect(result.animation?.easing).toBe(baseConfig.animation?.easing);
    });
  });

  describe('position merging', () => {
    it('should merge position properties', () => {
      const config = {
        ...baseConfig,
        position: {
          vertical: 'bottom' as const,
          horizontal: 'center' as const,
        },
      };
      const patch = {
        position: {
          horizontal: 'right' as const,
        },
      };
      const result = mergeToastConfig(config, patch);

      expect(result.position?.vertical).toBe('bottom');
      expect(result.position?.horizontal).toBe('right');
    });

    it('should fall back to placement for vertical position', () => {
      const config = {
        ...baseConfig,
        placement: 'top' as const,
      };
      const patch = {
        position: {
          horizontal: 'left' as const,
        },
      };
      const result = mergeToastConfig(config, patch);

      expect(result.position?.vertical).toBe('top');
      expect(result.position?.horizontal).toBe('left');
    });

    it('should fall back to horizontalPosition', () => {
      const config = {
        ...baseConfig,
        horizontalPosition: 'left' as const,
      };
      const patch = {
        position: {
          vertical: 'top' as const,
        },
      };
      const result = mergeToastConfig(config, patch);

      expect(result.position?.vertical).toBe('top');
      expect(result.position?.horizontal).toBe('left');
    });
  });

  describe('padding merging', () => {
    it('should merge padding properties', () => {
      const config = {
        ...baseConfig,
        padding: {
          vertical: 12,
          horizontal: 16,
        },
      };
      const patch = {
        padding: {
          vertical: 20,
        },
      };
      const result = mergeToastConfig(config, patch);

      expect(result.padding?.vertical).toBe(20);
      expect(result.padding?.horizontal).toBe(16);
    });
  });

  describe('shadow merging', () => {
    it('should merge shadow properties', () => {
      const config = {
        ...baseConfig,
        shadow: {
          color: '#000',
          opacity: 0.2,
          offset: { width: 0, height: 4 },
          radius: 8,
        },
      };
      const patch = {
        shadow: {
          opacity: 0.5,
        },
      };
      const result = mergeToastConfig(config, patch);

      expect(result.shadow?.opacity).toBe(0.5);
      expect(result.shadow?.color).toBe('#000');
      expect(result.shadow?.radius).toBe(8);
    });
  });

  describe('accessibility merging', () => {
    it('should merge accessibility properties', () => {
      const config = {
        ...baseConfig,
        accessibility: {
          allowFontScaling: false,
          messageMaxLines: 2,
        },
      };
      const patch = {
        accessibility: {
          allowFontScaling: true,
        },
      };
      const result = mergeToastConfig(config, patch);

      expect(result.accessibility?.allowFontScaling).toBe(true);
      expect(result.accessibility?.messageMaxLines).toBe(2);
    });

    it('should merge haptic feedback settings', () => {
      const config = {
        ...baseConfig,
        accessibility: {
          hapticFeedback: false,
        },
      } as any;
      const patch = {
        accessibility: {
          hapticFeedback: 'light' as const,
        },
      };
      const result = mergeToastConfig(config, patch as any);

      expect(result.accessibility?.hapticFeedback).toBe('light');
    });
  });

  describe('complex merging scenarios', () => {
    it('should handle empty patch', () => {
      const result = mergeToastConfig(baseConfig, {});

      expect(result).toEqual(baseConfig);
      expect(result).not.toBe(baseConfig); // Should be a new object
    });

    it('should handle multiple nested merges', () => {
      const patch1 = {
        timeToDismiss: 4000,
        font: { messageFontSize: 15 },
      };
      const intermediate = mergeToastConfig(baseConfig, patch1);

      const patch2 = {
        font: { titleFontSize: 18 },
      };
      const result = mergeToastConfig(intermediate, patch2);

      expect(result.timeToDismiss).toBe(4000);
      expect(result.font?.messageFontSize).toBe(15);
      expect(result.font?.titleFontSize).toBe(18);
    });

    it('should handle complete config replacement', () => {
      const newConfig: ToastConfig = {
        bgColor: {
          error: '#ff0000',
          success: '#00ff00',
          warning: '#ffff00',
          info: '#0000ff',
        },
        timeToDismiss: 5000,
        spacing: 20,
        placement: 'top',
        horizontalPosition: 'right',
      };

      const result = mergeToastConfig(baseConfig, newConfig);

      expect(result.timeToDismiss).toBe(5000);
      expect(result.placement).toBe('top');
      expect(result.spacing).toBe(20);
    });
  });
});
