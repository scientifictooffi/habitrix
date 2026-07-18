import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type AuthProvider = 'apple' | 'google' | 'password';

export type AuthenticatedUser = {
  userId: string;
  provider: AuthProvider;
  email?: string | null;
  fullName?: string | null;
};

type SessionState = {
  hasEnteredApp: boolean;
  isAuthenticated: boolean;
  userId: string | null;
  provider: AuthProvider | null;
  email: string | null;
  fullName: string | null;

  enterApp: () => void;
  setAuthenticated: (user: AuthenticatedUser) => void;
  signOut: () => void;
  leaveApp: () => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    set => ({
      hasEnteredApp: false,
      isAuthenticated: false,
      userId: null,
      provider: null,
      email: null,
      fullName: null,

      enterApp: () => set({ hasEnteredApp: true }),

      setAuthenticated: user =>
        set(state => ({
          hasEnteredApp: true,
          isAuthenticated: true,
          userId: user.userId,
          provider: user.provider,
          // Apple only sends email/fullName on the first sign-in; keep any
          // previously stored values when the new sign-in omits them.
          email: user.email ?? state.email,
          fullName: user.fullName ?? state.fullName,
        })),

      signOut: () =>
        set({
          isAuthenticated: false,
          userId: null,
          provider: null,
          email: null,
          fullName: null,
        }),

      leaveApp: () =>
        set({
          hasEnteredApp: false,
          isAuthenticated: false,
          userId: null,
          provider: null,
          email: null,
          fullName: null,
        }),
    }),
    {
      name: 'habitrix-session',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
