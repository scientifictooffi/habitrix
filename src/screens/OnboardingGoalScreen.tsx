import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import {useOnboardingStore} from '../store/onboardingStore';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingGoal'>;
export default function OnboardingGoalScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const goal = useOnboardingStore(state => state.goal);
  const setGoal = useOnboardingStore(state => state.setGoal);
  const goals = [
    {
      id: 'health',
      title: 'Health',
      subtitle: 'Sleep, water, health food',
    },
    {
      id: 'productivity',
      title: 'Productivity',
      subtitle: 'Focus, tasks, order',
    },
    {
      id: 'discipline',
      title: 'Discipline',
      subtitle: 'Consistency & routine',
    },
  ];
  const isNextDisabled = !goal;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Выбери цель</Text>

      {goals.map(goalOption => {
        const isSelected = goal === goalOption.id;
        const tintColor = isSelected
          ? 'rgba(124, 92, 255, 0.35)'
          : 'rgba(124, 92, 255, 0.18)';
        const cardStyle = [
          styles.cardBase,
          isSelected && styles.cardSelected,
          !isLiquidGlassSupported && styles.cardFallback,
        ];

        return (
          <Pressable
            key={goalOption.id}
            onPress={() => setGoal(goalOption.id)}
            style={styles.cardWrapper}
          >
            <LiquidGlassView
              style={cardStyle}
              effect="clear"
              interactive
              colorScheme="dark"
              tintColor={tintColor}
            >
              <Text style={styles.cardTitle}>{goalOption.title}</Text>
              <Text style={styles.cardSubtitle}>{goalOption.subtitle}</Text>
            </LiquidGlassView>
          </Pressable>
        );
      })}

      <Pressable
        disabled={isNextDisabled}
        onPress={() => navigation.navigate('OnboardingHabits')}
        style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]}
      >
        <Text style={styles.nextButtonText}>Далее</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F14',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F5F7FB',
    marginBottom: 16,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  cardBase: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
  },
  cardFallback: {
    backgroundColor: 'rgba(20, 26, 34, 0.85)',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F5F7FB',
  },
  cardSubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#9AA4B2',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backText: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '600',
  },
  cardSelected: {
    borderColor: '#7C5CFF',
  },
  nextButton: {
    marginTop: 24,
    backgroundColor: '#7C5CFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#2C3440',
  },
  nextButtonText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
});
