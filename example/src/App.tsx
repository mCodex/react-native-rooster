import React, { useCallback } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { ToastProvider, useToast } from 'react-native-rooster';
import type { ToastType } from 'react-native-rooster';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const { width } = useWindowDimensions();
  const isWide = width >= 768;

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
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isWide && styles.scrollContentWide,
        ]}
      >
        <View style={[styles.hero, isWide && styles.heroWide]}>
          <Text style={styles.eyebrow}>Instant feedback</Text>
          <Text style={styles.header}>React Native Rooster</Text>
          <Text style={styles.subtitle}>
            Delight your users with polished toast notifications. One provider,
            one hook, endless customisation.
          </Text>
        </View>

        <View style={[styles.panel, isWide && styles.panelWide]}>
          <Text style={styles.panelTitle}>Try it now</Text>
          <Text style={styles.panelSubtitle}>
            Trigger different variants to see Rooster in action.
          </Text>

          <View style={[styles.buttonGroup, isWide && styles.buttonGroupWide]}>
            {BUTTONS.map((button) => (
              <Pressable
                key={button.label}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}
                android_ripple={{ color: 'rgba(255,255,255,0.05)' }}
                onPress={() => handlePress(button)}
              >
                <Text style={styles.buttonText}>{button.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.tipBanner}>
            <Text style={styles.tipEmoji}>💡</Text>
            <Text style={styles.tipText}>
              Toasts stack automatically, respect safe areas, and avoid the
              keyboard when needed.
            </Text>
          </View>
        </View>

        <Text style={styles.helper}>Tap any button to trigger a toast.</Text>
      </ScrollView>
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
  screen: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 24,
  },
  scrollContentWide: {
    paddingVertical: 48,
  },
  hero: {
    width: '100%',
    maxWidth: 520,
    alignItems: 'center',
    gap: 12,
  },
  heroWide: {
    maxWidth: 640,
  },
  eyebrow: {
    color: '#a5b4fc',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  header: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    color: '#d1d5db',
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  panel: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 16 },
    elevation: 12,
  },
  panelWide: {
    maxWidth: 640,
  },
  panelTitle: {
    color: '#f9fafb',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  panelSubtitle: {
    color: '#9ca3af',
    fontSize: 15,
    textAlign: 'center',
  },
  buttonGroup: {
    gap: 12,
  },
  buttonGroupWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 10,
    backgroundColor: '#272727',
    paddingVertical: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  buttonPressed: {
    backgroundColor: '#2f2f2f',
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#111827',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(147, 197, 253, 0.25)',
    gap: 12,
  },
  tipEmoji: {
    fontSize: 20,
  },
  tipText: {
    flex: 1,
    color: '#e5e7eb',
    fontSize: 14,
    lineHeight: 20,
  },
  helper: {
    color: '#bbb',
    fontSize: 14,
    textAlign: 'center',
  },
});
