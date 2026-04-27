import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ValueScreen from '../screens/ValueScreen';
import OnboardingGoalScreen from '../screens/OnboardingGoalScreen';
import OnboardingHabitsScreen from '../screens/OnboardingHabitsScreen';
import OnboardingRemindersScreen from '../screens/OnboardingRemindersScreen';
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StatsScreen from '../screens/StatsScreen';
import FeedScreen from '../screens/FeedScreen';

export type RootStackParamList = {
  Value: undefined;
  OnboardingGoal: undefined;
  OnboardingHabits: undefined;
  OnboardingReminders: undefined;
  Auth: undefined;
  Dashboard: undefined;
  Stats: undefined;
  Feed: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#000000' },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Value" component={ValueScreen} />
      <Stack.Screen name="OnboardingGoal" component={OnboardingGoalScreen} />
      <Stack.Screen
        name="OnboardingHabits"
        component={OnboardingHabitsScreen}
      />
      <Stack.Screen
        name="OnboardingReminders"
        component={OnboardingRemindersScreen}
      />
      <Stack.Screen name="Auth" component={AuthScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
      <Stack.Screen name="Feed" component={FeedScreen} />
    </Stack.Navigator>
  );
}
