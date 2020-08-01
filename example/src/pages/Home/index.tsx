import React, { useCallback } from 'react';
import { useToast } from 'react-native-rooster';

import { Button } from 'react-native';
import { Container, Label, TextInput } from './styles';

const Home: React.FC = () => {
  const { addToast, removeToast, setToastConfig } = useToast();

  const handleShowToastOnPress = useCallback(
    (type?: string) => {
      addToast({
        type,
        title: 'Error',
        message: 'An error ocurred',
      });
    },
    [addToast],
  );

  const handleChangeSuccessColorToOliveOnPress = useCallback(() => {
    setToastConfig({
      bgColor: {
        success: 'olive',
      },
    });
  }, [setToastConfig]);

  const handleChangeFontFamilyOnPress = useCallback(() => {
    setToastConfig({
      font: {
        fontFamilyRegular: 'SpectralSC-Regular',
        fontFamilyBold: 'SpectralSC-Bold',
      },
    });
  }, [setToastConfig]);

  const handleRemoveToastOnPress = useCallback(() => {
    removeToast();
  }, [removeToast]);

  return (
    <Container>
      <Label>Open a toast with keyboard opened:</Label>
      <TextInput />
      <Button
        title="Show Default Toast"
        onPress={() => handleShowToastOnPress()}
      />
      <Button
        title="Show Error Toast"
        onPress={() => handleShowToastOnPress('error')}
      />
      <Button
        title="Show Success Toast"
        onPress={() => handleShowToastOnPress('success')}
      />
      <Button
        title="Show Warning Toast"
        onPress={() => handleShowToastOnPress('warning')}
      />

      <Button
        title="Set toast's success color to olive"
        onPress={handleChangeSuccessColorToOliveOnPress}
      />

      <Button
        title="Change font family to SpectralSC"
        onPress={handleChangeFontFamilyOnPress}
      />
      <Button title="Remove Last Toast" onPress={handleRemoveToastOnPress} />
    </Container>
  );
};

export default Home;
