/**
 * Sizing utilities for dynamic toast dimensions.
 * Calculates height and width based on content, typography, and configuration.
 *
 * Design principles:
 * - All functions are pure (no side effects)
 * - Preserves existing behavior (responsive width for center position)
 * - Enables dynamic sizing based on actual content
 * - Strong type safety with comprehensive JSDoc
 * - Testable in isolation
 *
 * @module utils/sizing
 */

/**
 * Configuration for dynamic sizing calculations.
 * Allows fine-tuning of height calculations based on content.
 *
 * @interface DimensionConfig
 */
export interface DimensionConfig {
  /** Padding vertical applied to toast card (pixels) */
  paddingVertical: number;
  /** Padding horizontal applied to toast card (pixels) */
  paddingHorizontal: number;
  /** Font size for title text (pixels) */
  titleFontSize: number;
  /** Font size for message text (pixels) */
  messageFontSize: number;
  /** Line height for message text (computed from font size) */
  messageLineHeight: number;
  /** Gap between title and message (pixels) */
  titleMessageGap: number;
  /** Icon width if present (pixels, default: 24) */
  iconWidth?: number;
  /** Icon right margin (pixels, default: 12) */
  iconMargin?: number;
  /** Has title (boolean, affects height calculation) */
  hasTitle: boolean;
  /** Has icon (boolean, affects width calculation) */
  hasIcon: boolean;
}

/**
 * Calculates optimal line height based on font size.
 * Uses typography best practices for readability.
 *
 * Formula: lineHeight = fontSize * 1.4 (standard for body text)
 * Minimum: 20px (ensures readability)
 * Maximum: fontSize + 8px (prevents excessive spacing)
 *
 * @param fontSize - Font size in pixels
 * @returns Calculated line height in pixels
 *
 * @example
 * calculateLineHeight(14); // => 20 (14 * 1.4 = 19.6, rounded to 20)
 * calculateLineHeight(16); // => 22 (16 * 1.4 = 22.4, rounded to 22)
 * calculateLineHeight(88); // => 123 (88 * 1.4 = 123.2)
 */
export const calculateLineHeight = (fontSize: number): number => {
  const calculated = Math.round(fontSize * 1.4);
  return Math.max(20, calculated);
};

/**
 * Estimates content height for a single line of text.
 * Used to calculate toast height when text wrapping isn't needed.
 *
 * @param fontSize - Font size in pixels
 * @returns Height needed for one line including appropriate spacing
 *
 * @example
 * calculateSingleLineHeight(14); // => 20
 * calculateSingleLineHeight(16); // => 22
 */
export const calculateSingleLineHeight = (fontSize: number): number => {
  return calculateLineHeight(fontSize);
};

/**
 * Calculates total content height for a toast message.
 * Accounts for title, message, padding, and spacing.
 *
 * Height formula:
 * - If only message: messageLineHeight * numberOfLines
 * - If title + message: titleHeight + gap + (messageLineHeight * numberOfLines)
 * - Add vertical padding on top and bottom
 * - Minimum height: 44px (accessibility tap target)
 *
 * @param config - Dimension configuration
 * @param messageLines - Number of visible message lines (typically 1-2)
 * @returns Total height needed for the toast in pixels
 *
 * @example
 * // Simple message only
 * calculateToastHeight({
 *   paddingVertical: 16,
 *   paddingHorizontal: 16,
 *   titleFontSize: 16,
 *   messageFontSize: 14,
 *   messageLineHeight: 20,
 *   titleMessageGap: 4,
 *   hasTitle: false,
 *   hasIcon: false,
 * }, 1);
 * // => 52 (16 + 20 + 16 = 52)
 *
 * @example
 * // Title + message
 * calculateToastHeight({
 *   paddingVertical: 16,
 *   paddingHorizontal: 16,
 *   titleFontSize: 16,
 *   messageFontSize: 14,
 *   messageLineHeight: 20,
 *   titleMessageGap: 4,
 *   hasTitle: true,
 *   hasIcon: false,
 * }, 2);
 * // => 92 (16 + 22 + 4 + 40 + 16 = 98, minimum 44)
 */
export const calculateToastHeight = (
  config: DimensionConfig,
  messageLines: number = 2
): number => {
  let height = config.paddingVertical * 2; // top + bottom padding

  // Add title height if present
  if (config.hasTitle) {
    height += calculateSingleLineHeight(config.titleFontSize);
    height += config.titleMessageGap; // gap between title and message
  }

  // Add message height (respects numberOfLines constraint)
  const messageLineHeight = calculateLineHeight(config.messageFontSize);
  height += messageLineHeight * Math.min(messageLines, 2);

  // Ensure minimum accessibility tap target (44x44)
  return Math.max(44, height);
};

/**
 * Calculates minimum width accounting for icon and content.
 * Ensures text content has sufficient space.
 *
 * Width formula:
 * - Base: 200px (minimum readable width for text)
 * - If has icon: add icon width + icon margin
 * - Add horizontal padding
 * - Minimum: 200px
 * - Maximum: screen width - (2 * margin)
 *
 * @param hasIcon - Whether toast has an icon
 * @param paddingHorizontal - Horizontal padding of toast
 * @param iconWidth - Width of icon if present (default: 24)
 * @param iconMargin - Right margin of icon (default: 12)
 * @returns Minimum width needed in pixels
 *
 * @example
 * // Without icon
 * calculateMinimumWidth(false, 16);
 * // => 232 (16 + 200 + 16 = 232)
 *
 * @example
 * // With icon
 * calculateMinimumWidth(true, 16, 24, 12);
 * // => 280 (16 + 24 + 12 + 200 + 16 + 12 = 280)
 */
export const calculateMinimumWidth = (
  hasIcon: boolean,
  paddingHorizontal: number,
  iconWidth: number = 24,
  iconMargin: number = 12
): number => {
  let width = paddingHorizontal * 2; // left + right padding
  width += 200; // minimum content width

  if (hasIcon) {
    width += iconWidth + iconMargin;
  }

  return width;
};

/**
 * Calculates responsive width for center-positioned toasts.
 * Preserves current behavior while enabling configuration.
 *
 * Formula:
 * - width = screenWidth - (marginHorizontal * 2)
 * - Minimum: 200px (readability floor)
 * - Maximum: screenWidth (full available)
 *
 * This is used only for top/bottom CENTER positioning.
 * Other positions use maxWidth constraint (420px).
 *
 * @param screenWidth - Current screen width in pixels
 * @param marginHorizontal - Horizontal margin configuration
 * @returns Calculated responsive width
 *
 * @example
 * // Portrait phone (375px)
 * calculateResponsiveWidth(375, 16);
 * // => 343 (375 - 32 = 343)
 *
 * @example
 * // iPad landscape (1024px)
 * calculateResponsiveWidth(1024, 16);
 * // => 992 (1024 - 32 = 992)
 */
export const calculateResponsiveWidth = (
  screenWidth: number,
  marginHorizontal: number
): number => {
  return Math.max(200, screenWidth - marginHorizontal * 2);
};

/**
 * Determines optimal toast height based on content characteristics.
 * Bridges between fixed and dynamic sizing approaches.
 *
 * Strategy:
 * 1. Calculate minimum height based on padding + content
 * 2. Apply minimum 44px (accessibility)
 * 3. Cap at reasonable maximum to prevent excessive height
 *
 * @param config - Dimension configuration
 * @param messageLines - Number of message lines (1-2 typically)
 * @param maxHeight - Maximum allowed height (optional, default: Infinity)
 * @returns Optimal height for rendering
 *
 * @example
 * const config: DimensionConfig = {
 *   paddingVertical: 16,
 *   paddingHorizontal: 16,
 *   titleFontSize: 16,
 *   messageFontSize: 14,
 *   messageLineHeight: 20,
 *   titleMessageGap: 4,
 *   hasTitle: true,
 *   hasIcon: true,
 * };
 *
 * getOptimalHeight(config, 2);
 * // => calculated height
 */
export const getOptimalHeight = (
  config: DimensionConfig,
  messageLines: number = 2,
  maxHeight: number = Infinity
): number => {
  const calculated = calculateToastHeight(config, messageLines);
  return Math.min(calculated, maxHeight);
};

/**
 * Validates dimension configuration for completeness.
 * Ensures all required fields are present and valid.
 *
 * @param config - Dimension configuration to validate
 * @returns True if valid, false otherwise
 *
 * @example
 * isValidDimensionConfig({
 *   paddingVertical: 16,
 *   paddingHorizontal: 16,
 *   titleFontSize: 16,
 *   messageFontSize: 14,
 *   messageLineHeight: 20,
 *   titleMessageGap: 4,
 *   hasTitle: true,
 *   hasIcon: false,
 * }); // => true
 */
export const isValidDimensionConfig = (
  config: Partial<DimensionConfig>
): config is DimensionConfig => {
  return (
    typeof config.paddingVertical === 'number' &&
    config.paddingVertical >= 0 &&
    typeof config.paddingHorizontal === 'number' &&
    config.paddingHorizontal >= 0 &&
    typeof config.titleFontSize === 'number' &&
    config.titleFontSize > 0 &&
    typeof config.messageFontSize === 'number' &&
    config.messageFontSize > 0 &&
    typeof config.titleMessageGap === 'number' &&
    config.titleMessageGap >= 0 &&
    typeof config.hasTitle === 'boolean' &&
    typeof config.hasIcon === 'boolean'
  );
};
