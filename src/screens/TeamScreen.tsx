import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSessionStore } from '../store/sessionStore';
import {
  subscribeMyGroups,
  createGroup,
  joinGroupByCode,
  TeamError,
  type TeamGroup,
} from '../services/teamService';

type Props = NativeStackScreenProps<RootStackParamList, 'Team'>;

export default function TeamScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const userId = useSessionStore(s => s.userId);
  const isAuthenticated = useSessionStore(s => s.isAuthenticated);

  const [groups, setGroups] = useState<TeamGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const unsub = subscribeMyGroups(userId, gs => {
      setGroups(gs);
      setLoading(false);
    });
    return unsub;
  }, [userId]);

  const handleCreate = async () => {
    if (busy || !userId) {
      return;
    }
    if (name.trim().length < 2) {
      Alert.alert('Название', 'Введи название команды (минимум 2 символа).');
      return;
    }
    setBusy(true);
    try {
      const group = await createGroup(name, userId);
      setName('');
      navigation.navigate('TeamDetail', { groupId: group.id });
    } catch (err) {
      Alert.alert('Ошибка', err instanceof TeamError ? err.message : 'Не удалось.');
    } finally {
      setBusy(false);
    }
  };

  const handleJoin = async () => {
    if (busy || !userId) {
      return;
    }
    if (code.trim().length < 4) {
      Alert.alert('Код', 'Введи код приглашения.');
      return;
    }
    setBusy(true);
    try {
      const group = await joinGroupByCode(code, userId);
      setCode('');
      navigation.navigate('TeamDetail', { groupId: group.id });
    } catch (err) {
      Alert.alert('Ошибка', err instanceof TeamError ? err.message : 'Не удалось.');
    } finally {
      setBusy(false);
    }
  };

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
          <Text style={styles.title}>Команды</Text>
          <Text style={styles.subtitle}>Держите привычки вместе</Text>
        </View>
      </View>

      {!isAuthenticated ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Нужен аккаунт</Text>
          <Text style={styles.emptySubtitle}>
            Войди в аккаунт, чтобы создавать команды и отслеживать друзей.
          </Text>
          <Pressable
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Auth')}
          >
            <Text style={styles.primaryButtonText}>Войти</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Create */}
          <Text style={styles.sectionTitle}>Создать команду</Text>
          <View style={styles.actionRow}>
            <TextInput
              style={styles.input}
              placeholder="Название команды"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={name}
              onChangeText={setName}
              editable={!busy}
            />
            <Pressable
              style={[styles.smallButton, busy && styles.disabled]}
              onPress={handleCreate}
              disabled={busy}
            >
              <Text style={styles.smallButtonText}>Создать</Text>
            </Pressable>
          </View>

          {/* Join */}
          <Text style={[styles.sectionTitle, styles.spaced]}>
            Вступить по коду
          </Text>
          <View style={styles.actionRow}>
            <TextInput
              style={styles.input}
              placeholder="Код приглашения"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={code}
              onChangeText={t => setCode(t.toUpperCase())}
              autoCapitalize="characters"
              autoCorrect={false}
              editable={!busy}
            />
            <Pressable
              style={[styles.smallButton, busy && styles.disabled]}
              onPress={handleJoin}
              disabled={busy}
            >
              <Text style={styles.smallButtonText}>Войти</Text>
            </Pressable>
          </View>

          {/* My groups */}
          <Text style={[styles.sectionTitle, styles.spaced]}>Мои команды</Text>
          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginTop: 16 }} />
          ) : groups.length === 0 ? (
            <Text style={styles.hint}>
              Пока нет команд. Создай свою или вступи по коду.
            </Text>
          ) : (
            groups.map(g => (
              <Pressable
                key={g.id}
                style={styles.groupCard}
                onPress={() =>
                  navigation.navigate('TeamDetail', { groupId: g.id })
                }
              >
                <View style={{ flex: 1 }}>
                  <Text style={styles.groupName}>{g.name}</Text>
                  <Text style={styles.groupMeta}>
                    {g.memberUids.length}{' '}
                    {g.memberUids.length === 1 ? 'участник' : 'участников'}
                  </Text>
                </View>
                <Text style={styles.groupArrow}>›</Text>
              </Pressable>
            ))
          )}
        </ScrollView>
      )}
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
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  spaced: { marginTop: 26 },
  actionRow: { flexDirection: 'row', gap: 10 },
  input: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  smallButton: {
    height: 50,
    paddingHorizontal: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  smallButtonText: { color: '#000', fontWeight: '700', fontSize: 15 },
  disabled: { opacity: 0.5 },
  hint: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 },
  groupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  groupName: { color: '#fff', fontSize: 16, fontWeight: '700' },
  groupMeta: { color: 'rgba(255,255,255,0.55)', fontSize: 13, marginTop: 3 },
  groupArrow: { color: '#fff', fontSize: 26, marginLeft: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  emptySubtitle: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 20,
  },
  primaryButton: {
    height: 50,
    paddingHorizontal: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  primaryButtonText: { color: '#000', fontWeight: '700', fontSize: 16 },
});
