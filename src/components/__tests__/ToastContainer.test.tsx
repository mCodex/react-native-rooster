import { render, act } from '@testing-library/react-native';
import ToastContainer from '../ToastContainer';
import type { ToastMessage, ToastConfig } from '../../types';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../Toast', () => {
  return () => null;
});

describe('ToastContainer component', () => {
  const defaultConfig: ToastConfig = {
    bgColor: {
      error: '#d92027',
      success: '#35d0ba',
      warning: '#ff9100',
      info: '#7890f0',
    },
    timeToDismiss: 3000,
    spacing: 12,
    placement: 'bottom',
    horizontalPosition: 'center',
    offset: 20,
    borderRadius: 12,
    padding: { vertical: 16, horizontal: 16 },
  };

  const mockOnRemove = jest.fn();

  it('should render with no toasts', () => {
    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[]}
        toastConfig={defaultConfig}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with single toast', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test toast',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={defaultConfig}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with multiple toasts', () => {
    const messages: ToastMessage[] = [
      { id: '1', message: 'Toast 1', type: 'info' },
      { id: '2', message: 'Toast 2', type: 'success' },
      { id: '3', message: 'Toast 3', type: 'error' },
    ];

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={messages}
        toastConfig={defaultConfig}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with custom spacing', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          spacing: 20,
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with top placement', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          placement: 'top',
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with bottom placement', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          placement: 'bottom',
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with left alignment', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          horizontalPosition: 'left',
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with right alignment', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          horizontalPosition: 'right',
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with center alignment', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          horizontalPosition: 'center',
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with custom offset', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          offset: 40,
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with margin horizontal', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Test',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          marginHorizontal: 24,
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with all toast types', () => {
    const messages: ToastMessage[] = [
      { id: '1', message: 'Info', type: 'info' },
      { id: '2', message: 'Success', type: 'success' },
      { id: '3', message: 'Warning', type: 'warning' },
      { id: '4', message: 'Error', type: 'error' },
    ];

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={messages}
        toastConfig={defaultConfig}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with accessibility config', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Accessible toast',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          accessibility: {
            allowFontScaling: true,
            messageMaxLines: 2,
          },
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with shadow config', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Shadow toast',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          shadow: {
            color: '#000',
            opacity: 0.3,
            offset: { width: 0, height: 4 },
            radius: 8,
          },
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle rapid message updates', () => {
    const { rerender } = render(
      <ToastContainer
        messages={[]}
        toastConfig={defaultConfig}
        onRemove={mockOnRemove}
      />
    );

    act(() => {
      rerender(
        <ToastContainer
          messages={[{ id: '1', message: 'New', type: 'info' }]}
          toastConfig={defaultConfig}
          onRemove={mockOnRemove}
        />
      );
    });

    act(() => {
      rerender(
        <ToastContainer
          messages={[
            { id: '1', message: 'New', type: 'info' },
            { id: '2', message: 'Another', type: 'success' },
          ]}
          toastConfig={defaultConfig}
          onRemove={mockOnRemove}
        />
      );
    });

    act(() => {
      rerender(
        <ToastContainer
          messages={[]}
          toastConfig={defaultConfig}
          onRemove={mockOnRemove}
        />
      );
    });

    expect(mockOnRemove).not.toHaveBeenCalled();
  });

  it('should render with custom toast style', () => {
    const message: ToastMessage = {
      id: '1',
      message: 'Styled',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[message]}
        toastConfig={{
          ...defaultConfig,
          toastStyle: { opacity: 0.9 },
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with renderToast override', () => {
    const messageToast: ToastMessage = {
      id: '1',
      message: 'Custom',
      type: 'info',
    };

    const { UNSAFE_root } = render(
      <ToastContainer
        messages={[messageToast]}
        toastConfig={{
          ...defaultConfig,
          renderToast: ({ message: _msg, defaultToast }) => defaultToast,
        }}
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });
});
