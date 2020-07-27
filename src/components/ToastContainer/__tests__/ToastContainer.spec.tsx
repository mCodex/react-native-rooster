import React from 'react';
import { render } from 'react-native-testing-library';

import ToastContainer from '..';

describe('ToastContainer', () => {
  it('should be able to render a toast on screen', () => {
    const messages = [
      {
        id: '1',
        message: 'Toast success message',
      },
    ];

    const defaultConfig = {
      bgColor: {
        error: '#d92027',
        success: '#35d0ba',
        warning: '#ff9100',
        info: '#7890f0',
      },
    };

    const { getByText } = render(
      <ToastContainer messages={messages} toastConfig={defaultConfig} />,
    );

    expect(getByText('Toast success message')).toBeTruthy();
  });
});
