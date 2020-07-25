import React from 'react';

import useKeyboard from '../../hooks/Keyboard';

import { Container, Text } from './styles';

const Toast: React.FC = () => {
  const [keyboardHeight] = useKeyboard();

  return (
    <Container bottom={keyboardHeight}>
      <Text>Hello</Text>
    </Container>
  );
};

export default Toast;
