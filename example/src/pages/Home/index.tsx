import React from 'react';

import { Container, Label, TextInput } from './styles';

const Home: React.FC = () => {
  return (
    <Container>
      <Label>Type something here with keyboard open:</Label>
      <TextInput />
    </Container>
  );
};

export default Home;
