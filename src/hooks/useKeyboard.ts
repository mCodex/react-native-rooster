import { useEffect, useState, useCallback } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';

const useKeyboard = (): [number] => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const onKeyboardDidShow = useCallback((e: KeyboardEvent): void => {
    setKeyboardHeight(e.endCoordinates.height + 20);
  }, []);

  const onKeyboardDidHide = useCallback((): void => {
    setKeyboardHeight(0);
  }, []);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return (): void => {
      Keyboard.removeAllListeners('keyboardDidShow');
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, []);

  return [keyboardHeight];
};

export default useKeyboard;
