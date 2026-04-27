import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GradientBackground from '../components/GradientBackground';
import { useOnboardingStore } from '../store/onboardingStore';
import { getTheme } from '../utils/habitTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingHabits'>;

export default function OnboardingHabitsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [customTitle, setCustomTitle] = React.useState('');
  const habits = useOnboardingStore(state => state.habits);
  const selectedHabits = useOnboardingStore(state => state.selectedHabits);
  const toggleHabit = useOnboardingStore(state => state.toggleHabit);
  const addCustomHabit = useOnboardingStore(state => state.addCustomHabit);
  const isNextDisabled = selectedHabits.length === 0;

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => {
    setIsModalVisible(false);
    setCustomTitle('');
  };
  const handleAddCustomHabit = () => {
    const title = customTitle.trim();
    if (!title) return;
    addCustomHabit(title);
    closeModal();
  };

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

      <Text style={styles.title}>Выбери привычки</Text>
      <Text style={styles.subtitle}>До 3 — это поможет начать</Text>
      <Text style={styles.counter}>
        Выбрано {selectedHabits.length} из 3
      </Text>

      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {habits.map(habit => {
          const isSelected = selectedHabits.includes(habit.id);
          const t = getTheme(habit.theme);
          return (
            <Pressable
              key={habit.id}
              onPress={() => toggleHabit(habit.id)}
              style={[
                styles.card,
                isSelected && { borderColor: t.accent, borderWidth: 2 },
              ]}
            >
              <GradientBackground colors={t.gradient} radius={18} angle={135} />
              <View style={styles.iconBubble}>
                <Text style={styles.iconText}>{habit.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{habit.title}</Text>
                <Text style={styles.cardSubtitle}>{habit.subtitle}</Text>
              </View>
              <View
                style={[
                  styles.checkBubble,
                  isSelected && {
                    backgroundColor: t.accent,
                    borderColor: t.accent,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.checkText,
                    isSelected && { color: '#000000' },
                  ]}
                >
                  ✓
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      <Pressable style={styles.addButton} onPress={openModal}>
        <Text style={styles.addButtonText}>+ Добавить свою</Text>
      </Pressable>

      <Pressable
        disabled={isNextDisabled}
        style={[styles.nextButton, isNextDisabled && styles.nextButtonDisabled]}
        onPress={() => navigation.navigate('OnboardingReminders')}
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

      <Modal visible={isModalVisible} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <Text style={styles.modalTitle}>Новая привычка</Text>
            <TextInput
              value={customTitle}
              onChangeText={setCustomTitle}
              placeholder="Например: Пробежка"
              placeholderTextColor="#6B7483"
              style={styles.modalInput}
            />
            <View style={styles.modalActions}>
              <Pressable style={styles.modalButton} onPress={closeModal}>
                <Text style={styles.modalButtonText}>Отмена</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.modalButtonPrimary,
                  customTitle.trim().length === 0 && styles.modalButtonDisabled,
                ]}
                disabled={customTitle.trim().length === 0}
                onPress={handleAddCustomHabit}
              >
                <Text style={styles.modalButtonPrimaryText}>Добавить</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
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
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
  },
  counter: {
    marginTop: 4,
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 14,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 6,
    gap: 10,
  },
  card: {
    minHeight: 76,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  checkBubble: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: {
    color: 'rgba(255,255,255,0.5)',
    fontWeight: '800',
    fontSize: 13,
  },
  addButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    marginTop: 10,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  modalCard: {
    backgroundColor: '#0F0F12',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 16,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalButtonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  modalButtonPrimaryText: {
    color: '#000000',
    fontWeight: '700',
  },
  modalButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
});
