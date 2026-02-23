import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCompletionsStore } from '../store/completionsStore';
import { useOnboardingStore } from '../store/onboardingStore';
import {
  getDateKey,
  getMonthCalendarCells,
  isDayComplete,
} from '../utils/streak';
import type { RootStackParamList } from '../navigation/AppNavigator';

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];
const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

type Props = NativeStackScreenProps<RootStackParamList, 'Stats'>;

export default function StatsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const completions = useCompletionsStore(s => s.completions);
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

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Статистика</Text>
      <Text style={styles.subtitle}>Дни, когда все привычки выполнены</Text>

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
            <Text style={[styles.arrowText, isCurrentMonth && styles.arrowDisabled]}>
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
            const complete = isDayComplete(dateKey, selectedHabits, completions);
            const isToday = dateKey === todayKey;
            return (
              <View
                key={dateKey}
                style={[
                  styles.cell,
                  styles.cellFilled,
                  complete && styles.cellDone,
                  isToday && styles.cellToday,
                ]}
              >
                <Text
                  style={[
                    styles.cellText,
                    isToday && styles.cellTextToday,
                  ]}
                >
                  {new Date(dateKey).getDate()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, styles.cellDone]} />
          <Text style={styles.legendText}>Все привычки выполнены</Text>
        </View>
        <View style={styles.legendRow}>
          <View style={[styles.legendDot, styles.cellToday]} />
          <Text style={styles.legendText}>Сегодня</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    paddingHorizontal: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    paddingVertical: 4,
    paddingRight: 8,
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
    marginTop: 4,
    fontSize: 15,
    color: '#9AA4B2',
    marginBottom: 20,
  },
  calendarCard: {
    backgroundColor: '#141A22',
    borderWidth: 1,
    borderColor: '#2C3440',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
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
    color: '#F5F7FB',
    fontSize: 24,
    fontWeight: '600',
  },
  arrowDisabled: {
    color: '#2C3440',
  },
  monthTitle: {
    color: '#F5F7FB',
    fontSize: 17,
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
    color: '#9AA4B2',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  cellFilled: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#0B0F14',
  },
  cellDone: {
    backgroundColor: '#7C5CFF',
  },
  cellToday: {
    borderWidth: 2,
    borderColor: '#7C5CFF',
  },
  cellText: {
    color: '#9AA4B2',
    fontSize: 13,
    fontWeight: '600',
  },
  cellTextToday: {
    color: '#F5F7FB',
  },
  legend: {
    gap: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  legendDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  legendText: {
    color: '#9AA4B2',
    fontSize: 14,
  },
});
