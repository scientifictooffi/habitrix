import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../store/onboardingStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingReminders'>;

const TIME_OPTIONS = ['08:00', '12:00', '18:00', '21:00'];

export default function OnboardingRemindersScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const reminderTime = useOnboardingStore(state => state.reminderTime);
  const reminderEnabled = useOnboardingStore(state => state.reminderEnabled);
  const setReminderTime = useOnboardingStore(state => state.setReminderTime);
  const setReminderEnabled = useOnboardingStore(
    state => state.setReminderEnabled,
  );

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

      <Text style={styles.title}>Когда напоминать?</Text>
      <Text style={styles.subtitle}>Можно изменить позже в настройках</Text>

      <View style={styles.timeBlock}>
        {TIME_OPTIONS.map(time => {
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
        <View>
          <Text style={styles.switchLabel}>Напоминания включены</Text>
          <Text style={styles.switchHint}>
            Лёгкий пинг, чтобы не забыть отметить
          </Text>
        </View>
        <Switch
          value={reminderEnabled}
          onValueChange={setReminderEnabled}
          trackColor={{ false: 'rgba(255,255,255,0.12)', true: '#FFFFFF' }}
          thumbColor={reminderEnabled ? '#000000' : '#888888'}
        />
      </View>

      <View style={{ flex: 1 }} />

      <Pressable
        style={styles.nextButton}
        onPress={() => navigation.navigate('Auth')}
      >
        <Text style={styles.nextButtonText}>Далее</Text>
      </Pressable>
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
    marginBottom: 22,
  },
  timeBlock: {
    gap: 10,
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
    marginTop: 22,
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
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
});
