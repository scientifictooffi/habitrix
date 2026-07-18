import { useEffect } from 'react';
import { useOnboardingStore } from '../store/onboardingStore';
import { syncReminders } from '../utils/notifications';

/**
 * Keeps the OS-level daily reminder in sync with the persisted reminder
 * settings. Mount once near the app root.
 *
 * Re-syncs when:
 *  - the component mounts (covers the already-hydrated case)
 *  - the persisted onboarding store finishes hydrating
 *  - the user changes reminderTime / reminderEnabled at runtime
 */
export function useReminderScheduler(): void {
  useEffect(() => {
    const sync = () => {
      const { reminderEnabled, reminderTime } = useOnboardingStore.getState();
      syncReminders(reminderEnabled, reminderTime).catch(() => {});
    };

    // 1. Sync now in case the store is already hydrated.
    sync();

    // 2. Sync again once hydration completes (persisted value may differ).
    const unsubHydrate = useOnboardingStore.persist.onFinishHydration(sync);

    // 3. React to user-driven changes.
    const unsubChange = useOnboardingStore.subscribe((state, prev) => {
      if (
        state.reminderEnabled !== prev.reminderEnabled ||
        state.reminderTime !== prev.reminderTime
      ) {
        syncReminders(state.reminderEnabled, state.reminderTime).catch(() => {});
      }
    });

    return () => {
      unsubHydrate();
      unsubChange();
    };
  }, []);
}
