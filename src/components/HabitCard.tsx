import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import GradientBackground from './GradientBackground';
import Avatar from './Avatar';
import { getTheme } from '../utils/habitTheme';

type Props = {
  title: string;
  subtitle: string;
  icon: string;
  theme: string;
  /** length 7, true = day completed */
  week: boolean[];
  /** if today is completed */
  completedToday: boolean;
  onToggle: () => void;
  /** "featured" full-width card, "compact" half-width tile */
  size?: 'featured' | 'compact';
  /** Streak number (only shown on featured) */
  streak?: number;
  /** Avatars for participants */
  avatars?: string[];
};

const RADIUS = 22;

export default function HabitCard({
  title,
  subtitle,
  icon,
  theme,
  week,
  completedToday,
  onToggle,
  size = 'compact',
  streak,
  avatars = ['🧑'],
}: Props) {
  const t = getTheme(theme);

  return (
    <Pressable onPress={onToggle} style={styles.pressable}>
      <View style={[styles.card, size === 'featured' ? styles.featured : styles.compact]}>
        <GradientBackground colors={t.gradient} radius={RADIUS} angle={135} />

        <View style={styles.topRow}>
          <View style={[styles.iconBubble, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>

          <View style={styles.topRight}>
            <View style={styles.avatarRow}>
              {avatars.slice(0, 2).map((a, i) => (
                <Avatar
                  key={i}
                  emoji={a}
                  size={22}
                  style={{ marginLeft: i === 0 ? 0 : -8 }}
                  background="#1A1F26"
                />
              ))}
            </View>

            <View
              style={[
                styles.checkBubble,
                completedToday && { backgroundColor: t.accent, borderColor: t.accent },
              ]}
            >
              <Text
                style={[
                  styles.checkText,
                  completedToday && { color: '#0B0F14' },
                ]}
              >
                ✓
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.bottom}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {subtitle}
          </Text>

          <View style={styles.progressRow}>
            <View style={styles.dotsRow}>
              {week.map((done, i) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: done ? t.progress : t.progressEmpty,
                      flex: 1,
                    },
                  ]}
                />
              ))}
            </View>
            {size === 'featured' && typeof streak === 'number' && streak > 0 && (
              <View style={styles.streakPill}>
                <Text style={styles.streakText}>🔥 {streak}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  card: {
    borderRadius: RADIUS,
    padding: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  featured: {
    minHeight: 168,
    justifyContent: 'space-between',
  },
  compact: {
    minHeight: 188,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  avatarRow: {
    flexDirection: 'row',
  },
  checkBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.18)',
  },
  checkText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 16,
  },
  bottom: {
    marginTop: 24,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
  },
  progressRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dotsRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 5,
    height: 8,
  },
  dot: {
    height: 8,
    borderRadius: 3,
  },
  streakPill: {
    paddingHorizontal: 0,
  },
  streakText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
