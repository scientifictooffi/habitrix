import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSessionStore } from '../store/sessionStore';
import {
  subscribeMyGroups,
  subscribeGroupMembers,
  publishProgress,
  leaveGroup,
  TeamError,
  type TeamGroup,
  type MemberProgress,
} from '../services/teamService';
import { buildMyProgress } from '../utils/teamProgress';

type Props = NativeStackScreenProps<RootStackParamList, 'TeamDetail'>;

export default function TeamDetailScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { groupId } = route.params;
  const userId = useSessionStore(s => s.userId);

  const [group, setGroup] = useState<TeamGroup | null>(null);
  const [members, setMembers] = useState<MemberProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Track the group (name, code, members) live.
  useEffect(() => {
    if (!userId) {
      return;
    }
    const unsub = subscribeMyGroups(userId, gs => {
      const found = gs.find(g => g.id === groupId) ?? null;
      setGroup(found);
      // If we are no longer a member (left/removed), go back.
      if (!found) {
        navigation.goBack();
      }
    });
    return unsub;
  }, [userId, groupId, navigation]);

  // Track member progress cards.
  useEffect(() => {
    const unsub = subscribeGroupMembers(groupId, ms => {
      setMembers(ms);
      setLoading(false);
    });
    return unsub;
  }, [groupId]);

  // Publish own progress on entry so we show up immediately.
  useEffect(() => {
    if (userId) {
      publishProgress(groupId, buildMyProgress(userId)).catch(() => {});
    }
  }, [userId, groupId]);

  const handleShare = async () => {
    if (!group) {
      return;
    }
    try {
      await Share.share({
        message: `Вступай в мою команду «${group.name}» в Habitrix. Код: ${group.inviteCode}`,
      });
    } catch {
      // user dismissed the share sheet
    }
  };

  const handleLeave = () => {
    if (!userId) {
      return;
    }
    Alert.alert('Выйти из команды?', 'Твой прогресс перестанет быть виден участникам.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Выйти',
        style: 'destructive',
        onPress: async () => {
          try {
            await leaveGroup(groupId, userId);
            navigation.goBack();
          } catch (err) {
            Alert.alert(
              'Ошибка',
              err instanceof TeamError ? err.message : 'Не удалось выйти.',
            );
          }
        },
      },
    ]);
  };

  const sortedMembers = [...members].sort((a, b) => b.streak - a.streak);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <View style={styles.headerRow}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹</Text>
        </Pressable>
        <View style={styles.headerText}>
          <Text style={styles.title} numberOfLines={1}>
            {group?.name ?? 'Команда'}
          </Text>
          <Text style={styles.subtitle}>
            {group ? `${group.memberUids.length} участн.` : ' '}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Invite code */}
        {group && (
          <View style={styles.inviteCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.inviteLabel}>Код приглашения</Text>
              <Text style={styles.inviteCode}>{group.inviteCode}</Text>
            </View>
            <Pressable style={styles.shareButton} onPress={handleShare}>
              <Text style={styles.shareButtonText}>Поделиться</Text>
            </Pressable>
          </View>
        )}

        <Text style={styles.sectionTitle}>Сегодня</Text>
        {loading ? (
          <ActivityIndicator color="#fff" style={{ marginTop: 16 }} />
        ) : sortedMembers.length === 0 ? (
          <Text style={styles.hint}>Пока нет данных участников.</Text>
        ) : (
          sortedMembers.map(m => {
            const isMe = m.uid === userId;
            const done = m.todayTotal > 0 && m.todayDone >= m.todayTotal;
            return (
              <View key={m.uid} style={styles.memberRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {(m.displayName ?? '?').charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.memberName}>
                    {m.displayName ?? 'Участник'}
                    {isMe ? ' (ты)' : ''}
                  </Text>
                  <Text style={styles.memberMeta}>
                    Сегодня: {m.todayDone}/{m.todayTotal}
                    {done ? ' ✅' : ''}
                  </Text>
                </View>
                <View style={styles.streakBadge}>
                  <Text style={styles.streakText}>🔥 {m.streak}</Text>
                </View>
              </View>
            );
          })
        )}

        <Pressable style={styles.leaveButton} onPress={handleLeave}>
          <Text style={styles.leaveButtonText}>Выйти из команды</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000', paddingHorizontal: 18 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  headerText: { flex: 1 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { color: '#fff', fontSize: 22, lineHeight: 22, fontWeight: '600' },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', letterSpacing: -0.3 },
  subtitle: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 },
  scroll: { paddingBottom: 32, paddingHorizontal: 4 },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 26,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inviteLabel: { color: 'rgba(255,255,255,0.55)', fontSize: 13 },
  inviteCode: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 3,
    marginTop: 4,
  },
  shareButton: {
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  shareButtonText: { color: '#000', fontWeight: '700', fontSize: 14 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  hint: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  memberName: { color: '#fff', fontSize: 15, fontWeight: '700' },
  memberMeta: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 2 },
  streakBadge: {
    paddingHorizontal: 12,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  streakText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  leaveButton: {
    marginTop: 24,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.45)',
    backgroundColor: 'rgba(255,80,80,0.08)',
  },
  leaveButtonText: { color: '#FF6B6B', fontSize: 15, fontWeight: '700' },
});
