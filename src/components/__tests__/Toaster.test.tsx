import { act, render } from '@testing-library/react-native';
import toastStore from '../../store/toastStore';
import Toaster from '../Toaster';

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../ToastContainer', () => {
  const ReactNative = require('react-native');
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

describe('Toaster', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    toastStore.__resetForTests();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders nothing when no toasts are present (lazy mount)', () => {
    const { queryByTestId } = render(<Toaster />);
    expect(queryByTestId('container')).toBeNull();
  });

  it('renders the container after the first toast is added', async () => {
    const { findByTestId } = render(<Toaster />);
    await act(async () => {
      toastStore.add({ message: 'hello' });
    });
    expect(await findByTestId('container')).toBeTruthy();
  });

  it('applies the config prop into the store on mount', () => {
    render(<Toaster config={{ timeToDismiss: 7777 }} />);
    expect(toastStore.getConfig().timeToDismiss).toBe(7777);
  });

  it('warns when more than one Toaster is mounted', () => {
    const warn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);
    render(<Toaster />);
    render(<Toaster />);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('More than one <Toaster /> is mounted'),
    );
    warn.mockRestore();
  });
});
