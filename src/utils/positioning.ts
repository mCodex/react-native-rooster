import type { ViewStyle } from 'react-native';

import type { ToastHorizontalPosition, ToastPlacement } from '../types';

const MAX_CONSTRAINED_WIDTH = 420;
const EDGE_MARGIN = 16;
const MIN_RESPONSIVE_WIDTH = 200;

/** True when the toast stack grows top-down or bottom-up. */
export const isVerticalPlacement = (placement: ToastPlacement): boolean =>
  placement === 'top' || placement === 'bottom';

/** Top/bottom offset and stack-growth direction for the host. */
export const getVerticalPosition = (
  placement: ToastPlacement,
  offset: number,
): Pick<ViewStyle, 'top' | 'bottom' | 'justifyContent'> =>
  placement === 'top'
    ? { top: offset, justifyContent: 'flex-start' }
    : { bottom: offset, justifyContent: 'flex-end' };

/** `alignItems` for the host container based on horizontal alignment. */
export const getHorizontalContainerAlignment = (
  alignment: ToastHorizontalPosition,
): Pick<ViewStyle, 'alignItems'> => {
  switch (alignment) {
    case 'left':
      return { alignItems: 'flex-start' };
    case 'right':
      return { alignItems: 'flex-end' };
    default:
      return { alignItems: 'center' };
  }
};

/**
 * Per-card alignment + width strategy.
 *  - top/bottom + center → responsive full width minus margins
 *  - everything else     → constrained to {@link MAX_CONSTRAINED_WIDTH}
 */
export const getToastAlignment = (
  horizontalPosition: ToastHorizontalPosition,
  verticalPlacement: ToastPlacement,
  marginHorizontal: number,
  screenWidth: number,
): ViewStyle => {
  const isTopBottom = isVerticalPlacement(verticalPlacement);

  if (isTopBottom && horizontalPosition === 'center') {
    const width = Math.max(
      MIN_RESPONSIVE_WIDTH,
      screenWidth - marginHorizontal * 2,
    );
    return { alignSelf: 'center', marginHorizontal, width };
  }

  if (isTopBottom) {
    switch (horizontalPosition) {
      case 'left':
        return {
          alignSelf: 'flex-start',
          maxWidth: MAX_CONSTRAINED_WIDTH,
          marginStart: EDGE_MARGIN,
        };
      case 'right':
        return {
          alignSelf: 'flex-end',
          maxWidth: MAX_CONSTRAINED_WIDTH,
          marginEnd: EDGE_MARGIN,
        };
      default:
        return { alignSelf: 'center', maxWidth: MAX_CONSTRAINED_WIDTH };
    }
  }

  switch (horizontalPosition) {
    case 'left':
      return {
        alignSelf: 'flex-start',
        maxWidth: MAX_CONSTRAINED_WIDTH,
        marginEnd: EDGE_MARGIN,
      };
    case 'right':
      return {
        alignSelf: 'flex-end',
        maxWidth: MAX_CONSTRAINED_WIDTH,
        marginStart: EDGE_MARGIN,
      };
    default:
      return { alignSelf: 'center', maxWidth: MAX_CONSTRAINED_WIDTH };
  }
};

/** Host horizontal padding — only applied for left/right placements. */
export const getHostPaddingHorizontal = (
  verticalPlacement: ToastPlacement,
  marginHorizontal: number,
): number => (isVerticalPlacement(verticalPlacement) ? 0 : marginHorizontal);
