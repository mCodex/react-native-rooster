/**
 * Positioning utilities for toast layout and alignment calculations.
 * These pure functions provide a single source of truth for spatial logic.
 *
 * @module utils/positioning
 */

import type { ViewStyle } from 'react-native';
import type { ToastHorizontalPosition, ToastPlacement } from '../types';

/**
 * Determines if a placement is vertical (top/bottom).
 * Used to branch layout behavior between full-width and constrained modes.
 *
 * @param placement - The vertical placement of the toast stack
 * @returns `true` if placement is 'top' or 'bottom'
 *
 * @example
 * isVerticalPlacement('top'); // => true
 * isVerticalPlacement('bottom'); // => true
 */
export const isVerticalPlacement = (placement: ToastPlacement): boolean =>
  placement === 'top' || placement === 'bottom';

/**
 * Computes the vertical position style for the toast container host.
 * Handles offset calculation and flex direction for stack growth.
 *
 * Contract: Returns a ViewStyle with either `top` or `bottom` set.
 * The `justifyContent` field controls stack growth direction.
 *
 * @param placement - Vertical position ('top' or 'bottom')
 * @param offset - Computed offset including safe-area and keyboard insets
 * @returns ViewStyle with position, offset, and flex direction
 *
 * @example
 * getVerticalPosition('top', 20);
 * // => { top: 20, justifyContent: 'flex-start' }
 *
 * @example
 * getVerticalPosition('bottom', 48);
 * // => { bottom: 48, justifyContent: 'flex-end' }
 */
export const getVerticalPosition = (
  placement: ToastPlacement,
  offset: number
): Pick<ViewStyle, 'top' | 'bottom' | 'justifyContent'> =>
  placement === 'top'
    ? { top: offset, justifyContent: 'flex-start' }
    : { bottom: offset, justifyContent: 'flex-end' };

/**
 * Maps horizontal alignment to container-level flex alignment.
 * Controls how the toast stack is distributed horizontally.
 *
 * Contract: Returns a ViewStyle with only `alignItems` set.
 * Used on the host container, not individual toast cards.
 *
 * @param alignment - Horizontal position ('left', 'center', or 'right')
 * @returns ViewStyle with alignItems property only
 *
 * @example
 * getHorizontalContainerAlignment('center');
 * // => { alignItems: 'center' }
 *
 * @example
 * getHorizontalContainerAlignment('left');
 * // => { alignItems: 'flex-start' }
 */
export const getHorizontalContainerAlignment = (
  alignment: ToastHorizontalPosition
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
 * Computes the individual toast card alignment within its container.
 * This is separate from container-level alignment for proper flex layout.
 *
 * Behavior:
 * - For top/bottom CENTER: Uses dynamic width with margins (responsive to screen width)
 * - For top/bottom LEFT/RIGHT: Uses constrained width with alignment
 * - For left/right positions: Uses constrained width (fixed limits)
 *
 * Contract: Returns a ViewStyle appropriate for the position/alignment combo.
 * Never returns undefined; always returns a valid, complete style object.
 *
 * @param horizontalPosition - Alignment of the toast card
 * @param verticalPlacement - Vertical position (determines width strategy)
 * @param marginHorizontal - Margin applied to edge spacing
 * @param screenWidth - Current screen width for responsive sizing
 * @returns ViewStyle with alignment and width constraints
 *
 * @example
 * // Top/bottom CENTER: Responsive full-width with margins
 * getToastAlignment('center', 'top', 16, 375);
 * // => { alignSelf: 'center', marginHorizontal: 16, width: 343 }
 * // (375 - 2*16 = 343px available width)
 *
 * @example
 * // Top/bottom LEFT: Constrained width with left alignment
 * getToastAlignment('left', 'top', 16, 375);
 * // => { alignSelf: 'flex-start', maxWidth: 420, marginStart: 16 }
 *
 * @example
 * // Left position: Constrained width (doesn't use responsive)
 * getToastAlignment('left', 'left', 16, 375);
 * // => { alignSelf: 'flex-start', maxWidth: 420, marginEnd: 16 }
 */
export const getToastAlignment = (
  horizontalPosition: ToastHorizontalPosition,
  verticalPlacement: ToastPlacement,
  marginHorizontal: number,
  screenWidth: number
): ViewStyle => {
  const isTopBottom = isVerticalPlacement(verticalPlacement);
  const isCenterAlignment = horizontalPosition === 'center';

  // For top/bottom CENTER ONLY: calculate responsive width accounting for margins
  // width = screenWidth - (marginHorizontal * 2)
  // Minimum 200px to ensure readable content
  const responsiveWidth = Math.max(200, screenWidth - marginHorizontal * 2);

  // Responsive width only for top/bottom + center alignment
  if (isTopBottom && isCenterAlignment) {
    return { alignSelf: 'center', marginHorizontal, width: responsiveWidth };
  }

  // For other top/bottom positions: constrained width with alignment
  if (isTopBottom) {
    switch (horizontalPosition) {
      case 'left':
        return { alignSelf: 'flex-start', maxWidth: 420, marginStart: 16 };
      case 'right':
        return { alignSelf: 'flex-end', maxWidth: 420, marginEnd: 16 };
      default:
        return { alignSelf: 'center', maxWidth: 420 };
    }
  }

  // For left/right positions: standard constrained width
  switch (horizontalPosition) {
    case 'left':
      return { alignSelf: 'flex-start', maxWidth: 420, marginEnd: 16 };
    case 'right':
      return { alignSelf: 'flex-end', maxWidth: 420, marginStart: 16 };
    default:
      return { alignSelf: 'center', maxWidth: 420 };
  }
};

/**
 * Computes the host container's horizontal padding.
 * Determines whether the container or individual toasts handle edge spacing.
 *
 * Logic:
 * - Top/bottom positions: `0` (toasts handle their own `marginHorizontal`)
 * - Left/right positions: `marginHorizontal` (provides edge spacing)
 *
 * This prevents double-spacing and ensures consistent behavior.
 *
 * @param verticalPlacement - Vertical position
 * @param marginHorizontal - The configured horizontal margin
 * @returns Padding value for the host container
 *
 * @example
 * getHostPaddingHorizontal('top', 16);
 * // => 0 (toasts handle margins)
 *
 * @example
 * getHostPaddingHorizontal('right', 16);
 * // => 16 (container provides edge spacing)
 */
export const getHostPaddingHorizontal = (
  verticalPlacement: ToastPlacement,
  marginHorizontal: number
): number => (isVerticalPlacement(verticalPlacement) ? 0 : marginHorizontal);
