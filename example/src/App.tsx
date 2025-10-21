import React, { useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ToastProvider, useToast } from 'react-native-rooster';
import type { ToastType } from 'react-native-rooster';

type ButtonConfig = {
  label: string;
  type: ToastType;
  persistent?: boolean;
};

const BUTTONS: ButtonConfig[] = [
  { label: 'Success toast', type: 'success' },
  { label: 'Warning toast', type: 'warning' },
  { label: 'Info toast', type: 'info' },
  { label: 'Error toast', type: 'error' },
  { label: 'Persistent toast', type: 'info', persistent: true },
];

const ToastDemo: React.FC = () => {
  const { addToast } = useToast();

  const handlePress = useCallback(
    (config: ButtonConfig) => {
      if (config.persistent) {
        addToast({
          type: config.type,
          title: 'Pinned toast',
          message: 'Tap any toast to dismiss it manually.',
          duration: 0,
        });
        return;
      }

      addToast({
        type: config.type,
        title: config.type.toUpperCase(),
        message: 'Everything is fully customisable.',
      });
    },
    [addToast]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>React Native Rooster</Text>
      <View style={styles.buttons}>
        {BUTTONS.map((button) => (
          <TouchableOpacity
            key={button.label}
            accessibilityRole="button"
            style={styles.button}
            onPress={() => handlePress(button)}
          >
            <Text style={styles.buttonText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.helper}>Tap a button to trigger a toast.</Text>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <ToastDemo />
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  header: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  buttons: {
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#1f1f1f',
    marginBottom: 12,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  helper: {
    color: '#bbb',
    fontSize: 14,
  },
});
