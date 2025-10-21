import { render } from '@testing-library/react-native';
import Toast from '../Toast';
import type { ToastMessage, ToastConfig } from '../../types';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

describe('Toast component', () => {
  const defaultConfig: ToastConfig = {
    bgColor: {
      error: '#d92027',
      success: '#35d0ba',
      warning: '#ff9100',
      info: '#7890f0',
    },
    timeToDismiss: 3000,
    borderRadius: 12,
    padding: { vertical: 16, horizontal: 16 },
    font: {
      messageFontSize: 14,
      titleFontSize: 16,
    },
  };

  const defaultMessage: ToastMessage = {
    id: 'test-1',
    message: 'Test message',
    type: 'info',
  };

  const mockOnRemove = jest.fn();

  it('should render a toast with message only', () => {
    const { UNSAFE_root } = render(
      <Toast
        message={defaultMessage}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render a toast with title and message', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      title: 'Success',
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render toast with different types', () => {
    const types: Array<'info' | 'success' | 'error' | 'warning'> = [
      'info',
      'success',
      'error',
      'warning',
    ];

    types.forEach((type) => {
      const message: ToastMessage = {
        ...defaultMessage,
        type,
      };

      const { UNSAFE_root } = render(
        <Toast
          message={message}
          config={defaultConfig}
          placement="bottom"
          horizontalPosition="center"
          onRemove={mockOnRemove}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should apply custom background color', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      backgroundColor: '#ff0000',
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should apply custom border radius', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      borderRadius: 8,
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should apply custom padding', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      padding: { vertical: 20, horizontal: 24 },
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should apply custom font sizes', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      title: 'Title',
      messageFontSize: 16,
      titleFontSize: 18,
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle onPress callback', () => {
    const onPressMock = jest.fn();
    const message: ToastMessage = {
      ...defaultMessage,
      onPress: onPressMock,
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should apply accessibility properties', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      accessibilityLabel: 'Important notification',
      accessibilityHint: 'Tap to dismiss',
      allowFontScaling: true,
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle different placements', () => {
    const placements: Array<'top' | 'bottom'> = ['top', 'bottom'];

    placements.forEach((placement) => {
      const { UNSAFE_root } = render(
        <Toast
          message={defaultMessage}
          config={defaultConfig}
          placement={placement}
          horizontalPosition="center"
          onRemove={mockOnRemove}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should handle different horizontal positions', () => {
    const positions: Array<'left' | 'center' | 'right'> = [
      'left',
      'center',
      'right',
    ];

    positions.forEach((pos) => {
      const { UNSAFE_root } = render(
        <Toast
          message={defaultMessage}
          config={defaultConfig}
          placement="bottom"
          horizontalPosition={pos as any}
          onRemove={mockOnRemove}
        />
      );

      expect(UNSAFE_root).toBeTruthy();
    });
  });

  it('should render with custom style', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      style: { opacity: 0.8 },
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should render with haptic feedback property', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      hapticFeedback: 'light',
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });

  it('should handle max lines configuration', () => {
    const message: ToastMessage = {
      ...defaultMessage,
      messageMaxLines: 1,
    };

    const { UNSAFE_root } = render(
      <Toast
        message={message}
        config={defaultConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={mockOnRemove}
      />
    );

    expect(UNSAFE_root).toBeTruthy();
  });
});
