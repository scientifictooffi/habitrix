import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCompletionsStore } from '../store/completionsStore';
import { useOnboardingStore } from '../store/onboardingStore';
import {
  getCurrentStreak,
  getDateKey,
  getMonthCalendarCells,
  isDayComplete,
} from '../utils/streak';
import type { RootStackParamList } from '../navigation/AppNavigator';
import GradientBackground from '../components/GradientBackground';
import { getTheme } from '../utils/habitTheme';

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

export default function StatsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const completions = useCompletionsStore(s => s.completions);
  const habits = useOnboardingStore(s => s.habits);
  const selectedHabits = useOnboardingStore(s => s.selectedHabits);

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  const todayKey = getDateKey(new Date());
  const cells = getMonthCalendarCells(year, month);

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };
  const goNextMonth = () => {
    if (month === 11) {
      setMonth(0);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth();

  const totalStreak = getCurrentStreak(completions, selectedHabits, todayKey);
  const totalDoneDays = cells.filter(
    d => d && isDayComplete(d, selectedHabits, completions),
  ).length;

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
          <Text style={styles.title}>Статистика</Text>
          <Text style={styles.subtitle}>Прогресс за месяц</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Серия</Text>
            <Text style={styles.statValue}>🔥 {totalStreak}</Text>
            <Text style={styles.statSub}>дней подряд</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Выполнено</Text>
            <Text style={styles.statValue}>{totalDoneDays}</Text>
            <Text style={styles.statSub}>дней в этом месяце</Text>
          </View>
        </View>

        <View style={styles.calendarCard}>
          <View style={styles.monthRow}>
            <Pressable onPress={goPrevMonth} style={styles.arrowButton}>
              <Text style={styles.arrowText}>‹</Text>
            </Pressable>
            <Text style={styles.monthTitle}>
              {MONTH_NAMES[month]} {year}
            </Text>
            <Pressable
              onPress={goNextMonth}
              style={styles.arrowButton}
              disabled={isCurrentMonth}
            >
              <Text
                style={[
                  styles.arrowText,
                  isCurrentMonth && styles.arrowDisabled,
                ]}
              >
                ›
              </Text>
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {DAY_LABELS.map(label => (
              <Text key={label} style={styles.weekHeader}>
                {label}
              </Text>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((dateKey, i) => {
              if (dateKey === null) {
                return <View key={`empty-${i}`} style={styles.cell} />;
              }
              const complete = isDayComplete(
                dateKey,
                selectedHabits,
                completions,
              );
              const isToday = dateKey === todayKey;
              return (
                <View key={dateKey} style={styles.cell}>
                  <View
                    style={[
                      styles.cellInner,
                      complete && styles.cellDone,
                      isToday && styles.cellToday,
                    ]}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        complete && styles.cellTextDone,
                        isToday && styles.cellTextToday,
                      ]}
                    >
                      {new Date(dateKey).getDate()}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <Text style={styles.sectionTitle}>По привычкам</Text>
        <View style={{ gap: 10 }}>
          {selectedHabits.map(id => {
            const habit = habits.find(h => h.id === id);
            if (!habit) return null;
            const t = getTheme(habit.theme);
            const streak = getCurrentStreak(completions, [id], todayKey);
            return (
              <View key={id} style={styles.habitRow}>
                <GradientBackground
                  colors={t.gradient}
                  radius={16}
                  angle={135}
                />
                <View style={styles.iconBubble}>
                  <Text style={{ fontSize: 18 }}>{habit.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.habitTitle}>{habit.title}</Text>
                  <Text style={styles.habitSubtitle}>{habit.subtitle}</Text>
                </View>
                <View style={styles.streakPill}>
                  <Text style={[styles.streakText, { color: t.accent }]}>
                    🔥 {streak}
                  </Text>
                </View>
              </View>
            );
          })}
          {selectedHabits.length === 0 && (
            <Text style={styles.empty}>Пока нет выбранных привычек</Text>
          )}
        </View>
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
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 14,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 8,
  },
  statSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    marginTop: 4,
  },
  calendarCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 22,
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  arrowButton: {
    padding: 8,
    minWidth: 44,
    alignItems: 'center',
  },
  arrowText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
  },
  arrowDisabled: {
    color: 'rgba(255,255,255,0.18)',
  },
  monthTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekHeader: {
    flex: 1,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.4)',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    padding: 3,
  },
  cellInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  cellDone: {
    backgroundColor: '#FFFFFF',
  },
  cellToday: {
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cellText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    fontWeight: '600',
  },
  cellTextDone: {
    color: '#000000',
  },
  cellTextToday: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  habitRow: {
    minHeight: 64,
    borderRadius: 16,
    padding: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  habitTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  habitSubtitle: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  streakPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
  },
  empty: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 16,
  },
});
