import { renderHook } from '@testing-library/react-native';
import useKeyboard from '../useKeyboard';

describe('useKeyboard hook', () => {
  it('should return keyboard height as array', () => {
    const { result } = renderHook(() => useKeyboard());
    expect(Array.isArray(result.current)).toBe(true);
  });

  it('should initialize with zero height', () => {
    const { result } = renderHook(() => useKeyboard());
    expect(result.current[0]).toBe(0);
  });

  it('should be renderable without errors', () => {
    expect(() => {
      renderHook(() => useKeyboard());
    }).not.toThrow();
  });

  it('should handle multiple renders', () => {
    const { rerender } = renderHook(() => useKeyboard());

    expect(() => {
      rerender({});
    }).not.toThrow();
  });

  it('should handle unmount', () => {
    const { unmount } = renderHook(() => useKeyboard());
    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it('should maintain hook state through rerenders', () => {
    const { result, rerender } = renderHook(() => useKeyboard());

    const initial = result.current;
    rerender({});
    const afterRerender = result.current;

    expect(Array.isArray(initial)).toBe(true);
    expect(Array.isArray(afterRerender)).toBe(true);
  });

  it('should work with multiple instances', () => {
    const { result: result1 } = renderHook(() => useKeyboard());
    const { result: result2 } = renderHook(() => useKeyboard());

    expect(Array.isArray(result1.current)).toBe(true);
    expect(Array.isArray(result2.current)).toBe(true);
    expect(result1.current[0]).toBe(0);
    expect(result2.current[0]).toBe(0);
  });

  it('should have keyboard height as numeric value', () => {
    const { result } = renderHook(() => useKeyboard());
    expect(Number.isFinite(result.current[0])).toBe(true);
  });
});
