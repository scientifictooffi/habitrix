import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBackground from '../components/GradientBackground';
import { getTheme } from '../utils/habitTheme';
import { useOnboardingStore } from '../store/onboardingStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingGoal'>;

const GOALS = [
  {
    id: 'health',
    title: 'Здоровье',
    subtitle: 'сон, вода, питание',
    icon: '🌱',
    theme: 'green',
  },
  {
    id: 'productivity',
    title: 'Продуктивность',
    subtitle: 'фокус, задачи, порядок',
    icon: '⚡️',
    theme: 'amber',
  },
  {
    id: 'discipline',
    title: 'Дисциплина',
    subtitle: 'регулярность и режим',
    icon: '🎯',
    theme: 'pink',
  },
];

export default function OnboardingGoalScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const goal = useOnboardingStore(state => state.goal);
  const setGoal = useOnboardingStore(state => state.setGoal);
  const isNextDisabled = !goal;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Выбери цель</Text>
      <Text style={styles.subtitle}>На чём сосредоточимся первым делом</Text>

      <View style={{ marginTop: 18, gap: 12 }}>
        {GOALS.map(g => {
          const t = getTheme(g.theme);
          const selected = goal === g.id;
          return (
            <Pressable
              key={g.id}
              onPress={() => setGoal(g.id)}
              style={[
                styles.card,
                selected && { borderColor: t.accent, borderWidth: 2 },
              ]}
            >
              <GradientBackground colors={t.gradient} radius={20} angle={135} />
              <View style={styles.iconBubble}>
                <Text style={styles.iconText}>{g.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{g.title}</Text>
                <Text style={styles.cardSubtitle}>{g.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.radio,
                  selected && {
                    backgroundColor: t.accent,
                    borderColor: t.accent,
                  },
                ]}
              >
                {selected && <Text style={styles.radioCheck}>✓</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View style={{ flex: 1 }} />

      <Pressable
        disabled={isNextDisabled}
        onPress={() => navigation.navigate('OnboardingHabits')}
        style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]}
      >
        <Text
          style={[
            styles.nextButtonText,
            isNextDisabled && styles.nextButtonTextDisabled,
          ]}
        >
          Далее
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 22,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
  },
  card: {
    minHeight: 80,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  radio: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheck: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  nextButtonTextDisabled: {
    color: 'rgba(255,255,255,0.45)',
  },
});
