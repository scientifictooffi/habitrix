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

export type Habit = {
  id: string;
  title: string;
  subtitle: string;
};

type OnboardingState = {
  goal: string | null;
  habits: Habit[];
  selectedHabits: string[];
  reminderTime: string;
  reminderEnabled: boolean;

  setGoal: (goalId: string) => void;
  toggleHabit: (habitId: string) => void;
  addCustomHabit: (title: string) => void;
  setReminderTime: (time: string) => void;
  setReminderEnabled: (value: boolean) => void;
  resetOnboarding: () => void;
};

const DEFAULT_HABITS: Habit[] = [
  { id: 'water', title: 'Drink water', subtitle: '8 glasses a day' },
  { id: 'steps', title: '8,000 steps', subtitle: 'Daily walk' },
  { id: 'reading', title: 'Read 20 min', subtitle: 'Books or articles' },
  { id: 'sleep', title: 'Sleep before 23:00', subtitle: 'Healthy rest' },
  { id: 'meditation', title: 'Meditate', subtitle: '10 minutes' },
  { id: 'journal', title: 'Morning journal', subtitle: 'Write 3 lines' },
  { id: 'stretch', title: 'Stretching', subtitle: '5 minutes' },
  { id: 'sugar', title: 'No sugar', subtitle: 'Skip sweets today' },
];

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
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

      addCustomHabit: title =>
        set(state => {
          const trimmed = title.trim();
          if (!trimmed) {
            return state;
          }
          const newHabit: Habit = {
            id: `custom-${Date.now()}`,
            title: trimmed,
            subtitle: 'Custom habit',
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
    { name: 'habitrix-onboarding', storage },
  ),
);
