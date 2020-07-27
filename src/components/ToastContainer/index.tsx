import React, { useEffect, useMemo } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import useToast from 'hooks/useToast';
import useKeyboard from 'hooks/useKeyboard';

import { Container, Title, Message } from './styles';

interface IToastComponent {
  messages: IToastMessage[];
  toastConfig: IConfig;
}

const Toast: React.FC<IToastComponent> = (props) => {
  const { removeToast } = useToast();
  const [keyboardHeight] = useKeyboard();

  const {
    messages,
    toastConfig: { bgColor },
  } = props;

  useEffect(() => {
    messages.map(({ id }) => {
      const timer = setTimeout(() => removeToast(id), 3000);

      return () => {
        clearTimeout(timer);
      };
    });
  }, [messages, removeToast]);

  /**
   * @TODO find a better way to handle Toast's visibility when keyboard is opened.
   * On Android KeyboardAvoidingView works perfectly, but not on iOS.
   * On the other hand, the useKeyboard works perfectly on iOS, but not on Android which gives wrong calculation
   */
  const handleBottomPadding = useMemo(() => {
    return Platform.OS === 'ios' ? keyboardHeight : 20;
  }, [keyboardHeight]);

  return (
    <KeyboardAvoidingView>
      {messages.map(({ id, title, message, type }) => (
        <Container
          key={id}
          bottom={handleBottomPadding}
          type={type}
          bgColor={bgColor}
        >
          {title && <Title>{title}</Title>}
          <Message>{message}</Message>
        </Container>
      ))}
    </KeyboardAvoidingView>
  );
};

export default Toast;
