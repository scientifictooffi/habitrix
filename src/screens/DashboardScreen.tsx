import React, { useMemo, useState } from 'react';
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
import {
  getCurrentStreak,
  getDateKey,
  getWeekDateKeys,
} from '../utils/streak';
import HabitCard from '../components/HabitCard';

export default function DashboardScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  const habits = useOnboardingStore(state => state.habits);
  const selectedHabits = useOnboardingStore(state => state.selectedHabits);
  const toggleHabit = useOnboardingStore(state => state.toggleHabit);
  const addCustomHabit = useOnboardingStore(state => state.addCustomHabit);

  const completions = useCompletionsStore(s => s.completions);
  const toggleCompletion = useCompletionsStore(s => s.toggleCompletion);
  const isCompletedToday = useCompletionsStore(s => s.isCompletedToday);

  const todayKey = getDateKey(new Date());
  const weekKeys = useMemo(() => getWeekDateKeys(), []);

  const selectedHabitEntries = selectedHabits
    .map(id => habits.find(h => h.id === id))
    .filter(Boolean) as ReturnType<typeof habits.filter>;

  const featured = selectedHabitEntries[0];
  const rest = selectedHabitEntries.slice(1);

  const [addHabitModalVisible, setAddHabitModalVisible] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);

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

  const buildWeek = (habitId: string): boolean[] =>
    weekKeys.map(k => (completions[k] ?? []).includes(habitId));

  const streakFor = (habitId: string) =>
    getCurrentStreak(completions, [habitId], todayKey);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <View style={styles.brandDot} />
          <Text style={styles.brandText}>HABITRIX</Text>
        </View>

        <View style={styles.titleRow}>
          <Text style={styles.title}>Наши привычки</Text>
          <View style={styles.headerActions}>
            <Pressable
              onPress={() => navigation.navigate('Feed')}
              style={styles.iconBtn}
            >
              <Text style={styles.iconBtnText}>♡</Text>
            </Pressable>
            <Pressable onPress={openAddHabitModal} style={styles.iconBtn}>
              <Text style={styles.iconBtnText}>+</Text>
            </Pressable>
          </View>
        </View>

        {selectedHabitEntries.length === 0 ? (
          <Pressable style={styles.emptyCard} onPress={openAddHabitModal}>
            <Text style={styles.emptyTitle}>Пока пусто</Text>
            <Text style={styles.emptySubtitle}>
              Добавь свою первую привычку
            </Text>
          </Pressable>
        ) : (
          <>
            {featured && (
              <View style={styles.featuredWrap}>
                <HabitCard
                  size="featured"
                  title={featured.title}
                  subtitle={featured.subtitle}
                  icon={featured.icon}
                  theme={featured.theme}
                  week={buildWeek(featured.id)}
                  completedToday={isCompletedToday(featured.id)}
                  onToggle={() => toggleCompletion(featured.id)}
                  streak={streakFor(featured.id)}
                />
              </View>
            )}

            <View style={styles.grid}>
              {rest.map((habit, idx) => (
                <View
                  key={habit.id}
                  style={[
                    styles.gridItem,
                    idx % 2 === 0 ? styles.gridLeft : styles.gridRight,
                  ]}
                >
                  <HabitCard
                    size="compact"
                    title={habit.title}
                    subtitle={habit.subtitle}
                    icon={habit.icon}
                    theme={habit.theme}
                    week={buildWeek(habit.id)}
                    completedToday={isCompletedToday(habit.id)}
                    onToggle={() => toggleCompletion(habit.id)}
                  />
                </View>
              ))}
            </View>
          </>
        )}

        <Pressable
          onPress={() => navigation.navigate('Stats')}
          style={styles.statsLink}
        >
          <Text style={styles.statsLinkText}>Открыть статистику →</Text>
        </Pressable>
      </ScrollView>

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
                        <Text style={styles.modalHabitIcon}>{habit.icon}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.modalHabitTitle}>
                            {habit.title}
                          </Text>
                          <Text style={styles.modalHabitSubtitle}>
                            {habit.subtitle}
                          </Text>
                        </View>
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
                  <Text style={styles.modalCustomButtonText}>
                    Добавить свою
                  </Text>
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
    backgroundColor: '#000000',
    paddingHorizontal: 18,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginRight: 8,
  },
  brandText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '500',
  },
  featuredWrap: {
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },
  gridLeft: {},
  gridRight: {},
  emptyCard: {
    borderRadius: 22,
    paddingVertical: 36,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.55)',
    marginTop: 6,
    fontSize: 14,
  },
  statsLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  statsLinkText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#0F0F12',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalScroll: {
    maxHeight: 320,
    marginBottom: 12,
  },
  modalHabitCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modalHabitIcon: {
    fontSize: 22,
  },
  modalHabitTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalHabitSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 2,
  },
  modalEmptyText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    marginBottom: 12,
  },
  modalCustomButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalCustomButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
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
    borderColor: 'rgba(255,255,255,0.12)',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalButtonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  modalButtonPrimaryText: {
    color: '#000000',
    fontWeight: '700',
  },
  modalButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  modalCloseButton: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
});
