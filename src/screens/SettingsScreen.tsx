import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { REMINDER_TIME_OPTIONS } from '../constants/reminders';
import { useOnboardingStore } from '../store/onboardingStore';
import { useSessionStore } from '../store/sessionStore';
import { useCompletionsStore } from '../store/completionsStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();

  const reminderTime = useOnboardingStore(s => s.reminderTime);
  const reminderEnabled = useOnboardingStore(s => s.reminderEnabled);
  const setReminderTime = useOnboardingStore(s => s.setReminderTime);
  const setReminderEnabled = useOnboardingStore(s => s.setReminderEnabled);
  const resetOnboarding = useOnboardingStore(s => s.resetOnboarding);

  const isAuthenticated = useSessionStore(s => s.isAuthenticated);
  const userId = useSessionStore(s => s.userId);
  const signOut = useSessionStore(s => s.signOut);
  const leaveApp = useSessionStore(s => s.leaveApp);

  const resetCompletions = useCompletionsStore(s => s.resetCompletions);

  const handleStartOver = () => {
    Alert.alert(
      'Начать заново?',
      'Сбросятся цель, привычки и прогресс. Это нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Сбросить',
          style: 'destructive',
          onPress: () => {
            resetOnboarding();
            resetCompletions();
            leaveApp();
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Value' }],
              }),
            );
          },
        },
      ],
    );
  };

  const handleSignOut = () => {
    Alert.alert('Выйти из аккаунта?', undefined, [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.header}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Настройки</Text>
          <Text style={styles.subtitle}>Напоминания и приложение</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Напоминания</Text>
        <Text style={styles.sectionHint}>
          Лёгкий пинг, чтобы не забыть отметить привычки
        </Text>

        <View style={styles.timeBlock}>
          {REMINDER_TIME_OPTIONS.map(time => {
            const isSelected = reminderTime === time;
            return (
              <Pressable
                key={time}
                onPress={() => setReminderTime(time)}
                style={[
                  styles.timeButton,
                  isSelected && styles.timeButtonSelected,
                  !reminderEnabled && styles.timeButtonDisabled,
                ]}
                disabled={!reminderEnabled}
              >
                <Text
                  style={[
                    styles.timeText,
                    isSelected && styles.timeTextSelected,
                    !reminderEnabled && styles.timeTextDisabled,
                  ]}
                >
                  {time}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.switchRow}>
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text style={styles.switchLabel}>Напоминания включены</Text>
            <Text style={styles.switchHint}>
              Push подключим в следующем обновлении
            </Text>
          </View>
          <Switch
            value={reminderEnabled}
            onValueChange={setReminderEnabled}
            trackColor={{ false: 'rgba(255,255,255,0.12)', true: '#FFFFFF' }}
            thumbColor={reminderEnabled ? '#000000' : '#888888'}
          />
        </View>

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Аккаунт
        </Text>
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>Статус</Text>
          <Text style={styles.infoValue}>
            {isAuthenticated
              ? `Вошли (${userId ?? 'аккаунт'})`
              : 'Гость — прогресс только на этом устройстве'}
          </Text>
        </View>

        {isAuthenticated && (
          <Pressable style={styles.secondaryButton} onPress={handleSignOut}>
            <Text style={styles.secondaryButtonText}>Выйти из аккаунта</Text>
          </Pressable>
        )}

        <Text style={[styles.sectionTitle, styles.sectionTitleSpaced]}>
          Данные
        </Text>
        <Pressable style={styles.dangerButton} onPress={handleStartOver}>
          <Text style={styles.dangerButtonText}>Начать заново</Text>
        </Pressable>
        <Text style={styles.dangerHint}>
          Сбросит онбординг, привычки и историю отметок
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  backButton: {
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
    fontWeight: '600',
    lineHeight: 22,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  scrollContent: {
    paddingBottom: 32,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  sectionTitleSpaced: {
    marginTop: 28,
  },
  sectionHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    marginBottom: 14,
    lineHeight: 20,
  },
  timeBlock: {
    gap: 10,
    marginBottom: 14,
  },
  timeButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  timeButtonSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  timeButtonDisabled: {
    opacity: 0.4,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timeTextSelected: {
    color: '#FFFFFF',
  },
  timeTextDisabled: {
    color: 'rgba(255,255,255,0.55)',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  switchLabel: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  switchHint: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginBottom: 4,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  secondaryButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  dangerButton: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.45)',
    backgroundColor: 'rgba(255,80,80,0.08)',
  },
  dangerButtonText: {
    color: '#FF6B6B',
    fontSize: 15,
    fontWeight: '700',
  },
  dangerHint: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 18,
  },
});
