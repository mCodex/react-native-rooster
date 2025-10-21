import React, { useCallback, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ToastProvider, useToast } from 'react-native-rooster';
import type { ToastType } from 'react-native-rooster';

type ButtonConfig = {
  label: string;
  type: ToastType;
  persistent?: boolean;
  customFontSize?: boolean;
};

type ToggleOption<T> = {
  label: string;
  value: T;
};

const BUTTONS: ButtonConfig[] = [
  { label: 'Success toast', type: 'success' },
  { label: 'Warning toast', type: 'warning' },
  { label: 'Info toast', type: 'info' },
  { label: 'Error toast', type: 'error' },
  { label: 'Large Font Toast', type: 'success', customFontSize: true },
  { label: 'Persistent toast', type: 'info', persistent: true },
];

const VERTICAL_OPTIONS: ToggleOption<'top' | 'bottom'>[] = [
  { label: 'Top', value: 'top' },
  { label: 'Bottom', value: 'bottom' },
];

const HORIZONTAL_OPTIONS: ToggleOption<'left' | 'center' | 'right'>[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

const ToastDemo: React.FC = () => {
  const { addToast, setToastConfig } = useToast();
  const { width } = useWindowDimensions();
  const isWide = width >= 768;
  const [verticalPosition, setVerticalPosition] = useState<'top' | 'bottom'>(
    'bottom'
  );
  const [horizontalPosition, setHorizontalPosition] = useState<
    'left' | 'center' | 'right'
  >('center');

  const updatePosition = useCallback(
    (
      nextVertical: 'top' | 'bottom',
      nextHorizontal: 'left' | 'center' | 'right'
    ) => {
      setToastConfig({
        position: {
          vertical: nextVertical,
          horizontal: nextHorizontal,
        },
      });
    },
    [setToastConfig]
  );

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

      if (config.customFontSize) {
        addToast({
          type: config.type,
          title: 'Custom Font Sizes',
          message: 'This toast uses larger fonts for emphasis.',
          titleFontSize: 20,
          messageFontSize: 18,
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

  const handleVerticalChange = useCallback(
    (option: ToggleOption<'top' | 'bottom'>) => {
      setVerticalPosition(option.value);
      updatePosition(option.value, horizontalPosition);
    },
    [horizontalPosition, updatePosition]
  );

  const handleHorizontalChange = useCallback(
    (option: ToggleOption<'left' | 'center' | 'right'>) => {
      setHorizontalPosition(option.value);
      updatePosition(verticalPosition, option.value);
    },
    [updatePosition, verticalPosition]
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

          <View style={styles.settingsGroup}>
            <Text style={styles.settingsLabel}>Vertical placement</Text>
            <View style={styles.toggleRow}>
              {VERTICAL_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.toggle,
                    option.value === verticalPosition && styles.toggleActive,
                    pressed && styles.togglePressed,
                  ]}
                  onPress={() => handleVerticalChange(option)}
                >
                  <Text style={styles.toggleText}>{option.label}</Text>
                </Pressable>
              ))}
            </View>

            <Text style={styles.settingsLabel}>Horizontal alignment</Text>
            <View style={styles.toggleRow}>
              {HORIZONTAL_OPTIONS.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  style={({ pressed }) => [
                    styles.toggle,
                    option.value === horizontalPosition && styles.toggleActive,
                    pressed && styles.togglePressed,
                  ]}
                  onPress={() => handleHorizontalChange(option)}
                >
                  <Text style={styles.toggleText}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

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

          <View style={styles.tipBanner}>
            <Text style={styles.tipEmoji}>🎨</Text>
            <Text style={styles.tipText}>
              Try the "Large Font Toast" button to see per-toast font size
              customization!
            </Text>
          </View>
        </View>

        <Text style={styles.helper}>Tap any button to trigger a toast.</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

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
  settingsGroup: {
    gap: 12,
  },
  settingsLabel: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggle: {
    flex: 1,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#202020',
  },
  toggleActive: {
    backgroundColor: '#4338ca',
    borderColor: '#6366f1',
  },
  togglePressed: {
    opacity: 0.85,
  },
  toggleText: {
    color: '#f9fafb',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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

const App: React.FC = () => (
  <ToastProvider
    initialConfig={{
      font: {
        // Customize font sizes globally (optional)
        titleFontSize: 17,
        messageFontSize: 14,
      },
    }}
  >
    <ToastDemo />
  </ToastProvider>
);

export default App;
