import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCompletionsStore } from '../store/completionsStore';
import { useOnboardingStore } from '../store/onboardingStore';
import {getCurrentStreak, getDateKey,getWeekDateKeys,isDayComplete} from '../utils/streak.ts';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

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

  const completions = useCompletionsStore(s => s.completions);
  const toggleCompletion = useCompletionsStore(s => s.toggleCompletion);
  const isCompletedToday = useCompletionsStore(s => s.isCompletedToday);

  const selectedHabitEntries = selectedHabits
    .map(id => {
      const habit = habits.find(h => h.id === id);
      return habit ? { id, title: habit.title } : null;
    })
    .filter(Boolean) as { id: string; title: string }[];

  const todayKey = getDateKey(new Date());
  const weekDateKeys = getWeekDateKeys();
  const dayLabels = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
  const week = weekDateKeys.map((dateKey, i) => {
    const isToday = dateKey === todayKey;
    const complete = isDayComplete(dateKey, selectedHabits, completions);
    let status: 'done' | 'missed' | 'today' = isToday
      ? 'today'
      : complete
      ? 'done'
      : 'missed';
    return { label: dayLabels[i], status };
  });
  const currentStreak = getCurrentStreak(completions, selectedHabits, todayKey);

  const completedTodayCount = selectedHabits.filter(id =>
    isCompletedToday(id),
  ).length;
  const totalHabits = selectedHabitEntries.length;
  const toggleHabit = useOnboardingStore(state => state.toggleHabit);
  const addCustomHabit = useOnboardingStore(state => state.addCustomHabit);

  const [addHabitModalVisible, setAddHabitModalVisible] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

  const canAddMore = selectedHabits.length < 3;
  const availableHabits = habits.filter(h => !selectedHabits.includes(h.id));

  const openAddHabitModal = () => {
    setShowCustomForm(false);
    setCustomTitle('');
    setAddHabitModalVisible(true);
  };
  const closeAddHabitModal = () => {
    setAddHabitModalVisible(false);
    setShowCustomForm(false);
    setCustomTitle('');
  };
  const handleSelectHabit = (habitId: string) => {
    toggleHabit(habitId);
    closeAddHabitModal();
  };
  const handleAddCustomHabit = () => {
    const title = customTitle.trim();
    if (!title) return;
    addCustomHabit(title);
    closeAddHabitModal();
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.title}>Сегодня</Text>
          <Text style={styles.subtitle}>Твой план на день</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Stats')}
          style={styles.statsLink}
        >
          <Text style={styles.statsLinkText}>Статистика</Text>
        </Pressable>
      </View>

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
      {totalHabits > 0 && (
        <Text style={styles.progressText}>
          Выполнено {completedTodayCount} из {totalHabits}
        </Text>
      )}

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {selectedHabitEntries.length > 0 ? (
          selectedHabitEntries.map(({ id, title }) => (
            <View key={id} style={styles.habitCard}>
              <Text style={styles.habitTitle}>{title}</Text>
              <Pressable
                style={[
                  styles.doneButton,
                  isCompletedToday(id) && styles.doneButtonCompleted,
                ]}
                onPress={() => toggleCompletion(id)}
              >
                <Text style={styles.doneButtonText}>
                  {isCompletedToday(id) ? 'Выполнено' : 'Выполнено'}
                </Text>
              </Pressable>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>Пока нет выбранных привычек</Text>
        )}
      </ScrollView>

      <Pressable style={styles.addButton} onPress={openAddHabitModal}>
        <Text style={styles.addButtonText}>Добавить привычку</Text>
      </Pressable>

      <Modal visible={addHabitModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={closeAddHabitModal}>
          <Pressable
            style={styles.modalCard}
            onPress={e => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Добавить привычку</Text>

            {!showCustomForm ? (
              <>
                {availableHabits.length > 0 ? (
                  <ScrollView
                    style={styles.modalScroll}
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                  >
                    {availableHabits.map(habit => (
                      <Pressable
                        key={habit.id}
                        style={styles.modalHabitCard}
                        onPress={() => handleSelectHabit(habit.id)}
                      >
                        <Text style={styles.modalHabitTitle}>
                          {habit.title}
                        </Text>
                        <Text style={styles.modalHabitSubtitle}>
                          {habit.subtitle}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                ) : (
                  <Text style={styles.modalEmptyText}>
                    Все шаблонные привычки уже добавлены
                  </Text>
                )}
                <Pressable
                  style={styles.modalCustomButton}
                  onPress={() => setShowCustomForm(true)}
                >
                  <Text style={styles.addButtonText}>Добавить свою</Text>
                </Pressable>
              </>
            ) : (
              <>
                <TextInput
                  value={customTitle}
                  onChangeText={setCustomTitle}
                  placeholder="Например: Пробежка"
                  placeholderTextColor="#6B7483"
                  style={styles.modalInput}
                />
                <View style={styles.modalActions}>
                  <Pressable
                    style={styles.modalButton}
                    onPress={() => setShowCustomForm(false)}
                  >
                    <Text style={styles.modalButtonText}>Назад</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.modalButtonPrimary,
                      !customTitle.trim() && styles.modalButtonDisabled,
                    ]}
                    disabled={!customTitle.trim()}
                    onPress={handleAddCustomHabit}
                  >
                    <Text style={styles.modalButtonPrimaryText}>Добавить</Text>
                  </Pressable>
                </View>
              </>
            )}

            <Pressable
              style={styles.modalCloseButton}
              onPress={closeAddHabitModal}
            >
              <Text style={styles.modalButtonText}>Закрыть</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    paddingHorizontal: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  },
  statsLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statsLinkText: {
    color: '#7C5CFF',
    fontSize: 15,
    fontWeight: '600',
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
  doneButtonCompleted: {
    backgroundColor: '#2C3440',
    opacity: 0.9,
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
  progressText: {
    color: '#9AA4B2',
    fontSize: 13,
    marginBottom: 8,
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#141A22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C3440',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F5F7FB',
    marginBottom: 12,
  },
  modalScroll: {
    maxHeight: 220,
    marginBottom: 12,
  },
  modalHabitCard: {
    backgroundColor: '#0B0F14',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2C3440',
  },
  modalHabitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F7FB',
  },
  modalHabitSubtitle: {
    fontSize: 13,
    color: '#9AA4B2',
    marginTop: 2,
  },
  modalEmptyText: {
    color: '#9AA4B2',
    fontSize: 14,
    marginBottom: 12,
  },
  modalCustomButton: {
    borderWidth: 1,
    borderColor: '#2C3440',
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#0B0F14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C3440',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F5F7FB',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginBottom: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2C3440',
  },
  modalButtonText: {
    color: '#F5F7FB',
    fontWeight: '600',
  },
  modalButtonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#7C5CFF',
  },
  modalButtonPrimaryText: {
    color: '#0B0F14',
    fontWeight: '700',
  },
  modalButtonDisabled: {
    backgroundColor: '#2C3440',
  },
  modalCloseButton: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2C3440',
  },
});
