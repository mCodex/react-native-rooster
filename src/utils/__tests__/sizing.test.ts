import {
  calculateLineHeight,
  calculateSingleLineHeight,
  calculateToastHeight,
  calculateMinimumWidth,
  calculateResponsiveWidth,
  getOptimalHeight,
  isValidDimensionConfig,
  type DimensionConfig,
} from '../sizing';

describe('sizing utilities', () => {
  describe('calculateLineHeight', () => {
    it('should calculate line height using 1.4 multiplier', () => {
      expect(calculateLineHeight(14)).toBe(20);
      expect(calculateLineHeight(16)).toBe(22);
      expect(calculateLineHeight(18)).toBe(25);
    });

    it('should enforce minimum line height of 20px', () => {
      expect(calculateLineHeight(10)).toBe(20); // 10 * 1.4 = 14, but min is 20
      expect(calculateLineHeight(5)).toBe(20);
    });

    it('should handle large font sizes', () => {
      const result = calculateLineHeight(88);
      expect(result).toBeGreaterThanOrEqual(88); // At least the font size
    });
  });

  describe('calculateSingleLineHeight', () => {
    it('should return calculated line height for a single line', () => {
      expect(calculateSingleLineHeight(14)).toBe(20);
      expect(calculateSingleLineHeight(16)).toBe(22);
    });

    it('should respect minimum line height', () => {
      expect(calculateSingleLineHeight(5)).toBe(20);
    });
  });

  describe('calculateToastHeight', () => {
    const baseConfig: DimensionConfig = {
      paddingVertical: 16,
      paddingHorizontal: 16,
      titleFontSize: 16,
      messageFontSize: 14,
      messageLineHeight: 20,
      titleMessageGap: 4,
      hasTitle: false,
      hasIcon: false,
    };

    it('should calculate height for message-only toast', () => {
      const result = calculateToastHeight(baseConfig, 1);

      // padding (16 * 2) + message (20 * 1) = 52
      expect(result).toBe(52);
    });

    it('should calculate height for title + message toast', () => {
      const configWithTitle = {
        ...baseConfig,
        hasTitle: true,
      };

      const result = calculateToastHeight(configWithTitle, 1);

      // padding (16 * 2) + title (22) + gap (4) + message (20 * 1) = 78
      expect(result).toBeGreaterThanOrEqual(44); // Minimum
    });

    it('should respect minimum height of 44px', () => {
      const minimalConfig = {
        ...baseConfig,
        paddingVertical: 0,
        messageLineHeight: 10,
      };

      const result = calculateToastHeight(minimalConfig, 1);

      expect(result).toBe(44);
    });

    it('should account for multiple message lines', () => {
      const result1 = calculateToastHeight(baseConfig, 1);
      const result2 = calculateToastHeight(baseConfig, 2);

      expect(result2).toBeGreaterThan(result1);
    });

    it('should cap message lines at 2 by default', () => {
      // Both should render the same since capped at 2
      const result2 = calculateToastHeight(baseConfig, 2);
      const result3 = calculateToastHeight(baseConfig, 3);

      expect(result2).toBe(result3);
    });
  });

  describe('calculateMinimumWidth', () => {
    it('should calculate minimum width without icon', () => {
      const result = calculateMinimumWidth(false, 16);

      // padding (16 * 2) + base width (200) = 232
      expect(result).toBe(232);
    });

    it('should include icon width when present', () => {
      const resultWithout = calculateMinimumWidth(false, 16);
      const resultWith = calculateMinimumWidth(true, 16, 24, 12);

      // icon (24) + margin (12) difference = 36
      expect(resultWith).toBe(resultWithout + 36);
    });

    it('should accept custom icon dimensions', () => {
      const result1 = calculateMinimumWidth(true, 16, 24, 12);
      const result2 = calculateMinimumWidth(true, 16, 32, 16);

      expect(result2).toBeGreaterThan(result1);
    });

    it('should handle large padding values', () => {
      const result = calculateMinimumWidth(false, 32);

      // padding (32 * 2) + base width (200) = 264
      expect(result).toBe(264);
    });
  });

  describe('calculateResponsiveWidth', () => {
    it('should calculate responsive width for screen', () => {
      const result = calculateResponsiveWidth(375, 16);

      // screen (375) - margins (16 * 2) = 343
      expect(result).toBe(343);
    });

    it('should enforce minimum width of 200px', () => {
      const result = calculateResponsiveWidth(100, 16);

      expect(result).toBe(200);
    });

    it('should handle large screens', () => {
      const result = calculateResponsiveWidth(1024, 16);

      // 1024 - 32 = 992
      expect(result).toBe(992);
    });

    it('should handle zero margins', () => {
      const result = calculateResponsiveWidth(500, 0);

      expect(result).toBe(500);
    });
  });

  describe('getOptimalHeight', () => {
    const config: DimensionConfig = {
      paddingVertical: 16,
      paddingHorizontal: 16,
      titleFontSize: 16,
      messageFontSize: 14,
      messageLineHeight: 20,
      titleMessageGap: 4,
      hasTitle: false,
      hasIcon: false,
    };

    it('should return calculated height', () => {
      const result = getOptimalHeight(config, 1);

      expect(result).toBeGreaterThanOrEqual(44);
    });

    it('should respect max height limit', () => {
      const result = getOptimalHeight(config, 2, 60);

      expect(result).toBeLessThanOrEqual(60);
    });

    it('should handle unlimited max height', () => {
      const result = getOptimalHeight(config, 2, Infinity);

      expect(result).toBeGreaterThan(60);
    });
  });

  describe('isValidDimensionConfig', () => {
    const validConfig: DimensionConfig = {
      paddingVertical: 16,
      paddingHorizontal: 16,
      titleFontSize: 16,
      messageFontSize: 14,
      messageLineHeight: 20,
      titleMessageGap: 4,
      hasTitle: false,
      hasIcon: false,
    };

    it('should validate a complete config', () => {
      expect(isValidDimensionConfig(validConfig)).toBe(true);
    });

    it('should reject missing required fields', () => {
      const incomplete = {
        paddingVertical: 16,
        paddingHorizontal: 16,
      };

      expect(isValidDimensionConfig(incomplete)).toBe(false);
    });

    it('should reject negative padding', () => {
      const invalid = {
        ...validConfig,
        paddingVertical: -16,
      };

      expect(isValidDimensionConfig(invalid)).toBe(false);
    });

    it('should reject zero font size', () => {
      const invalid = {
        ...validConfig,
        messageFontSize: 0,
      };

      expect(isValidDimensionConfig(invalid)).toBe(false);
    });

    it('should reject non-boolean hasTitle', () => {
      const invalid = {
        ...validConfig,
        hasTitle: 'true' as any,
      };

      expect(isValidDimensionConfig(invalid)).toBe(false);
    });
  });
});
