import React from 'react';
import { render, act } from '@testing-library/react-native';
import useToast from '../useToast';
import ToastProvider from '../../providers/ToastProvider';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../components/ToastContainer', () => {
  return () => null;
});

describe('useToast hook', () => {
  it('should throw error when used outside of ToastProvider', () => {
    let caughtError: Error | null = null;

    const TestComponent = () => {
      try {
        useToast();
      } catch (error: any) {
        caughtError = error;
      }
      return null;
    };

    render(<TestComponent />);

    expect(caughtError).toBeTruthy();
    expect((caughtError as any)?.message).toContain(
      'useToast must be used within a ToastProvider'
    );
  });

  it('should return toast context when used within provider', () => {
    const TestComponent = () => {
      const context = useToast();

      expect(context).toBeDefined();
      expect(typeof context.addToast).toBe('function');
      expect(typeof context.removeToast).toBe('function');
      expect(typeof context.setToastConfig).toBe('function');

      return null;
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
  });

  it('should provide addToast function', () => {
    const TestComponent = () => {
      const { addToast } = useToast();

      act(() => {
        addToast({ message: 'Test message' });
      });

      return null;
    };

    expect(() => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
    }).not.toThrow();
  });

  it('should provide removeToast function', () => {
    const TestComponent = () => {
      const { removeToast } = useToast();

      act(() => {
        removeToast();
      });

      return null;
    };

    expect(() => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
    }).not.toThrow();
  });

  it('should provide setToastConfig function', () => {
    const TestComponent = () => {
      const { setToastConfig } = useToast();

      act(() => {
        setToastConfig({ timeToDismiss: 5000 });
      });

      return null;
    };

    expect(() => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );
    }).not.toThrow();
  });

  it('should maintain consistent context reference', () => {
    let firstContext: any;
    let secondContext: any;

    const TestComponent = () => {
      const context = useToast();

      if (!firstContext) {
        firstContext = context;
      } else if (!secondContext) {
        secondContext = context;
      }

      return null;
    };

    render(
      <ToastProvider>
        <TestComponent />
        <TestComponent />
      </ToastProvider>
    );

    // Both should reference the same context object
    expect(firstContext).toBe(secondContext);
  });
});
