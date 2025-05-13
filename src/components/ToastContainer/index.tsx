import React, { useMemo } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import useKeyboard from 'hooks/useKeyboard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import the actual Toast component instead of self-import
import Toast from '../Toast';

interface IToastContainer {
  // messages may be missing or undefined at runtime
  messages?: IToastMessage[];
  toastConfig: IConfig;
}

// Provide a default empty array to avoid undefined
const ToastContainer: React.FC<IToastContainer> = (props) => {
  const { messages = [], toastConfig } = props;
  
  const [keyboardHeight] = useKeyboard();
  const insets = useSafeAreaInsets();

  // only move up for keyboard on iOS; on Android keep at safe area bottom
  const keyboardInset = Platform.OS === 'ios' ? keyboardHeight : 20;
  const bottomOffset = insets.bottom + keyboardInset;

  // memoize to avoid re-render flicker and ensure messages is an array
  const list = useMemo(
    () =>
      messages.map((msg, i) => (
        <Toast
          key={msg.id}
          message={msg}
          toastConfig={toastConfig}
          index={i}
          bottomOffset={bottomOffset}
        />
      )),
    [messages, toastConfig, bottomOffset]
  );

  if (!messages.length) return null;

  // Pass safe area inset to each toast; container itself is full-screen
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      {list}
    </View>
  );
};

export default ToastContainer;

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    pointerEvents: 'box-none',
  },
});