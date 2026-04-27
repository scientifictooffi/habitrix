import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCompletionsStore } from '../store/completionsStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { buildFeed, formatDateLabel } from '../utils/feed';
import { getTheme } from '../utils/habitTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Feed'>;

export default function FeedScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const habits = useOnboardingStore(s => s.habits);
  const selectedHabits = useOnboardingStore(s => s.selectedHabits);
  const completions = useCompletionsStore(s => s.completions);

  const events = useMemo(
    () => buildFeed(habits, selectedHabits, completions),
    [habits, selectedHabits, completions],
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Лента активности</Text>
          <Text style={styles.subtitle}>Твои выполнения и серии</Text>
        </View>
      </View>

      {events.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Тут пока тихо</Text>
          <Text style={styles.emptySubtitle}>
            Отметь привычку выполненной — событие появится здесь.
          </Text>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        >
          {events.map(ev => {
            const t = getTheme(ev.habit.theme);
            return (
              <View key={ev.id} style={styles.row}>
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: 'rgba(255,255,255,0.06)' },
                  ]}
                >
                  <Text style={styles.avatarEmoji}>🧑</Text>
                </View>

                <View style={styles.rowBody}>
                  <View style={styles.rowHead}>
                    <Text style={styles.who}>Ты</Text>
                    <Text style={styles.time}>
                      {formatDateLabel(ev.dateKey)}
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.action,
                      ev.kind === 'streak' && { color: t.accent },
                    ]}
                  >
                    {ev.kind === 'completion'
                      ? 'выполнил(а) привычку'
                      : `достиг(ла) ${ev.streak}-дневной серии`}
                  </Text>

                  <View
                    style={[
                      styles.chip,
                      { borderColor: 'rgba(255,255,255,0.08)' },
                    ]}
                  >
                    <Text style={styles.chipIcon}>
                      {ev.kind === 'streak' ? '🔥' : ev.habit.icon}
                    </Text>
                    <Text style={[styles.chipText, { color: t.accent }]}>
                      {ev.habit.title}
                    </Text>
                  </View>
                </View>

                {ev.kind === 'streak' && (
                  <View
                    style={[
                      styles.streakBadge,
                      {
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        borderColor: 'rgba(255,255,255,0.08)',
                      },
                    ]}
                  >
                    <Text style={styles.streakBadgeText}>🔥</Text>
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
    paddingHorizontal: 4,
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
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
    marginTop: 2,
  },
  list: {
    paddingBottom: 24,
    gap: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },
  rowBody: {
    flex: 1,
    gap: 4,
  },
  rowHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  who: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  time: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
  },
  action: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 13,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingRight: 4,
  },
  chipIcon: {
    fontSize: 14,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
  },
  streakBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakBadgeText: {
    fontSize: 22,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
