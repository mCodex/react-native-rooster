import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { renderHook } from '@testing-library/react-hooks';

import ToastProvider from '../../../providers/ToastProvider';

import ToastContext from '../../../contexts/ToastContext';

import useToast from '../../../hooks/useToast';

import ToastContainer from '..';

const defaultConfig = {
  bgColor: {
    error: '#d92027',
    success: '#35d0ba',
    warning: '#ff9100',
    info: '#7890f0',
  },
};

describe('ToastContainer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should be able to render a toast on screen', () => {
    const messages = [
      {
        id: '1',
        type: 'success',
        message: 'Toast success message',
      },
    ];

    const { getByText } = render(
      <ToastContainer messages={messages} toastConfig={defaultConfig} />,
    );

    expect(getByText('Toast success message')).toBeTruthy();
  });

  it('should be able to render a toast on screen with title', () => {
    const messages = [
      {
        id: '1',
        title: 'My Title',
        message: 'Toast success message',
      },
    ];

    const { getByText } = render(
      <ToastContainer messages={messages} toastConfig={defaultConfig} />,
    );

    expect(getByText('My Title')).toBeTruthy();
    expect(getByText('Toast success message')).toBeTruthy();
  });

  it('should be able to automatically dismiss toast with setTimeout fn', () => {
    const messages = [
      {
        id: '1',
        message: 'Testing toast timeout',
      },
    ];

    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    const CustomProvider: React.FC = ({ children }) => (
      <ToastContext.Provider value={result.current}>
        {children}
      </ToastContext.Provider>
    );

    const { getByText } = render(
      <ToastContainer messages={messages} toastConfig={defaultConfig} />,
      {
        wrapper: CustomProvider,
      },
    );

    expect(setTimeout).toHaveBeenCalledTimes(4);
    setTimeout(() => {
      expect(getByText('Testing toast timeout')).toBeFalsy();
    }, 3000);

    jest.useFakeTimers();
  });

  it('should be able to render a toast on screen and close by clicking on it', async () => {
    const messages = [
      {
        id: '1',
        message: 'An error ocurred',
      },
    ];

    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    const removeToastHookSpy = jest
      .spyOn(result.current, 'removeToast')
      .mockImplementationOnce(() => jest.fn());

    const CustomProvider: React.FC = ({ children }) => (
      <ToastContext.Provider value={result.current}>
        {children}
      </ToastContext.Provider>
    );

    const { getByText } = render(
      <ToastContainer messages={messages} toastConfig={defaultConfig} />,
      {
        wrapper: CustomProvider,
      },
    );

    const toast = getByText('An error ocurred');

    expect(toast).toBeTruthy();

    fireEvent.press(toast);

    expect(removeToastHookSpy).toHaveBeenCalledTimes(1);
  });
});
