import React, { useEffect } from 'react';

import useKeyboard from 'hooks/useKeyboard';
import useToast from 'hooks/useToast';

import { Container, Title, Message } from './styles';

interface IToastComponent {
  messages: IToastMessage[];
}

const Toast: React.FC<IToastComponent> = (props) => {
  const { removeToast } = useToast();
  const [keyboardHeight] = useKeyboard();

  const { messages } = props;

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
      {messages.map(({ id, title, message }) => (
        <Container key={id} bottom={keyboardHeight}>
          {title && <Title>{title}</Title>}
          <Message>{message}</Message>
        </Container>
      ))}
    </>
  );
};

export default Toast;
