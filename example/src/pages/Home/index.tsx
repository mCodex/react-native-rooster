import React, { useCallback } from 'react';
import { useToast } from 'react-native-rooster';

import { Button } from 'react-native';
import { Container, Label, TextInput } from './styles';

const Home: React.FC = () => {
  const { addToast, removeToast } = useToast();

  const handleShowToastOnPress = useCallback(() => {
    addToast({
      type: 'error',
      title: 'Error',
      message: 'An error ocurred',
    });
  }, [addToast]);

  const handleRemoveToastOnPress = useCallback(() => {
    removeToast();
  }, [removeToast]);

  return (
    <Container>
      <Label>Type something here with keyboard open:</Label>
      <TextInput />
      <Button title="Show Toast" onPress={handleShowToastOnPress} />
      <Button title="Remove Last Toast" onPress={handleRemoveToastOnPress} />
    </Container>
  );
};

export default Home;
