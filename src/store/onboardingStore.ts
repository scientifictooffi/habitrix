import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { pickThemeFor } from '../utils/habitTheme';

export type Habit = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  theme: string;
};

type OnboardingState = {
  goal: string | null;
  habits: Habit[];
  selectedHabits: string[];
  reminderTime: string;
  reminderEnabled: boolean;

  setGoal: (goalId: string) => void;
  toggleHabit: (habitId: string) => void;
  addCustomHabit: (title: string, icon?: string, theme?: string) => void;
  setReminderTime: (time: string) => void;
  setReminderEnabled: (value: boolean) => void;
  resetOnboarding: () => void;
};

const DEFAULT_HABITS: Habit[] = [
  {
    id: 'work',
    title: 'Работать',
    subtitle: 'каждый день',
    icon: '💻',
    theme: 'green',
  },
  {
    id: 'wakeup',
    title: 'Вставать в 6 утра',
    subtitle: 'каждый день',
    icon: '🌅',
    theme: 'purple',
  },
  {
    id: 'no-sweets',
    title: 'Без сладкого',
    subtitle: 'каждый день',
    icon: '🚫',
    theme: 'charcoal',
  },
  {
    id: 'gym',
    title: 'Ходить в зал',
    subtitle: '4 раза в неделю',
    icon: '🏋️',
    theme: 'lime',
  },
  {
    id: 'cold-shower',
    title: 'Холодный душ',
    subtitle: 'каждый день',
    icon: '💧',
    theme: 'pink',
  },
  {
    id: 'reading',
    title: 'Читать 20 минут',
    subtitle: 'каждый день',
    icon: '📖',
    theme: 'amber',
  },
  {
    id: 'meditation',
    title: 'Медитация',
    subtitle: '10 минут',
    icon: '🧘',
    theme: 'cyan',
  },
  {
    id: 'water',
    title: 'Пить воду',
    subtitle: '8 стаканов в день',
    icon: '🥤',
    theme: 'rose',
  },
];

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    set => ({
      goal: null,
      habits: DEFAULT_HABITS,
      selectedHabits: [],
      reminderTime: '08:00',
      reminderEnabled: true,

      setGoal: goalId => set({ goal: goalId }),

      toggleHabit: habitId =>
        set(state => {
          const selected = state.selectedHabits;
          if (selected.includes(habitId)) {
            return { selectedHabits: selected.filter(id => id !== habitId) };
          }
          if (selected.length >= 3) {
            return state;
          }
          return { selectedHabits: [...selected, habitId] };
        }),

      addCustomHabit: (title, icon, theme) =>
        set(state => {
          const trimmed = title.trim();
          if (!trimmed) {
            return state;
          }
          const id = `custom-${Date.now()}`;
          const newHabit: Habit = {
            id,
            title: trimmed,
            subtitle: 'каждый день',
            icon: icon ?? '✨',
            theme: theme ?? pickThemeFor(id),
          };
          const nextHabits = [newHabit, ...state.habits];
          const nextSelected =
            state.selectedHabits.length < 3
              ? [...state.selectedHabits, newHabit.id]
              : state.selectedHabits;

          return {
            habits: nextHabits,
            selectedHabits: nextSelected,
          };
        }),

      setReminderTime: time => set({ reminderTime: time }),

      setReminderEnabled: value => set({ reminderEnabled: value }),

      resetOnboarding: () =>
        set({
          goal: null,
          habits: DEFAULT_HABITS,
          selectedHabits: [],
          reminderTime: '08:00',
          reminderEnabled: true,
        }),
    }),
    {
      name: 'habitrix-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persistedState, version) => {
        const state = persistedState as Partial<OnboardingState> | undefined;
        if (!state) return state as OnboardingState | undefined;
        if (version < 2) {
          return {
            ...state,
            habits: DEFAULT_HABITS,
            selectedHabits: [],
          } as OnboardingState;
        }
        return state as OnboardingState;
      },
    },
  ),
);
