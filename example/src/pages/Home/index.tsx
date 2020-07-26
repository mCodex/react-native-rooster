import React, { useEffect } from 'react';
import { useToast } from 'react-native-rooster';

import { Container, Label, TextInput } from './styles';

const Home: React.FC = () => {
  const { addToast } = useToast();

  useEffect(() => {
    addToast({
      type: 'error',
      title: 'Error',
      message: 'An error ocurred',
    });
  }, [addToast]);

  return (
    <Container>
      <Label>Type something here with keyboard open:</Label>
      <TextInput />
    </Container>
  );
};

export default Home;
