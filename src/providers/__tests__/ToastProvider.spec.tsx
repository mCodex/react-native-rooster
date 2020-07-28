import React from 'react';
import { waitFor } from 'react-native-testing-library';
import { renderHook, act } from '@testing-library/react-hooks';

import ToastProvider from '../ToastProvider';

import useToast from '../../hooks/useToast';

describe('ToastProvider', () => {
  it('should be able to add a toast using addToast', async () => {
    const setState = jest.fn();

    const useStateMock: any = (initState: any) => [initState, setState];

    jest.spyOn(React, 'useState').mockImplementation(useStateMock);

    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    await waitFor(() => {
      result.current.addToast({
        title: 'hello',
        message: 'New Message',
      });
    });

    // should write the assertions
  });

  it("should be able to change toast's global config", () => {
    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.setToastConfig({
        bgColor: {
          success: 'olive',
        },
      });
    });

    // should write the assertions
  });
});
