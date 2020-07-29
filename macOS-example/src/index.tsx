import React from 'react';
import { ToastProvider } from 'react-native-rooster';

import Home from './pages/Home';

const ProviderHOC: React.FC = ({ children }) => (
  <ToastProvider>{children}</ToastProvider>
);

const Root: React.FC = () => (
  <ProviderHOC>
    <Home />
  </ProviderHOC>
);

export default Root;
