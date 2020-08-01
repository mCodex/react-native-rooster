import React, { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';

import useToast from 'hooks/useToast';

import { Container, Title, Message, ProgressBar } from './styles';

interface IToastComponent {
  message: IToastMessage;
  toastConfig: IConfig;
  keyboardHeight: number;
  style: any;
}

const Toast: React.FC<IToastComponent> = (props) => {
  const { removeToast } = useToast();

  const {
    keyboardHeight,
    message: { id, message, title, type },
    toastConfig: { font, bgColor },
    style: { life, ...otherStyles },
  } = props;

  /**
   * @TODO find a better way to handle Toast's visibility when keyboard is opened.
   * On Android KeyboardAvoidingView works perfectly, but not on iOS.
   * On the other hand, the useKeyboard works perfectly on iOS, but not on Android which gives wrong calculation
   */

  const handleBottomPadding = useMemo(() => {
    return Platform.OS === 'ios' ? keyboardHeight : 20;
  }, [keyboardHeight]);

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
      style={otherStyles}
    >
      {title && <Title fontFamilyBold={font?.fontFamilyBold}>{title}</Title>}
      <Message fontFamilyRegular={font?.fontFamilyRegular}>{message}</Message>
      <ProgressBar style={{ right: life }} />
    </Container>
  );
};

export default Toast;
