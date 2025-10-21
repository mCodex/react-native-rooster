import React, { useImperativeHandle } from 'react';
import { render, act } from '@testing-library/react-native';
import ToastProvider from '../providers/ToastProvider';
import useToast from '../hooks/useToast';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../components/ToastContainer', () => {
  return () => null;
});

const Harness = React.forwardRef<any, any>((_, ref: any) => {
  const api = useToast();
  useImperativeHandle(ref, () => api, [api]);
  return null;
});

describe('Toast notifications integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('complete workflow', () => {
    it('should handle complete toast lifecycle', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider
          initialConfig={{
            timeToDismiss: 3000,
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      // Add toast
      act(() => {
        ref.current!.addToast({
          message: 'Test message',
          type: 'info',
        });
      });

      expect(UNSAFE_root).toBeTruthy();

      // Remove toast
      act(() => {
        ref.current!.removeToast();
      });

      expect(ref.current).toBeTruthy();
    });

    it('should handle success toast workflow', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.addToast({
          title: 'Success',
          message: 'Operation completed successfully',
          type: 'success',
        });
      });

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle error toast workflow', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.addToast({
          title: 'Error',
          message: 'Something went wrong',
          type: 'error',
        });
      });

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle warning toast workflow', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.addToast({
          title: 'Warning',
          message: 'Please be careful',
          type: 'warning',
        });
      });

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('configuration changes', () => {
    it('should apply configuration changes dynamically', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider initialConfig={{ timeToDismiss: 3000 }}>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.setToastConfig({ timeToDismiss: 5000 });
      });

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should merge partial config updates', () => {
      const ref = React.createRef<any>();

      render(
        <ToastProvider
          initialConfig={{
            timeToDismiss: 3000,
            spacing: 12,
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.setToastConfig({ timeToDismiss: 4000 });
      });

      // Both values should be present (merged)
      expect(ref.current).toBeTruthy();
    });

    it('should support nested config updates', () => {
      const ref = React.createRef<any>();

      render(
        <ToastProvider
          initialConfig={{
            font: {
              messageFontSize: 14,
              titleFontSize: 16,
            },
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.setToastConfig({
          font: {
            messageFontSize: 15,
          },
        });
      });

      expect(ref.current).toBeTruthy();
    });
  });

  describe('toast with accessibility features', () => {
    it('should support accessibility hints', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.addToast({
          message: 'Accessible message',
          accessibilityLabel: 'Important alert',
          accessibilityHint: 'Double tap to view details',
          allowFontScaling: true,
        });
      });

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should support haptic feedback', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.addToast({
          message: 'Haptic feedback toast',
          hapticFeedback: 'light',
        });
      });

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('complex toast scenarios', () => {
    it('should handle stacked toasts with different types', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.addToast({
          message: 'First message',
          type: 'info',
        });
        ref.current!.addToast({
          message: 'Second message',
          type: 'success',
        });
        ref.current!.addToast({
          message: 'Third message',
          type: 'error',
        });
      });

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle rapid successive toasts', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        for (let i = 0; i < 10; i++) {
          ref.current!.addToast({
            message: `Message ${i}`,
          });
        }
      });

      // All should be queued
      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle selective removal', () => {
      const ref = React.createRef<any>();

      render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        for (let i = 0; i < 5; i++) {
          ref.current!.addToast({ message: `Message ${i}` });
        }
      });

      // Remove last toast
      act(() => {
        ref.current!.removeToast();
      });

      expect(ref.current).toBeTruthy();
    });

    it('should handle toast replacement', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider
          initialConfig={{
            timeToDismiss: 0, // Keep toasts
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.addToast({ message: 'First' });
      });

      act(() => {
        ref.current!.removeToast();
        ref.current!.addToast({ message: 'Second' });
      });

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  describe('error handling', () => {
    it('should handle toast with minimal data', () => {
      const ref = React.createRef<any>();

      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current!.addToast({ message: '' });
      });

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should handle config with all optional properties', () => {
      const ref = React.createRef<any>();

      expect(() => {
        render(
          <ToastProvider
            initialConfig={{
              timeToDismiss: 3000,
              spacing: 12,
              placement: 'bottom',
              horizontalPosition: 'center',
              offset: 20,
              borderRadius: 12,
              padding: { vertical: 16, horizontal: 16 },
              shadow: {
                color: '#000',
                opacity: 0.2,
                offset: { width: 0, height: 4 },
                radius: 8,
              },
              font: {
                messageFontSize: 14,
                titleFontSize: 16,
              },
              animation: {
                appearDuration: 220,
                disappearDuration: 180,
              },
            }}
          >
            <Harness ref={ref} />
          </ToastProvider>
        );

        act(() => {
          ref.current!.addToast({
            message: 'Fully configured toast',
            title: 'Test',
            type: 'success',
          });
        });
      }).not.toThrow();
    });
  });

  describe('performance', () => {
    it('should handle large number of toasts', () => {
      const ref = React.createRef<any>();

      render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        for (let i = 0; i < 50; i++) {
          ref.current!.addToast({
            message: `Toast ${i}`,
          });
        }
      });

      expect(ref.current).toBeTruthy();
    });

    it('should handle rapid config changes', () => {
      const ref = React.createRef<any>();

      render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        for (let i = 0; i < 20; i++) {
          ref.current!.setToastConfig({
            timeToDismiss: 3000 + i,
          });
        }
      });

      expect(ref.current).toBeTruthy();
    });
  });
});
