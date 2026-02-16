import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingGoal'>;

export default function OnboardingGoalScreen({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>
      </View>

      <Text style={styles.title}>Выбери цель</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Health</Text>
        <Text style={styles.cardSubtitle}>Sleep, water, health food</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Productivity</Text>
        <Text style={styles.cardSubtitle}>Sleep, water, health food</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Discipline</Text>
        <Text style={styles.cardSubtitle}>Sleep, water, health food</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#0B0F14',
    paddingTop: 70,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F5F7FB',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#141A22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C3440',
    marginBottom: 12,
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
    marginBottom: 16,
  },
  backText: {
    color: '#F5F7FB',
    fontSize: 16,
    fontWeight: '600',
  },
});
