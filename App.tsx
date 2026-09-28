import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useSessionStore } from './src/store/sessionStore';
import { useReminderScheduler } from './src/hooks/useReminderScheduler';
import { useFirebaseAuthSync } from './src/hooks/useFirebaseAuthSync';
import { useCloudSync } from './src/hooks/useCloudSync';
import { useTeamProgressPublisher } from './src/hooks/useTeamProgressPublisher';
import { configureGoogleSignin } from './src/services/authService';

configureGoogleSignin();

const NavTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: '#000000',
    card: '#000000',
    text: '#FFFFFF',
    border: 'rgba(255,255,255,0.08)',
    primary: '#FFFFFF',
  },
};

export default function App() {
  const [ready, setReady] = useState(() =>
    useSessionStore.persist.hasHydrated(),
  );

  useReminderScheduler();
  useFirebaseAuthSync();
  useCloudSync();
  useTeamProgressPublisher();

  useEffect(() => {
    const markReady = () => setReady(true);

    const unsub = useSessionStore.persist.onFinishHydration(markReady);

    // Hydration may finish before this effect runs — onFinishHydration won't fire again.
    if (useSessionStore.persist.hasHydrated()) {
      markReady();
    }

    const fallback = setTimeout(markReady, 2500);

    return () => {
      unsub();
      clearTimeout(fallback);
    };
  }, []);

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <ActivityIndicator color="#FFFFFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: '#000000' }}>
        <NavigationContainer theme={NavTheme}>
          <StatusBar barStyle="light-content" backgroundColor="#000000" />
          <AppNavigator />
        </NavigationContainer>
      </View>
    </SafeAreaProvider>
  );
}
