import { Habit } from '../store/onboardingStore';
import { getDateKey } from './streak';

export type FeedEvent =
  | {
      kind: 'completion';
      id: string;
      dateKey: string;
      habit: Habit;
    }
  | {
      kind: 'streak';
      id: string;
      dateKey: string;
      habit: Habit;
      streak: number;
    };

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];

/**
 * Builds a chronologically descending activity feed for the user from completion history.
 */
export function buildFeed(
  habits: Habit[],
  selectedHabits: string[],
  completions: Record<string, string[]>,
): FeedEvent[] {
  const habitById = new Map(habits.map(h => [h.id, h]));
  const dates = Object.keys(completions).sort();
  const events: FeedEvent[] = [];

  const streakByHabit = new Map<string, number>();
  const lastDateByHabit = new Map<string, string>();

  for (const dateKey of dates) {
    const completedIds = completions[dateKey] ?? [];
    for (const habitId of selectedHabits) {
      const habit = habitById.get(habitId);
      if (!habit) continue;
      const wasCompletedToday = completedIds.includes(habitId);
      if (wasCompletedToday) {
        events.push({
          kind: 'completion',
          id: `${habitId}-${dateKey}-c`,
          dateKey,
          habit,
        });

        const last = lastDateByHabit.get(habitId);
        const expectedYesterday = last ? nextDayKey(last) === dateKey : false;
        const newStreak = expectedYesterday
          ? (streakByHabit.get(habitId) ?? 0) + 1
          : 1;
        streakByHabit.set(habitId, newStreak);
        lastDateByHabit.set(habitId, dateKey);

        if (STREAK_MILESTONES.includes(newStreak)) {
          events.push({
            kind: 'streak',
            id: `${habitId}-${dateKey}-s${newStreak}`,
            dateKey,
            habit,
            streak: newStreak,
          });
        }
      }
    }
  }

  events.reverse();
  return events;
}

function nextDayKey(dateKey: string): string {
  const d = new Date(dateKey);
  d.setDate(d.getDate() + 1);
  return getDateKey(d);
}

export function formatDateLabel(dateKey: string): string {
  const today = getDateKey(new Date());
  if (dateKey === today) return 'сегодня';
  const y = new Date();
  y.setDate(y.getDate() - 1);
  if (dateKey === getDateKey(y)) return 'вчера';
  const d = new Date(dateKey);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  return `${dd}.${mm}`;
}
