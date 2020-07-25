import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ToastContainer } from 'react-native-rooster';
import HomeScreen from '../pages/Home';

const Stack = createStackNavigator();

const RootRoute: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export const App: React.FC = () => (
  <>
    <RootRoute />
    <ToastContainer />
  </>
);

export default App;
