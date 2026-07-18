export const FREE_HABIT_LIMIT = 3;

type HabitIdSource = {
  id: string;
};

export const countValidActiveHabitIds = (
  activeHabitIds: readonly string[],
  habits: readonly HabitIdSource[],
): number => {
  const validHabitIds = new Set(habits.map(habit => habit.id));

  return new Set(activeHabitIds.filter(id => validHabitIds.has(id))).size;
};

export const canAddHabit = (
  activeHabitIds: readonly string[],
  habits: readonly HabitIdSource[],
  isPremium: boolean,
): boolean =>
  isPremium ||
  countValidActiveHabitIds(activeHabitIds, habits) < FREE_HABIT_LIMIT;
