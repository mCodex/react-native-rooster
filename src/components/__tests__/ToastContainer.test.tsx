import { render } from '@testing-library/react-native';

import toastStore from '../../store/toastStore';
import type { ToastConfig } from '../../types';
import ToastContainer from '../ToastContainer';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('../Toast', () => {
  const ReactNative = require('react-native');
  return ({ id }: { id: string }) => (
    <ReactNative.Text testID={`item-${id}`}>{id}</ReactNative.Text>
  );
});

const cfg: ToastConfig = {
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
};

describe('ToastContainer', () => {
  beforeEach(() => {
    toastStore.__resetForTests();
  });

  it('renders nothing when ids are empty', () => {
    const { queryByTestId } = render(
      <ToastContainer ids={[]} toastConfig={cfg} onRemove={() => undefined} />,
    );
    expect(queryByTestId('item-anything')).toBeNull();
  });

  it('renders one item per id', () => {
    const { queryByTestId } = render(
      <ToastContainer
        ids={['a', 'b', 'c']}
        toastConfig={cfg}
        onRemove={() => undefined}
      />,
    );
    expect(queryByTestId('item-a')).toBeTruthy();
    expect(queryByTestId('item-b')).toBeTruthy();
    expect(queryByTestId('item-c')).toBeTruthy();
  });

  it('reverses ids for bottom placement so newest is closest to the edge', () => {
    const { getAllByTestId } = render(
      <ToastContainer
        ids={['a', 'b']}
        toastConfig={{ ...cfg, placement: 'bottom' }}
        onRemove={() => undefined}
      />,
    );
    const all = getAllByTestId(/item-/);
    expect(all[0]?.props.testID).toBe('item-b');
  });
});
