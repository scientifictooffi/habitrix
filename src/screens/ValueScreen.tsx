import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';
import React from 'react';
import GradientBackground from '../components/GradientBackground';
import { getTheme } from '../utils/habitTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'Value'>;

const PREVIEW = [
  { theme: 'green', icon: '💻', title: 'Работать', subtitle: 'каждый день' },
  { theme: 'purple', icon: '🌅', title: 'Вставать в 6', subtitle: 'каждый день' },
  { theme: 'lime', icon: '🏋️', title: 'В зал', subtitle: '4 раза в неделю' },
  { theme: 'pink', icon: '💧', title: 'Холодный душ', subtitle: 'каждый день' },
];

export default function ValueScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 12,
          paddingBottom: Math.max(insets.bottom, 16) + 12,
        },
      ]}
    >
      <View style={styles.brandRow}>
        <View style={styles.brandDot} />
        <Text style={styles.brandText}>HABITRIX</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.title}>
          Привычки, которые{'\n'}действительно делают.
        </Text>
        <Text style={styles.subtitle}>
          60-секундная настройка. Серии, прогресс и лента — всё в одном месте.
        </Text>
      </View>

      <View style={styles.previewGrid}>
        {PREVIEW.map(p => {
          const t = getTheme(p.theme);
          return (
            <View key={p.title} style={styles.previewCell}>
              <View style={styles.previewCard}>
                <GradientBackground
                  colors={t.gradient}
                  radius={20}
                  angle={135}
                />
                <View style={styles.previewIconBubble}>
                  <Text style={styles.previewIcon}>{p.icon}</Text>
                </View>
                <View>
                  <Text style={styles.previewTitle}>{p.title}</Text>
                  <Text style={styles.previewSubtitle}>{p.subtitle}</Text>
                  <View style={styles.previewDots}>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <View
                        key={i}
                        style={[
                          styles.previewDot,
                          {
                            backgroundColor:
                              i < 5 ? t.progress : t.progressEmpty,
                          },
                        ]}
                      />
                    ))}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('OnboardingGoal')}
        >
          <Text style={styles.primaryText}>Начать</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          style={[styles.button, styles.secondaryButton]}
          onPress={() => navigation.navigate('Auth')}
        >
          <Text style={styles.secondaryText}>У меня уже есть аккаунт</Text>
        </Pressable>
        <Text style={styles.legal}>
          Продолжая, ты соглашаешься с{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://yourapp.com/terms')}
          >
            Условиями
          </Text>{' '}
          и{' '}
          <Text
            style={styles.link}
            onPress={() => Linking.openURL('https://yourapp.com/privacy')}
          >
            Политикой
          </Text>
          .
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 22,
    justifyContent: 'space-between',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  brandDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
    marginRight: 8,
  },
  brandText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  hero: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    lineHeight: 22,
  },
  previewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
    marginTop: 22,
  },
  previewCell: {
    width: '50%',
    aspectRatio: 1.05,
    padding: 6,
  },
  previewCard: {
    flex: 1,
    borderRadius: 20,
    padding: 14,
    overflow: 'hidden',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  previewIconBubble: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewIcon: { fontSize: 16 },
  previewTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  previewSubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 2,
  },
  previewDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 8,
  },
  previewDot: {
    flex: 1,
    height: 6,
    borderRadius: 3,
  },
  actions: {
    marginTop: 8,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 10,
  },
  primaryButton: {
    backgroundColor: '#FFFFFF',
  },
  primaryText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  link: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  legal: {
    marginTop: 4,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 18,
  },
});
