import React from 'react';
import { render } from 'react-native-testing-library';

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

  // it('should be able to automatically dismiss toast with setTimeout fn', () => {
  //   const messages = [
  //     {
  //       id: '1',
  //       message: 'Testing toast timeout',
  //     },
  //   ];

  //   const { getByText } = render(
  //     <ToastContainer messages={messages} toastConfig={defaultConfig} />,
  //     {
  //       wrapper: ToastProvider,
  //     },
  //   );

  //   expect(setTimeout).toHaveBeenCalledTimes(1);
  //   expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 3000);
  //   setTimeout(() => {
  //     expect(getByText('Testing toast timeout')).toBeFalsy();
  //   }, 3000);
  //   jest.runAllTimers();
  // });

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
});
