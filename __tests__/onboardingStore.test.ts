import {
  Habit,
  useOnboardingStore,
} from '../src/store/onboardingStore';
import { useSubscriptionStore } from '../src/store/subscriptionStore';

const habits: Habit[] = ['a', 'b', 'c', 'd', 'e'].map(id => ({
  id,
  title: `Habit ${id}`,
  subtitle: 'daily',
  icon: '✓',
  theme: 'green',
}));

describe('onboarding habit operations', () => {
  beforeEach(() => {
    useSubscriptionStore.setState({ isPremium: false });
    useOnboardingStore.setState({
      habits,
      selectedHabits: [],
    });
  });

  it('lets a free user add habits from zero through three, then blocks the fourth', () => {
    const { toggleHabit } = useOnboardingStore.getState();

    expect(toggleHabit('a')).toBe('added');
    expect(toggleHabit('b')).toBe('added');
    expect(toggleHabit('c')).toBe('added');
    expect(toggleHabit('d')).toBe('limit_reached');
    expect(useOnboardingStore.getState().selectedHabits).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('lets a premium user add four or more habits', () => {
    useSubscriptionStore.setState({ isPremium: true });
    const { toggleHabit } = useOnboardingStore.getState();

    expect(toggleHabit('a')).toBe('added');
    expect(toggleHabit('b')).toBe('added');
    expect(toggleHabit('c')).toBe('added');
    expect(toggleHabit('d')).toBe('added');
    expect(toggleHabit('e')).toBe('added');
    expect(useOnboardingStore.getState().selectedHabits).toHaveLength(5);
  });

  it('always allows removal and frees a free slot', () => {
    useOnboardingStore.setState({ selectedHabits: ['a', 'b', 'c'] });
    const { toggleHabit } = useOnboardingStore.getState();

    expect(toggleHabit('b')).toBe('removed');
    expect(toggleHabit('d')).toBe('added');
    expect(useOnboardingStore.getState().selectedHabits).toEqual([
      'a',
      'c',
      'd',
    ]);
  });

  it('does not create a hidden custom habit when the limit is reached', () => {
    useOnboardingStore.setState({ selectedHabits: ['a', 'b', 'c'] });
    const before = useOnboardingStore.getState().habits;

    expect(useOnboardingStore.getState().addCustomHabit('Blocked')).toBe(
      'limit_reached',
    );
    expect(useOnboardingStore.getState().habits).toEqual(before);
    expect(useOnboardingStore.getState().selectedHabits).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('creates and activates a valid custom habit when a slot is available', () => {
    useOnboardingStore.setState({ selectedHabits: ['a', 'b'] });

    expect(useOnboardingStore.getState().addCustomHabit('  Custom  ')).toBe(
      'added',
    );

    const state = useOnboardingStore.getState();
    expect(state.habits[0].title).toBe('Custom');
    expect(state.selectedHabits).toContain(state.habits[0].id);
  });

  it('does not count orphan ids against the free limit', () => {
    useOnboardingStore.setState({
      selectedHabits: ['a', 'b', 'orphan'],
    });
    const { toggleHabit } = useOnboardingStore.getState();

    expect(toggleHabit('c')).toBe('added');
    expect(toggleHabit('d')).toBe('limit_reached');
  });

  it('rejects an unknown habit id and a blank custom title', () => {
    const before = useOnboardingStore.getState();

    expect(before.toggleHabit('unknown')).toBe('invalid');
    expect(before.addCustomHabit('   ')).toBe('invalid');
    expect(useOnboardingStore.getState().habits).toEqual(before.habits);
    expect(useOnboardingStore.getState().selectedHabits).toEqual(
      before.selectedHabits,
    );
  });

  it('preserves existing habits above the limit after downgrade but blocks additions', () => {
    useOnboardingStore.setState({
      selectedHabits: ['a', 'b', 'c', 'd'],
    });
    const { toggleHabit } = useOnboardingStore.getState();

    expect(toggleHabit('e')).toBe('limit_reached');
    expect(useOnboardingStore.getState().selectedHabits).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
    expect(toggleHabit('d')).toBe('removed');
  });
});
