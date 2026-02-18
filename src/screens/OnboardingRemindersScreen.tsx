import React from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingReminders'>;

const TIME_OPTIONS = ['08:00', '12:00', '18:00', '21:00'];

export default function OnboardingRemindersScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [selectedTime, setSelectedTime] = React.useState('08:00');
  const [isEnabled, setIsEnabled] = React.useState(true);

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

      <Text style={styles.title}>Выбери время напоминания</Text>
      <Text style={styles.subtitle}>Можно изменить позже</Text>

      <View style={styles.timeBlock}>
        {TIME_OPTIONS.map(time => {
          const isSelected = selectedTime === time;
          return (
            <Pressable
              key={time}
              onPress={() => setSelectedTime(time)}
              style={[
                styles.timeButton,
                isSelected && styles.timeButtonSelected,
                !isEnabled && styles.timeButtonDisabled,
              ]}
              disabled={!isEnabled}
            >
              <Text
                style={[
                  styles.timeText,
                  isSelected && styles.timeTextSelected,
                  !isEnabled && styles.timeTextDisabled,
                ]}
              >
                {time}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Напоминания включены</Text>
        <Switch value={isEnabled} onValueChange={setIsEnabled} />
      </View>

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
    marginBottom: 20,
  },
  timeBlock: {
    gap: 10,
  },
  timeButton: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#2C3440',
    backgroundColor: '#141A22',
  },
  timeButtonSelected: {
    borderColor: '#7C5CFF',
    backgroundColor: 'rgba(124, 92, 255, 0.12)',
  },
  timeButtonDisabled: {
    opacity: 0.5,
  },
  timeText: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '600',
  },
  timeTextSelected: {
    color: '#F5F7FB',
  },
  timeTextDisabled: {
    color: '#9AA4B2',
  },
  switchRow: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    color: '#F5F7FB',
    fontSize: 15,
  },
  nextButton: {
    marginTop: 'auto',
    backgroundColor: '#7C5CFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
});