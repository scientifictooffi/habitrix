import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOnboardingStore } from '../store/onboardingStore';

export default function DashboardScreen() {
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

  const selectedHabitTitles = selectedHabits
    .map(id => habits.find(h => h.id === id)?.title)
    .filter(Boolean);

  const currentStreak = 12;
  const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const todayIndex = (new Date().getDay() + 6) % 7;
  const week = dayLabels.map((label, i) => ({
    label,
    status: (i === todayIndex ? 'today' : i < todayIndex ? 'done' : 'missed') as
      | 'done'
      | 'missed'
      | 'today',
  }));

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <Text style={styles.title}>Сегодня</Text>
      <Text style={styles.subtitle}>Твой план на день</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Цель</Text>
        <Text style={styles.summaryValue}>{goalLabel}</Text>

        <Text style={[styles.summaryTitle, styles.sectionSpacing]}>
          Напоминания
        </Text>
        <Text style={styles.summaryValue}>
          {reminderEnabled ? reminderTime : 'выключены'}
        </Text>
      </View>
      <View style={styles.streakCard}>
        <Text style={styles.streakText}>🔥 {currentStreak} дней подряд</Text>

        <View style={styles.weekRow}>
          {week.map(day => (
            <View key={day.label} style={styles.weekDay}>
              <Text
                style={[
                  styles.weekLabel,
                  day.status === 'today' && styles.weekLabelToday,
                ]}
              >
                {day.label}
              </Text>
              <View
                style={[
                  styles.weekDot,
                  day.status === 'done' && styles.weekDotDone,
                  day.status === 'missed' && styles.weekDotMissed,
                  day.status === 'today' && styles.weekDotToday,
                ]}
              />
              {day.status === 'today' && (
                <Text style={styles.todayLabel}>Сегодня</Text>
              )}
            </View>
          ))}
        </View>
      </View>
      <Text style={styles.sectionTitle}>Привычки</Text>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedHabitTitles.length > 0 ? (
          selectedHabitTitles.map(title => (
            <View key={title as string} style={styles.habitCard}>
              <Text style={styles.habitTitle}>{title}</Text>
              <Pressable style={styles.doneButton}>
                <Text style={styles.doneButtonText}>Выполнено</Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Пока нет выбранных привычек</Text>
        )}
      </ScrollView>

      <Pressable style={styles.addButton}>
        <Text style={styles.addButtonText}>Добавить привычку</Text>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F5F7FB',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: '#9AA4B2',
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: '#141A22',
    borderWidth: 1,
    borderColor: '#2C3440',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  summaryTitle: {
    color: '#9AA4B2',
    fontSize: 13,
  },
  summaryValue: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionSpacing: {
    marginTop: 12,
  },
  sectionTitle: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
  },
  habitCard: {
    backgroundColor: '#141A22',
    borderWidth: 1,
    borderColor: '#2C3440',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  habitTitle: {
    color: '#F5F7FB',
    fontSize: 15,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#7C5CFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  doneButtonText: {
    color: '#0B0F14',
    fontWeight: '700',
    fontSize: 12,
  },
  emptyText: {
    color: '#9AA4B2',
    fontSize: 14,
  },
  addButton: {
    marginTop: 12,
    backgroundColor: '#141A22',
    borderWidth: 1,
    borderColor: '#2C3440',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#F5F7FB',
    fontWeight: '600',
    fontSize: 15,
  },
  streakCard: {
    backgroundColor: '#141A22',
    borderWidth: 1,
    borderColor: '#2C3440',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  streakText: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekDay: {
    alignItems: 'center',
    gap: 6,
  },
  weekLabel: {
    color: '#9AA4B2',
    fontSize: 12,
  },
  weekLabelToday: {
    color: '#BDAFFF',
    fontWeight: '600',
  },
  todayLabel: {
    fontSize: 9,
    color: '#9AA4B2',
    marginTop: 2,
  },
  weekDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2C3440',
  },
  weekDotDone: {
    backgroundColor: '#7C5CFF',
  },
  weekDotMissed: {
    backgroundColor: '#2C3440',
  },
  weekDotToday: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#7C5CFF',
    backgroundColor: 'rgba(124, 92, 255, 0.2)',
    shadowColor: '#7C5CFF',
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
});
