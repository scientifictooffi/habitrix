import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import {
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  AuthError,
} from '../services/authService';

type Props = NativeStackScreenProps<RootStackParamList, 'EmailAuth'>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailAuthScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const isSignup = mode === 'signup';

  const goToDashboard = () => {
    navigation.reset({ index: 0, routes: [{ name: 'Dashboard' }] });
  };

  const validate = (): string | null => {
    if (!EMAIL_RE.test(email.trim())) {
      return 'Введи корректный email.';
    }
    if (password.length < 6) {
      return 'Пароль должен быть не короче 6 символов.';
    }
    return null;
  };

  const handleSubmit = async () => {
    if (busy) {
      return;
    }
    const validationError = validate();
    if (validationError) {
      Alert.alert('Проверь данные', validationError);
      return;
    }
    setBusy(true);
    try {
      if (isSignup) {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      // Session is set by the Firebase auth listener; just navigate.
      goToDashboard();
    } catch (err) {
      const message =
        err instanceof AuthError
          ? err.message
          : 'Не удалось выполнить вход. Попробуй ещё раз.';
      Alert.alert('Ошибка', message);
    } finally {
      setBusy(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!EMAIL_RE.test(email.trim())) {
      Alert.alert(
        'Забыли пароль?',
        'Введи свой email в поле выше, и мы отправим ссылку для сброса.',
      );
      return;
    }
    try {
      await resetPassword(email);
      Alert.alert(
        'Письмо отправлено',
        `Ссылка для сброса пароля отправлена на ${email.trim()}.`,
      );
    } catch (err) {
      const message =
        err instanceof AuthError ? err.message : 'Не удалось отправить письмо.';
      Alert.alert('Ошибка', message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.container,
          { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
        ]}
      >
        <View style={styles.topBar}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>‹</Text>
          </Pressable>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          <Text style={styles.title}>
            {isSignup ? 'Создать аккаунт' : 'Вход по email'}
          </Text>
          <Text style={styles.subtitle}>
            {isSignup
              ? 'Прогресс будет сохранён в твоём аккаунте'
              : 'Войди, чтобы вернуть свои привычки и серии'}
          </Text>

          <View style={styles.form}>
            {isSignup && (
              <TextInput
                style={styles.input}
                placeholder="Имя (необязательно)"
                placeholderTextColor="rgba(255,255,255,0.4)"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                returnKeyType="next"
                editable={!busy}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              autoCorrect={false}
              returnKeyType="next"
              editable={!busy}
            />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              editable={!busy}
            />

            {!isSignup && (
              <Pressable
                onPress={handleForgotPassword}
                style={styles.forgot}
                disabled={busy}
              >
                <Text style={styles.forgotText}>Забыли пароль?</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.primaryButton, busy && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={busy}
            >
              {busy ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text style={styles.primaryButtonText}>
                  {isSignup ? 'Зарегистрироваться' : 'Войти'}
                </Text>
              )}
            </Pressable>
          </View>

          <Pressable
            style={styles.toggle}
            onPress={() => setMode(isSignup ? 'signin' : 'signup')}
            disabled={busy}
          >
            <Text style={styles.toggleText}>
              {isSignup ? 'Уже есть аккаунт? ' : 'Нет аккаунта? '}
              <Text style={styles.toggleAccent}>
                {isSignup ? 'Войти' : 'Создать'}
              </Text>
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 22,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '600',
  },
  scroll: {
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 24,
  },
  form: {
    gap: 12,
  },
  input: {
    height: 52,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  forgot: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
  },
  forgotText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
  toggle: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleAccent: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
