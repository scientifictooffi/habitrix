import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ValueScreen from '../screens/ValueScreen';
import OnboardingGoalScreen from '../screens/OnboardingGoalScreen';
import OnboardingHabitsScreen from '../screens/OnboardingHabitsScreen';
import OnboardingRemindersScreen from '../screens/OnboardingRemindersScreen';
import AuthScreen from '../screens/AuthScreen';
import DashboardScreen from '../screens/DashboardScreen';
import StatsScreen from '../screens/StatsScreen';
import FeedScreen from '../screens/FeedScreen';
import SettingsScreen from '../screens/SettingsScreen';
import PaywallScreen from '../screens/PaywallScreen';
import { useSessionStore } from '../store/sessionStore';

export type RootStackParamList = {
  Value: undefined;
  OnboardingGoal: undefined;
  OnboardingHabits: undefined;
  OnboardingReminders: undefined;
  Auth: undefined;
  Dashboard: undefined;
  Stats: undefined;
  Feed: undefined;
  Settings: undefined;
  Paywall: {
    source?: 'dashboard_add' | 'onboarding' | 'settings';
  } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const hasEnteredApp = useSessionStore(state => state.hasEnteredApp);

  return (
    <Stack.Navigator
      initialRouteName={hasEnteredApp ? 'Dashboard' : 'Value'}
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
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Paywall" component={PaywallScreen} />
    </Stack.Navigator>
  );
}
