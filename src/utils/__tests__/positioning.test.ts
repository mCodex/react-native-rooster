import {
  isVerticalPlacement,
  getVerticalPosition,
  getHorizontalContainerAlignment,
  getToastAlignment,
  getHostPaddingHorizontal,
} from '../positioning';

describe('positioning utilities', () => {
  describe('isVerticalPlacement', () => {
    it('should return true for top placement', () => {
      expect(isVerticalPlacement('top')).toBe(true);
    });

    it('should return true for bottom placement', () => {
      expect(isVerticalPlacement('bottom')).toBe(true);
    });
  });

  describe('getVerticalPosition', () => {
    it('should return top position with flex-start', () => {
      const result = getVerticalPosition('top', 20);

      expect(result.top).toBe(20);
      expect(result.justifyContent).toBe('flex-start');
      expect(result.bottom).toBeUndefined();
    });

    it('should return bottom position with flex-end', () => {
      const result = getVerticalPosition('bottom', 48);

      expect(result.bottom).toBe(48);
      expect(result.justifyContent).toBe('flex-end');
      expect(result.top).toBeUndefined();
    });

    it('should handle zero offset', () => {
      const result = getVerticalPosition('top', 0);

      expect(result.top).toBe(0);
    });
  });

  describe('getHorizontalContainerAlignment', () => {
    it('should return flex-start for left alignment', () => {
      const result = getHorizontalContainerAlignment('left');

      expect(result.alignItems).toBe('flex-start');
    });

    it('should return center for center alignment', () => {
      const result = getHorizontalContainerAlignment('center');

      expect(result.alignItems).toBe('center');
    });

    it('should return flex-end for right alignment', () => {
      const result = getHorizontalContainerAlignment('right');

      expect(result.alignItems).toBe('flex-end');
    });
  });

  describe('getToastAlignment', () => {
    it('should return responsive width for top center', () => {
      const result = getToastAlignment('center', 'top', 16, 375);

      expect(result.alignSelf).toBe('center');
      expect(result.marginHorizontal).toBe(16);
      expect(result.width).toBe(343); // 375 - 32
    });

    it('should return responsive width for bottom center', () => {
      const result = getToastAlignment('center', 'bottom', 16, 500);

      expect(result.alignSelf).toBe('center');
      expect(result.width).toBe(468); // 500 - 32
    });

    it('should enforce minimum width of 200px', () => {
      const result = getToastAlignment('center', 'top', 16, 150);

      expect(result.width).toBe(200); // Minimum enforced
    });

    it('should return constrained width for top left', () => {
      const result = getToastAlignment('left', 'top', 16, 375);

      expect(result.alignSelf).toBe('flex-start');
      expect(result.maxWidth).toBe(420);
      expect(result.marginStart).toBe(16);
    });

    it('should return constrained width for top right', () => {
      const result = getToastAlignment('right', 'top', 16, 375);

      expect(result.alignSelf).toBe('flex-end');
      expect(result.maxWidth).toBe(420);
      expect(result.marginEnd).toBe(16);
    });

    it('should handle left alignment with top placement', () => {
      const result = getToastAlignment('left', 'top', 16, 375);

      expect(result.alignSelf).toBe('flex-start');
      expect(result.maxWidth).toBe(420);
      expect(result.marginStart).toBe(16);
    });

    it('should handle right alignment with top placement', () => {
      const result = getToastAlignment('right', 'top', 16, 375);

      expect(result.alignSelf).toBe('flex-end');
      expect(result.maxWidth).toBe(420);
      expect(result.marginEnd).toBe(16);
    });
  });

  describe('getHostPaddingHorizontal', () => {
    it('should return 0 for top placement', () => {
      const result = getHostPaddingHorizontal('top', 16);

      expect(result).toBe(0);
    });

    it('should return 0 for bottom placement', () => {
      const result = getHostPaddingHorizontal('bottom', 16);

      expect(result).toBe(0);
    });

    it('should handle different margin values', () => {
      const result1 = getHostPaddingHorizontal('top', 8);
      const result2 = getHostPaddingHorizontal('bottom', 16);

      expect(result1).toBe(0);
      expect(result2).toBe(0);
    });
  });
});
