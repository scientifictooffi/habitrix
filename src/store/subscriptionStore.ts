import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type RestoreResult = 'restored' | 'not_found';

export const isDevPremiumAvailable = __DEV__;

type SubscriptionState = {
  isPremium: boolean;
  activateDevPremium: () => void;
  deactivateDevPremium: () => void;
  restorePurchases: () => Promise<RestoreResult>;
  resetSubscription: () => void;
};

/**
 * Development-only subscription adapter.
 *
 * This is local state, not real billing or entitlement verification. Replace it
 * with RevenueCat before production; it must never grant production access.
 */
export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      isPremium: false,

      activateDevPremium: () => {
        if (!__DEV__) {
          return;
        }

        set({ isPremium: true });
      },

      deactivateDevPremium: () => set({ isPremium: false }),

      restorePurchases: async () =>
        get().isPremium ? 'restored' : 'not_found',

      resetSubscription: () => set({ isPremium: false }),
    }),
    {
      name: 'habitrix-subscription',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({ isPremium: state.isPremium }),
    },
  ),
);
