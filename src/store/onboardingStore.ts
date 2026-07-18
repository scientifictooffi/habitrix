import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { canAddHabit } from '../constants/habitLimits';
import { pickThemeFor } from '../utils/habitTheme';
import { useSubscriptionStore } from './subscriptionStore';

export type Habit = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  theme: string;
};

export type HabitOperationResult =
  | 'added'
  | 'removed'
  | 'limit_reached'
  | 'invalid';

type OnboardingState = {
  goal: string | null;
  habits: Habit[];
  selectedHabits: string[];
  reminderTime: string;
  reminderEnabled: boolean;

  setGoal: (goalId: string) => void;
  toggleHabit: (habitId: string) => HabitOperationResult;
  addCustomHabit: (
    title: string,
    icon?: string,
    theme?: string,
  ) => HabitOperationResult;
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

      toggleHabit: habitId => {
        let result: HabitOperationResult = 'invalid';

        set(state => {
          if (!state.habits.some(habit => habit.id === habitId)) {
            return state;
          }

          const selected = state.selectedHabits;
          if (selected.includes(habitId)) {
            result = 'removed';
            return { selectedHabits: selected.filter(id => id !== habitId) };
          }

          const isPremium = useSubscriptionStore.getState().isPremium;
          if (!canAddHabit(selected, state.habits, isPremium)) {
            result = 'limit_reached';
            return state;
          }

          result = 'added';
          return { selectedHabits: [...selected, habitId] };
        });

        return result;
      },

      addCustomHabit: (title, icon, theme) => {
        let result: HabitOperationResult = 'invalid';

        set(state => {
          const trimmed = title.trim();
          if (!trimmed) {
            return state;
          }

          const isPremium = useSubscriptionStore.getState().isPremium;
          if (!canAddHabit(state.selectedHabits, state.habits, isPremium)) {
            result = 'limit_reached';
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

          result = 'added';
          return {
            habits: nextHabits,
            selectedHabits: [...state.selectedHabits, newHabit.id],
          };
        });

        return result;
      },

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
