import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const storage = {
  getItem: async (name: string) => AsyncStorage.getItem(name),
  setItem: async (name: string, value: unknown) =>
    AsyncStorage.setItem(
      name,
      typeof value === 'string' ? value : JSON.stringify(value),
    ),
  removeItem: async (name: string) => AsyncStorage.removeItem(name),
};

function getTodayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

type CompletionsState = {
  /** date (YYYY-MM-DD) -> habit ids completed that day */
  completions: Record<string, string[]>;
  toggleCompletion: (habitId: string) => void;
  isCompletedToday: (habitId: string) => boolean;
};

export const useCompletionsStore = create<CompletionsState>()(
  persist(
    (set, get) => ({
      completions: {},

      toggleCompletion: habitId => {
        const today = getTodayKey();
        set(state => {
          const list = state.completions[today] ?? [];
          const next = list.includes(habitId)
            ? list.filter(id => id !== habitId)
            : [...list, habitId];
          return {
            completions: { ...state.completions, [today]: next },
          };
        });
      },

      isCompletedToday: habitId => {
        const today = getTodayKey();
        const list = get().completions[today] ?? [];
        return list.includes(habitId);
      },
    }),
    { name: 'habitrix-completions', storage },
  ),
);
