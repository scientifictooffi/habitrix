import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { useOnboardingStore } from '../store/onboardingStore.ts';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

export default function AuthScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const goal = useOnboardingStore(state => state.goal);
  const habits = useOnboardingStore(state => state.habits);
  const selectedHabits = useOnboardingStore(state => state.selectedHabits);
  const reminderTime = useOnboardingStore(state => state.reminderTime);
  const reminderEnabled = useOnboardingStore(state => state.reminderEnabled);

  const GOAL_LABELS: Record<string, string> = {
    health: 'Здоровье',
    productivity: 'продуктивность',
    discipline: 'дисциплина',
  };

  const goalLabel = goal ? GOAL_LABELS[goal] ?? goal : '—';

  const selectedHabitTitles = selectedHabits
    .map(id => habits.find(h => h.id === id)?.title)
    .filter(Boolean);

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
        <Pressable
          style={[styles.button, styles.apple]}
          onPress={() => navigation.navigate('Dashboard')}
        ></Pressable>
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

      <Pressable
        style={[styles.button, styles.email]}
        onPress={() => navigation.navigate('Dashboard')}
      >
        <Text style={styles.emailText}>Continue with Email</Text>
      </Pressable>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Твой план</Text>

        <Text style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Цель: </Text>
          <Text style={styles.summaryValue}>{goalLabel}</Text>
        </Text>

        <Text style={styles.summaryLabel}>Привычки:</Text>
        {selectedHabitTitles.length > 0 ? (
          selectedHabitTitles.map(title => (
            <Text key={title} style={styles.habitItem}>
              • {title}
            </Text>
          ))
        ) : (
          <Text style={styles.summaryValue}>—</Text>
        )}

        <Text style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Напоминания: </Text>
          <Text style={styles.summaryValue}>
            {reminderEnabled ? reminderTime : 'выключены'}
          </Text>
        </Text>
      </View>

      <Text style={styles.summaryNote}>
        Мы сохраним это в аккаунте, чтобы ты не потерял прогресс.
      </Text>
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
  summaryCard: {
    marginTop: 16,
    backgroundColor: '#141A22',
    borderWidth: 1,
    borderColor: '#2C3440',
    borderRadius: 14,
    padding: 14,
  },
  summaryTitle: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryRow: {
    marginTop: 6,
  },
  summaryLabel: {
    color: '#9AA4B2',
    fontSize: 14,
  },
  summaryValue: {
    color: '#F5F7FB',
    fontSize: 14,
    fontWeight: '600',
  },
  habitItem: {
    color: '#F5F7FB',
    fontSize: 14,
    marginTop: 4,
  },
  summaryNote: {
    marginTop: 10,
    color: '#9AA4B2',
    fontSize: 13,
  },
});
