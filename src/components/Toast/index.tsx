import React, { useCallback, useLayoutEffect, useMemo } from 'react';
import { Animated, Platform } from 'react-native';

import useToast from 'hooks/useToast';

import { Container, Title, Message } from './styles';

interface IToastComponent {
  message: IToastMessage;
  toastConfig: IConfig;
  keyboardHeight: number;
}

const Toast: React.FC<IToastComponent> = (props) => {
  const { removeToast } = useToast();

  const fadeInAnimation = useMemo(() => new Animated.Value(0), []);

  const {
    keyboardHeight,
    message: { id, message, title, type },
    toastConfig: { font, bgColor },
  } = props;

  useLayoutEffect(() => {
    Animated.timing(fadeInAnimation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [fadeInAnimation]);

  /**
   * @TODO find a better way to handle Toast's visibility when keyboard is opened.
   * On Android KeyboardAvoidingView works perfectly, but not on iOS.
   * On the other hand, the useKeyboard works perfectly on iOS, but not on Android which gives wrong calculation
   */

  const handleBottomPadding = useMemo(
    () => (Platform.OS === 'ios' ? keyboardHeight : 20),
    [keyboardHeight],
  );

  const handleTapToDismiss = useCallback(() => {
    removeToast(id);
  }, [removeToast, id]);

  return (
    <Container
      key={id}
      bottom={handleBottomPadding}
      type={type}
      bgColor={bgColor}
      onPress={handleTapToDismiss}
      style={{ opacity: fadeInAnimation }}
    >
      {title && <Title fontFamilyBold={font?.fontFamilyBold}>{title}</Title>}
      <Message fontFamilyRegular={font?.fontFamilyRegular}>{message}</Message>
    </Container>
  );
};

export default Toast;
