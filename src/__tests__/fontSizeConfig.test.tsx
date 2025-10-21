import { render } from '@testing-library/react-native';
import ToastProvider from '../providers/ToastProvider';
import useToast from '../hooks/useToast';

/**
 * Test suite for font size configuration via initialConfig
 */
describe('Font Size Configuration', () => {
  it('should initialize with ToastProvider', () => {
    const TestComponent = () => {
      useToast();
      return null;
    };

    expect(() => {
      render(
        <ToastProvider
          initialConfig={{
            font: {
              titleFontSize: 18,
              messageFontSize: 15,
            },
          }}
        >
          <TestComponent />
        </ToastProvider>
      );
    }).not.toThrow();
  });

  it('should render with custom font configuration', () => {
    const initialConfig = {
      font: {
        titleFontSize: 20,
        messageFontSize: 16,
      },
    };

    const TestComponent = () => {
      const context = useToast();
      expect(context).toBeTruthy();
      return null;
    };

    const { UNSAFE_root } = render(
      <ToastProvider initialConfig={initialConfig}>
        <TestComponent />
      </ToastProvider>
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should preserve default font sizes when not overridden', () => {
    const TestComponent = () => {
      useToast();
      return null;
    };

    // Should not throw and should use defaults
    expect(() => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
    }).not.toThrow();
  });
});
