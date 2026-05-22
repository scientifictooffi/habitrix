import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type SessionState = {
  hasEnteredApp: boolean;
  isAuthenticated: boolean;
  userId: string | null;

  enterApp: () => void;
  setAuthenticated: (userId: string) => void;
  signOut: () => void;
  leaveApp: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    set => ({
      hasEnteredApp: false,
      isAuthenticated: false,
      userId: null,

      enterApp: () => set({ hasEnteredApp: true }),

      setAuthenticated: userId =>
        set({
          hasEnteredApp: true,
          isAuthenticated: true,
          userId,
        }),

      signOut: () =>
        set({
          isAuthenticated: false,
          userId: null,
        }),

      leaveApp: () =>
        set({
          hasEnteredApp: false,
          isAuthenticated: false,
          userId: null,
        }),
    }),
    {
      name: 'habitrix-session',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
