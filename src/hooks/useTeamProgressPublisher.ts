import { useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { useCompletionsStore } from '../store/completionsStore';
import { subscribeMyGroups, publishProgress } from '../services/teamService';
import { buildMyProgress } from '../utils/teamProgress';

/**
 * Publishes the current user's progress card to every team they belong to,
 * whenever their habits or completions change (debounced). Only the day status
 * and streak are shared — never the raw habit list.
 */
export function useTeamProgressPublisher() {
  const userId = useSessionStore(s => s.userId);
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    let groupIds: string[] = [];
    let timer: ReturnType<typeof setTimeout> | null = null;

    const publishAll = () => {
      if (groupIds.length === 0) {
        return;
      }
      const progress = buildMyProgress(userId);
      groupIds.forEach(id => {
        publishProgress(id, progress).catch(() => {
          // Best-effort; retried on the next change.
        });
      });
    };

    const schedule = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(publishAll, 1500);
    };

    const unsubGroups = subscribeMyGroups(userId, groups => {
      groupIds = groups.map(g => g.id);
      publishAll(); // push immediately when the set of teams changes
    });
    const unsubOnboarding = useOnboardingStore.subscribe(schedule);
    const unsubCompletions = useCompletionsStore.subscribe(schedule);

    return () => {
      unsubGroups();
      unsubOnboarding();
      unsubCompletions();
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [userId, isAuthenticated]);
}
