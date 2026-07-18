import { useSessionStore } from '../store/sessionStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { useCompletionsStore } from '../store/completionsStore';
import type { MemberProgress } from '../services/teamService';
import { getDateKey, getCurrentStreak } from './streak';

/**
 * Builds the current user's shareable progress card from local stores.
 * Only day status and streak are included — never the raw habit list.
 */
export function buildMyProgress(uid: string): MemberProgress {
  const { fullName, email } = useSessionStore.getState();
  const { selectedHabits } = useOnboardingStore.getState();
  const { completions } = useCompletionsStore.getState();
  const todayKey = getDateKey(new Date());
  const doneToday = (completions[todayKey] ?? []).filter(id =>
    selectedHabits.includes(id),
  ).length;
  return {
    uid,
    displayName: fullName ?? email ?? 'Пользователь',
    todayDone: doneToday,
    todayTotal: selectedHabits.length,
    streak: getCurrentStreak(completions, selectedHabits, todayKey),
    date: todayKey,
  };
}
