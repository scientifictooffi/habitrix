import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function OnboardingRemindersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Onboarding Reminders</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B0F14',
  },
  text: {
    fontSize: 18,
    color: '#F5F7FB',
  },
});
