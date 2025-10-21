import React, { useImperativeHandle } from 'react';
import { render, act, waitFor } from '@testing-library/react-native';

import ToastProvider from '../providers/ToastProvider';
import useToast from '../hooks/useToast';
import type { ToastContextProps } from '../types';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../components/ToastContainer', () => {
  const ReactNative = require('react-native');
  const ReactModule = require('react');

  return ({
    messages,
  }: {
    messages: Array<{ id: string; title?: string; message: string }>;
  }) => (
    <ReactModule.Fragment>
      {messages.map((toast) => (
        <ReactModule.Fragment key={toast.id}>
          {toast.title ? (
            <ReactNative.Text>{toast.title}</ReactNative.Text>
          ) : null}
          <ReactNative.Text>{toast.message}</ReactNative.Text>
        </ReactModule.Fragment>
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

describe('ToastProvider integration', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('adds and removes a toast using the public API', async () => {
    const ref = React.createRef<HarnessHandle>();

    const { queryByText } = render(
      <ToastProvider>
        <Harness ref={ref} />
      </ToastProvider>
    );

    act(() => {
      ref.current?.addToast({ message: 'Hello world', title: 'Greeting' });
    });

    expect(queryByText('Greeting')).toBeTruthy();
    expect(queryByText('Hello world')).toBeTruthy();

    act(() => {
      ref.current?.removeToast();
    });

    await waitFor(() => expect(queryByText('Hello world')).toBeNull());
  });

  it('allows overriding config to keep a persistent toast', () => {
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

    act(() => {
      ref.current?.removeToast();
    });

    expect(queryByText('Persistent toast')).toBeNull();
  });
});
