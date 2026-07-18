import {
  FREE_HABIT_LIMIT,
  canAddHabit,
  countValidActiveHabitIds,
} from '../src/constants/habitLimits';

const habits = ['a', 'b', 'c', 'd'].map(id => ({ id }));

describe('habit limits', () => {
  it('uses a free limit of three habits', () => {
    expect(FREE_HABIT_LIMIT).toBe(3);
  });

  it.each([
    [[], true],
    [['a'], true],
    [['a', 'b'], true],
    [['a', 'b', 'c'], false],
  ] as const)(
    'checks whether a free user can add with %j active habits',
    (activeHabitIds, expected) => {
      expect(canAddHabit(activeHabitIds, habits, false)).toBe(expected);
    },
  );

  it('allows premium users to add beyond the free limit', () => {
    expect(canAddHabit(['a', 'b', 'c', 'd'], habits, true)).toBe(true);
  });

  it('counts only unique ids that belong to existing habits', () => {
    expect(
      countValidActiveHabitIds(
        ['a', 'orphan', 'a', 'another-orphan', 'b'],
        habits,
      ),
    ).toBe(2);
  });
});
