import { render } from '@testing-library/react-native';

import toastStore from '../../store/toastStore';
import type { ToastConfig } from '../../types';
import ToastItem from '../Toast';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../hooks/useToastAnimation', () => {
  const { Animated } = require('react-native');
  return () => ({
    opacity: new Animated.Value(1),
    translateY: new Animated.Value(0),
    translateX: new Animated.Value(0),
    dismiss: () => undefined,
    pauseAutoDismiss: () => undefined,
    resumeAutoDismiss: () => undefined,
  });
});

const baseConfig: ToastConfig = {
  bgColor: {
    error: '#d92027',
    success: '#35d0ba',
    warning: '#ff9100',
    info: '#7890f0',
  },
  timeToDismiss: 3000,
  borderRadius: 12,
  padding: { vertical: 16, horizontal: 16 },
  font: { messageFontSize: 14, titleFontSize: 16 },
};

describe('ToastItem', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    toastStore.__resetForTests();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders a toast subscribed to the store by id', () => {
    const id = toastStore.add({ message: 'Hello world', type: 'info' });
    const { queryByText } = render(
      <ToastItem
        id={id}
        index={0}
        config={baseConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={() => undefined}
      />,
    );
    expect(queryByText('Hello world')).toBeTruthy();
  });

  it('returns null when the message is not in the store', () => {
    const { queryByText } = render(
      <ToastItem
        id="missing"
        index={0}
        config={baseConfig}
        placement="bottom"
        horizontalPosition="center"
        onRemove={() => undefined}
      />,
    );
    expect(queryByText('Hello world')).toBeNull();
  });

  it('renders title when provided', () => {
    const id = toastStore.add({
      title: 'Heads up',
      message: 'something happened',
      type: 'warning',
    });
    const { queryByText } = render(
      <ToastItem
        id={id}
        index={0}
        config={baseConfig}
        placement="top"
        horizontalPosition="center"
        onRemove={() => undefined}
      />,
    );
    expect(queryByText('Heads up')).toBeTruthy();
    expect(queryByText('something happened')).toBeTruthy();
  });
});
