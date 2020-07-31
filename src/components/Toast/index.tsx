import React, { useMemo } from 'react';
import { Platform } from 'react-native';
import { AnimatedValue } from 'react-spring/native';

import { Container, Title, Message } from './styles';

interface IToastComponent {
  message: IToastMessage;
  toastConfig: IConfig;
  keyboardHeight: number;
  removeToast: (id?: string) => void;
  style: AnimatedValue<any>;
}

const Toast: React.FC<IToastComponent> = (props) => {
  const {
    removeToast,
    keyboardHeight,
    message: { id, message, title, type },
    toastConfig: { font, bgColor },
    style,
  } = props;

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
      style={style}
    >
      {title && <Title fontFamilyBold={font?.fontFamilyBold}>{title}</Title>}
      <Message fontFamilyRegular={font?.fontFamilyRegular}>{message}</Message>
    </Container>
  );
};

export default Toast;
