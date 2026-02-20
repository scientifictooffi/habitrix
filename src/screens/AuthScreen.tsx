import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppleButton } from '@invertase/react-native-apple-authentication';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Сохрани прогресс</Text>
      <Text style={styles.subtitle}>
        Создай аккаунт, чтобы не потерять привычки
      </Text>

      {Platform.OS === 'ios' ? (
        <AppleButton
          buttonStyle={AppleButton.Style.WHITE}
          buttonType={AppleButton.Type.SIGN_IN}
          style={styles.appleButton}
          onPress={() => navigation.navigate('Dashboard')}
        />
      ) : (
        <Pressable style={[styles.button, styles.apple]}>
          <Text style={styles.appleText}>Continue with Apple</Text>
        </Pressable>
      )}

      <Pressable
        style={styles.googleButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Image
          source={require('../logo/Google_logo.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Sign in with Google</Text>
      </Pressable>

      <Pressable style={[styles.button, styles.email]}>
        <Text style={styles.emailText}>Continue with Email</Text>
      </Pressable>

      <Pressable
        style={styles.skipButton}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.skipText}>Пропустить</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    paddingHorizontal: 24,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F5F7FB',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#9AA4B2',
    marginBottom: 24,
  },
  button: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  apple: {
    backgroundColor: '#F5F7FB',
  },
  appleButton: {
    height: 52,
    width: '100%',
    marginBottom: 12,
  },
  appleText: {
    color: '#0B0F14',
    fontWeight: '700',
    fontSize: 16,
  },
  googleButton: {
    height: 52,
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // ✅ центрируем
    backgroundColor: '#131314',
    borderWidth: 1,
    borderColor: '#2A313C', // мягче цвет
    marginBottom: 12,
  },

  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleText: {
    color: '#E3E3E3',
    fontWeight: '600',
    fontSize: 16,
  },

  email: {
    backgroundColor: '#131314',
    borderWidth: 1,
    borderColor: '#2A313C',
  },
  emailText: {
    color: '#E3E3E3',
    fontWeight: '600',
    fontSize: 16,
  },
  skipButton: {
    marginTop: 'auto',
    alignItems: 'center',
  },
  skipText: {
    color: '#9AA4B2',
    fontSize: 14,
    fontWeight: '600',
  },
});
