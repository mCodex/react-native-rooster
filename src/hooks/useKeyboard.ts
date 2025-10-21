import { useCallback, useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';
import type { KeyboardEvent } from 'react-native';

/**
 * Tracks the visible keyboard height to avoid covering bottom-aligned toasts.
 * The hook returns a single value wrapped in an array to preserve the legacy signature.
 */
const useKeyboard = (): [number] => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const handleKeyboardShow = useCallback((event: KeyboardEvent) => {
    const height = event.endCoordinates?.height ?? 0;
    setKeyboardHeight(height);
  }, []);

  const handleKeyboardHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, handleKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, handleKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [handleKeyboardShow, handleKeyboardHide]);

  return [keyboardHeight];
};

export default useKeyboard;
