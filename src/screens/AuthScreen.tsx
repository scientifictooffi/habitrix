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
import { useOnboardingStore } from '../store/onboardingStore';

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
    productivity: 'Продуктивность',
    discipline: 'Дисциплина',
  };

  const goalLabel = goal ? GOAL_LABELS[goal] ?? goal : '—';

  const selectedHabitItems = selectedHabits
    .map(id => habits.find(h => h.id === id))
    .filter(Boolean) as { title: string; icon: string }[];

  return (
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

      <Text style={styles.title}>Сохрани прогресс</Text>
      <Text style={styles.subtitle}>
        Войди, чтобы привычки и серии не потерялись
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Твой план</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Цель</Text>
          <Text style={styles.summaryValue}>{goalLabel}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.summaryLabel}>Привычки</Text>
        {selectedHabitItems.length > 0 ? (
          <View style={styles.habitsList}>
            {selectedHabitItems.map(h => (
              <View key={h.title} style={styles.habitChip}>
                <Text style={styles.habitChipIcon}>{h.icon}</Text>
                <Text style={styles.habitChipText}>{h.title}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.summaryValue}>—</Text>
        )}

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Напоминания</Text>
          <Text style={styles.summaryValue}>
            {reminderEnabled ? reminderTime : 'выключены'}
          </Text>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View style={styles.buttons}>
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
          >
            <Text style={styles.appleText}>Продолжить с Apple</Text>
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
          <Text style={styles.googleText}>Продолжить с Google</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.email]}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.emailText}>Продолжить по email</Text>
        </Pressable>

        <Pressable
          style={styles.skipButton}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <Text style={styles.skipText}>Пропустить</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 18,
  },
  summaryCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 16,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  summaryValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: 10,
  },
  habitsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  habitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  habitChipIcon: {
    fontSize: 13,
  },
  habitChipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  buttons: {
    gap: 10,
  },
  button: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  apple: {
    backgroundColor: '#FFFFFF',
  },
  appleButton: {
    height: 52,
    width: '100%',
  },
  appleText: {
    color: '#000000',
    fontWeight: '700',
    fontSize: 16,
  },
  googleButton: {
    height: 52,
    width: '100%',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  email: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  emailText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  skipButton: {
    marginTop: 4,
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
});
