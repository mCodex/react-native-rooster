import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Platform } from 'react-native';

import useToast from 'hooks/useToast';
import useKeyboard from 'hooks/useKeyboard';

import { Container, Title, Message } from './styles';

interface IToastComponent {
  message: IToastMessage;
  toastConfig: IConfig;
}

const Toast: React.FC<IToastComponent> = (props) => {
  const { removeToast } = useToast();
  const [keyboardHeight] = useKeyboard();

  const { current: fadeAnim } = useRef(new Animated.Value(0));

  const {
    message: { id, message, title, type },
    toastConfig: { font, bgColor },
  } = props;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      // easing: Easing.bounce,
      useNativeDriver: false,
    }).start();

    return () => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 0,
        // easing: Easing.bounce,
        useNativeDriver: false,
      }).start();
    };
  }, [fadeAnim]);

  /**
   * @TODO find a better way to handle Toast's visibility when keyboard is opened.
   * On Android KeyboardAvoidingView works perfectly, but not on iOS.
   * On the other hand, the useKeyboard works perfectly on iOS, but not on Android which gives wrong calculation
   */
  const handleBottomPadding = useMemo(() => {
    return Platform.OS === 'ios' ? keyboardHeight : 20;
  }, [keyboardHeight]);

  return (
    <Container
      key={id}
      bottom={handleBottomPadding}
      type={type}
      bgColor={bgColor}
      onPress={() => removeToast(id)}
      style={{
        opacity: fadeAnim,
      }}
    >
      {title && <Title fontFamilyBold={font?.fontFamilyBold}>{title}</Title>}
      <Message fontFamilyRegular={font?.fontFamilyRegular}>{message}</Message>
    </Container>
  );
};

export default Toast;
