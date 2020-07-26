import React, { useEffect } from 'react';

import useKeyboard from 'hooks/useKeyboard';
import useToast from 'hooks/useToast';

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
    toastConfig: { colors },
  } = props;

  useEffect(() => {
    messages.map(({ id }) => {
      const timer = setTimeout(() => removeToast(id), 3000);

      return () => {
        clearTimeout(timer);
      };
    });
  }, [messages, removeToast]);

  return (
    <>
      {messages.map(({ id, title, message, type }) => (
        <Container key={id} bottom={keyboardHeight} type={type} colors={colors}>
          {title && <Title>{title}</Title>}
          <Message>{message}</Message>
        </Container>
      ))}
    </>
  );
};

export default Toast;
