import { act, render } from '@testing-library/react-native';
import { Text } from 'react-native';

import Toaster from '../../components/Toaster';
import toastStore from '../../store/toastStore';
import useToast from '../useToast';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../../components/ToastContainer', () => {
  const ReactNative = require('react-native');
  const _React = require('react');
  return ({ ids }: { ids: string[] }) => (
    <ReactNative.View testID="container">
      {ids.map((id: string) => (
        <ReactNative.Text key={id} testID={`toast-${id}`}>
          {id}
        </ReactNative.Text>
      ))}
    </ReactNative.View>
  );
});

const Probe = () => {
  const api = useToast();
  return (
    <Text testID="probe">
      {typeof api.addToast === 'function' ? 'ok' : 'no'}
    </Text>
  );
};

describe('useToast (providerless v4)', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    toastStore.__resetForTests();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('returns a stable singleton API without needing a provider', () => {
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('probe').children.join('')).toBe('ok');
  });

  it('addToast pushes a toast that the Toaster renders', () => {
    const { getByTestId, queryByTestId } = render(
      <>
        <Probe />
        <Toaster />
      </>,
    );

    expect(queryByTestId('container')).toBeNull();

    let id = '';
    act(() => {
      id = toastStore.add({ message: 'hi' });
    });
    // Microtask flush
    return Promise.resolve().then(() => {
      act(() => {
        jest.runOnlyPendingTimers();
      });
      expect(getByTestId(`toast-${id}`)).toBeTruthy();
    });
  });
});
