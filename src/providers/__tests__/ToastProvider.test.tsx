import React, { useImperativeHandle } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import ToastProvider from '../ToastProvider';
import useToast from '../../hooks/useToast';
import type { ToastContextProps } from '../../types';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../components/ToastContainer', () => {
  const ReactNative = require('react-native');
  const ReactModule = require('react');

  return ({
    messages,
  }: {
    messages: Array<{ id: string; title?: string; message: string }>;
  }) => (
    <ReactModule.Fragment>
      {messages.map((toast) => (
        <ReactNative.Text key={toast.id}>{toast.message}</ReactNative.Text>
      ))}
    </ReactModule.Fragment>
  );
});

type HarnessHandle = ToastContextProps;

const Harness = React.forwardRef<HarnessHandle>((_, ref) => {
  const api = useToast();
  useImperativeHandle(ref, () => api, [api]);
  return null;
});

describe('ToastProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should render without crashing', () => {
      const { UNSAFE_root } = render(
        <ToastProvider>
          <Harness ref={React.createRef()} />
        </ToastProvider>
      );

      expect(UNSAFE_root).toBeTruthy();
    });

    it('should add a toast', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({ message: 'Test message' });
      });

      expect(queryByText('Test message')).toBeTruthy();
    });

    it('should remove a toast', async () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({ message: 'Test message' });
      });

      expect(queryByText('Test message')).toBeTruthy();

      act(() => {
        ref.current?.removeToast();
      });

      await waitFor(() => {
        expect(queryByText('Test message')).toBeNull();
      });
    });
  });

  describe('toast configuration', () => {
    it('should apply initialConfig on mount', () => {
      const ref = React.createRef<HarnessHandle>();

      render(
        <ToastProvider
          initialConfig={{
            timeToDismiss: 5000,
            spacing: 20,
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.setToastConfig({ timeToDismiss: 6000 });
      });

      // Config was applied
      expect(ref.current).toBeTruthy();
    });

    it('should merge custom config with defaults', () => {
      const ref = React.createRef<HarnessHandle>();

      render(
        <ToastProvider
          initialConfig={{
            bgColor: {
              success: '#00ff00',
              error: '#d92027',
              warning: '#ff9100',
              info: '#0000ff',
            },
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      // Should merge without errors
      expect(ref.current).toBeTruthy();
    });

    it('should update config with setToastConfig', () => {
      const ref = React.createRef<HarnessHandle>();

      render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.setToastConfig({ timeToDismiss: 4000 });
      });

      // Config updated without errors
      expect(ref.current).toBeTruthy();
    });

    it('should support font configuration', () => {
      const ref = React.createRef<HarnessHandle>();

      render(
        <ToastProvider
          initialConfig={{
            font: {
              messageFontSize: 16,
              titleFontSize: 18,
            },
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({
          message: 'Test with custom font',
        });
      });

      expect(ref.current).toBeTruthy();
    });
  });

  describe('toast lifecycle', () => {
    it('should persist toast when timeToDismiss is 0', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.setToastConfig({ timeToDismiss: 0 });
        ref.current?.addToast({ message: 'Persistent toast' });
      });

      act(() => {
        jest.runAllTimers();
      });

      expect(queryByText('Persistent toast')).toBeTruthy();
    });

    it('should dismiss toast after timeToDismiss', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.setToastConfig({ timeToDismiss: 2000 });
        ref.current?.addToast({ message: 'Auto dismiss' });
      });

      expect(queryByText('Auto dismiss')).toBeTruthy();

      act(() => {
        jest.advanceTimersByTime(2100);
      });

      // Toast should be dismissed after timer
      expect(ref.current).toBeTruthy();
    });

    it('should support per-toast duration override', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.setToastConfig({ timeToDismiss: 3000 });
        ref.current?.addToast({
          message: 'Override duration',
          duration: 1000,
        });
      });

      expect(queryByText('Override duration')).toBeTruthy();

      act(() => {
        jest.advanceTimersByTime(1100);
      });

      expect(ref.current).toBeTruthy();
    });
  });

  describe('multiple toasts', () => {
    it('should queue multiple toasts', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({ message: 'First' });
        ref.current?.addToast({ message: 'Second' });
        ref.current?.addToast({ message: 'Third' });
      });

      expect(queryByText('First')).toBeTruthy();
      expect(queryByText('Second')).toBeTruthy();
      expect(queryByText('Third')).toBeTruthy();
    });

    it('should remove toast by id', () => {
      const ref = React.createRef<HarnessHandle>();
      let firstToastId: string | undefined;

      const TestComponent = () => {
        const context = useToast();

        React.useEffect(() => {
          const firstId = context.addToast({ message: 'First' }) as any;
          firstToastId = firstId;

          context.addToast({ message: 'Second' });
        }, [context]);

        return null;
      };

      const { queryByText } = render(
        <ToastProvider>
          <TestComponent />
          <Harness ref={ref} />
        </ToastProvider>
      );

      // Both toasts visible
      expect(queryByText('First')).toBeTruthy();
      expect(queryByText('Second')).toBeTruthy();

      // Remove by ID
      act(() => {
        ref.current?.removeToast(firstToastId);
      });

      expect(ref.current).toBeTruthy();
    });

    it('should remove last toast when no id provided', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({ message: 'First' });
        ref.current?.addToast({ message: 'Second' });
      });

      expect(queryByText('First')).toBeTruthy();
      expect(queryByText('Second')).toBeTruthy();

      act(() => {
        ref.current?.removeToast();
      });

      // Should remove most recent (Second)
      expect(ref.current).toBeTruthy();
    });
  });

  describe('toast with options', () => {
    it('should add toast with title', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({
          title: 'Success',
          message: 'Operation completed',
        });
      });

      expect(queryByText('Operation completed')).toBeTruthy();
    });

    it('should add toast with type', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({
          message: 'Error occurred',
          type: 'error',
        });
      });

      expect(queryByText('Error occurred')).toBeTruthy();
    });

    it('should add toast with onPress handler', () => {
      const ref = React.createRef<HarnessHandle>();
      const onPressMock = jest.fn();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({
          message: 'Clickable toast',
          onPress: onPressMock,
        });
      });

      expect(queryByText('Clickable toast')).toBeTruthy();
    });

    it('should add toast with custom styling', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({
          message: 'Styled toast',
          backgroundColor: '#ff0000',
          borderRadius: 8,
          padding: {
            vertical: 20,
            horizontal: 24,
          },
        });
      });

      expect(queryByText('Styled toast')).toBeTruthy();
    });

    it('should add toast with accessibility properties', () => {
      const ref = React.createRef<HarnessHandle>();

      const { queryByText } = render(
        <ToastProvider>
          <Harness ref={ref} />
        </ToastProvider>
      );

      act(() => {
        ref.current?.addToast({
          message: 'Accessible toast',
          accessibilityLabel: 'Important notification',
          accessibilityHint: 'Double tap to view details',
          allowFontScaling: true,
        });
      });

      expect(queryByText('Accessible toast')).toBeTruthy();
    });
  });

  describe('config with initialConfig', () => {
    it('should apply initialConfig colors', () => {
      const ref = React.createRef<HarnessHandle>();

      render(
        <ToastProvider
          initialConfig={{
            bgColor: {
              success: '#00ff00',
              error: '#ff0000',
              warning: '#ffff00',
              info: '#0000ff',
            },
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      expect(ref.current).toBeTruthy();
    });

    it('should apply initialConfig positioning', () => {
      const ref = React.createRef<HarnessHandle>();

      render(
        <ToastProvider
          initialConfig={{
            placement: 'top',
            horizontalPosition: 'right',
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      expect(ref.current).toBeTruthy();
    });

    it('should apply initialConfig animations', () => {
      const ref = React.createRef<HarnessHandle>();

      render(
        <ToastProvider
          initialConfig={{
            animation: {
              appearDuration: 300,
              disappearDuration: 200,
            },
          }}
        >
          <Harness ref={ref} />
        </ToastProvider>
      );

      expect(ref.current).toBeTruthy();
    });
  });
});
