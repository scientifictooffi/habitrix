import { useEffect, useRef } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { useCompletionsStore } from '../store/completionsStore';
import {
  ensureUserProfile,
  saveAppData,
  loadAppData,
  type CloudAppData,
} from '../services/firestoreService';

const snapshotLocal = (): CloudAppData => {
  const o = useOnboardingStore.getState();
  const c = useCompletionsStore.getState();
  return {
    goal: o.goal,
    habits: o.habits,
    selectedHabits: o.selectedHabits,
    reminderTime: o.reminderTime,
    reminderEnabled: o.reminderEnabled,
    completions: c.completions,
  };
};

const applyToLocal = (data: CloudAppData) => {
  useOnboardingStore.setState({
    goal: data.goal ?? null,
    habits: (data.habits as never) ?? useOnboardingStore.getState().habits,
    selectedHabits: data.selectedHabits ?? [],
    reminderTime: data.reminderTime ?? '08:00',
    reminderEnabled: data.reminderEnabled ?? true,
  });
  useCompletionsStore.setState({ completions: data.completions ?? {} });
};

/**
 * Two-way (last-write-wins) sync between the local Zustand stores and the
 * user's Firestore document.
 *
 * - On sign-in we write the profile, then pull cloud data. If the cloud already
 *   has data, it becomes the source of truth (restore progress on a new device);
 *   otherwise we push the current local data (e.g. a guest who just signed up).
 * - After that initial sync, local changes are debounced and pushed to Firestore.
 */
export function useCloudSync() {
  const userId = useSessionStore(s => s.userId);
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);

  const readyRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial per-user sync (profile + pull/push).
  useEffect(() => {
    readyRef.current = false;
    if (!isAuthenticated || !userId) {
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const { provider, email, fullName } = useSessionStore.getState();
        await ensureUserProfile({
          userId,
          provider: provider ?? 'password',
          email,
          fullName,
        });

        const remote = await loadAppData(userId);
        if (cancelled) {
          return;
        }
        if (remote) {
          applyToLocal(remote);
        } else {
          await saveAppData(userId, snapshotLocal());
        }
      } catch {
        // Offline / transient: local data stays intact, retried on next change.
      } finally {
        if (!cancelled) {
          readyRef.current = true;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, isAuthenticated]);

  // Push local changes (debounced) once the initial sync has completed.
  useEffect(() => {
    if (!isAuthenticated || !userId) {
      return;
    }

    const schedulePush = () => {
      if (!readyRef.current) {
        return;
      }
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      timerRef.current = setTimeout(() => {
        saveAppData(userId, snapshotLocal()).catch(() => {
          // Best-effort; will be retried on the next change.
        });
      }, 1500);
    };

    const unsubOnboarding = useOnboardingStore.subscribe(schedulePush);
    const unsubCompletions = useCompletionsStore.subscribe(schedulePush);

    return () => {
      unsubOnboarding();
      unsubCompletions();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [userId, isAuthenticated]);
}
