import { act, render } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import { Toaster, toast, useToast } from '..';
import toastStore from '../store/toastStore';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../components/ToastContainer', () => {
  const ReactNative = require('react-native');
  return ({ ids }: { ids: string[] }) => (
    <ReactNative.View testID="container">
      {ids.map((id: string) => {
        const message = require('../store/toastStore').default.getMessage(id);
        return (
          <ReactNative.Text key={id} testID={`toast-${id}`}>
            {message?.title ? `${message.title}: ` : ''}
            {message?.message ?? ''}
          </ReactNative.Text>
        );
      })}
    </ReactNative.View>
  );
});

const Trigger = ({ onPress }: { onPress: () => void }) => (
  <Pressable testID="trigger" onPress={onPress}>
    <Text>fire</Text>
  </Pressable>
);

describe('integration: providerless v4 API', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    toastStore.__resetForTests();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('useToast inside a component pushes a toast that the Toaster renders', async () => {
    const Demo = () => {
      const { addToast } = useToast();
      return (
        <Trigger
          onPress={() => addToast({ message: 'from-hook', type: 'info' })}
        />
      );
    };

    const { getByTestId, findByText } = render(
      <>
        <Demo />
        <Toaster />
      </>,
    );

    act(() => {
      getByTestId('trigger').props.onClick?.() ??
        getByTestId('trigger').props.onPress?.();
    });
    await Promise.resolve();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(await findByText('from-hook')).toBeTruthy();
  });

  it('imperative `toast.success` works outside of any component', async () => {
    const { findByText } = render(<Toaster />);
    act(() => {
      toast.success('saved');
    });
    await Promise.resolve();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    expect(await findByText('saved')).toBeTruthy();
  });

  it('configure() merges into the live config', () => {
    render(<Toaster />);
    act(() => {
      toast.configure({ timeToDismiss: 9999 });
    });
    expect(toastStore.getConfig().timeToDismiss).toBe(9999);
  });

  it('clear() removes all toasts', async () => {
    const { queryByTestId } = render(<Toaster />);
    let id = '';
    act(() => {
      id = toast.show({ message: 'a' });
      toast.show({ message: 'b' });
    });
    await Promise.resolve();
    act(() => {
      jest.runOnlyPendingTimers();
    });
    act(() => {
      toast.clear();
    });
    await Promise.resolve();
    expect(queryByTestId(`toast-${id}`)).toBeNull();
  });
});
