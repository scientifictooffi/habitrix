/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#0B0F14" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const bottomInset = Math.max(safeAreaInsets.bottom, 16);

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: safeAreaInsets.top + 12,
          paddingBottom: bottomInset + 12,
        },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Text style={styles.logo}>Habitrix</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>AI</Text>
          </View>
        </View>
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>Build better habits with AI insights</Text>
        <Text style={styles.subtitle}>
          Set up in under a minute. Stay consistent with streaks and weekly
          feedback.
        </Text>
        <View style={styles.points}>
          <Text style={styles.point}>• 60-second onboarding</Text>
          <Text style={styles.point}>• Simple daily tracking</Text>
          <Text style={styles.point}>• Weekly AI insights</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          style={[styles.button, styles.primaryButton]}
        >
          <Text style={styles.primaryText}>Get started</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.button, styles.secondaryButton]}
        >
          <Text style={styles.secondaryText}>I already have an account</Text>
        </Pressable>
        <Text style={styles.legal}>
          By continuing you agree to our Terms & Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'flex-start',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F5F7FB',
    letterSpacing: 0.5,
  },
  badge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    backgroundColor: 'rgba(124, 92, 255, 0.2)',
    borderWidth: 1,
    borderColor: '#7C5CFF',
  },
  badgeText: {
    color: '#BDAFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  hero: {
    marginTop: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F5F7FB',
    lineHeight: 40,
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    color: '#B8C0CC',
    lineHeight: 24,
  },
  points: {
    marginTop: 20,
  },
  point: {
    fontSize: 15,
    color: '#D5DBE6',
    lineHeight: 24,
  },
  actions: {
    marginTop: 32,
  },
  button: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#7C5CFF',
  },
  primaryText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: '#2C3440',
    backgroundColor: '#141A22',
  },
  secondaryText: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '600',
  },
  legal: {
    marginTop: 12,
    fontSize: 12,
    color: '#778192',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default App;
