import React from 'react';
import { ScrollView,Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';


type Props = NativeStackScreenProps<RootStackParamList, 'OnboardingHabits'>;

export default function OnboardingHabitsScreen({ navigation }: Props) {
  const [selectedHabits, setSelectedHabits] = React.useState<string[]>([]);
  const insets = useSafeAreaInsets();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [customTitle, setCustomTitle] = React.useState('');
  const [habits, setHabits] = React.useState([
    { id: 'water', title: 'Drink water', subtitle: '8 glasses a day' },
    { id: 'steps', title: '8,000 steps', subtitle: 'Daily walk' },
    { id: 'reading', title: 'Read 20 min', subtitle: 'Books or articles' },
    { id: 'sleep', title: 'Sleep before 23:00', subtitle: 'Healthy rest' },
    { id: 'meditation', title: 'Meditate', subtitle: '10 minutes' },
    { id: 'journal', title: 'Morning journal', subtitle: 'Write 3 lines' },
    { id: 'stretch', title: 'Stretching', subtitle: '5 minutes' },
    { id: 'sugar', title: 'No sugar', subtitle: 'Skip sweets today' },
  ]);
  const toggleHabit = (id: string) => {
    setSelectedHabits(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, id];
    });
  };
  const isNextDisabled = selectedHabits.length !== 3;

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => {setIsModalVisible(false);setCustomTitle('');};

  const addCustomHabit = () => {
    const title = customTitle.trim();
    if (!title) return;

    const newHabit = {
      id: `custom-${Date.now()}`,
      title,
      subtitle: 'Custom habit',
    };

    setHabits(prev => [newHabit, ...prev]);

    setSelectedHabits(prev =>
      prev.length < 3 ? [...prev, newHabit.id] : prev,
    );

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
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Назад</Text>
        </Pressable>
      </View>
      <Text style={styles.title}>Выбери 3 привычки</Text>
      <Text style={styles.subtitle}>
        Это поможет настроить твой первый трекер
      </Text>
      <Text style={styles.subtitle}>Выбрано {selectedHabits.length} из 3</Text>
      <ScrollView
        style={styles.listScroll}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.list}>
          {habits.map(habit => {
            const isSelected = selectedHabits.includes(habit.id);

            return (
              <Pressable
                key={habit.id}
                onPress={() => toggleHabit(habit.id)}
                style={[styles.card, isSelected && styles.cardSelected]}
              >
                <Text style={styles.cardTitle}>{habit.title}</Text>
                <Text style={styles.cardSubtitle}>{habit.subtitle}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
        <Pressable style={styles.addButton} onPress={openModal}>
          <Text style={styles.addButtonText}>Добавить свою</Text>
        </Pressable>

        <Pressable
          disabled={isNextDisabled}
          style={[
            styles.nextButton,
            isNextDisabled && styles.nextButtonDisabled,
          ]}
          onPress={() => navigation.navigate('OnboardingReminders')}
        >
          <Text style={styles.nextButtonText}>Далее</Text>
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
                onPress={addCustomHabit}
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
    backgroundColor: '#0B0F14',
    paddingHorizontal: 24,
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 12,
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#F5F7FB',
  },
  subtitle: {
    marginTop: 3,
    fontSize: 15,
    color: '#9AA4B2',
    marginBottom: 6,
  },
  list: {
    gap: 8,
  },
  cardSelected: {
    borderColor: '#7C5CFF',
    backgroundColor: 'rgba(124, 92, 255, 0.12)',
  },
  nextButtonDisabled: {
    backgroundColor: '#2C3440',
  },
  card: {
    backgroundColor: '#141A22',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2C3440',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F5F7FB',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#9AA4B2',
    marginBottom: 8,
  },
  addButton: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#2C3440',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#F5F7FB',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    marginTop: 12,
    backgroundColor: '#7C5CFF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#0B0F14',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#141A22',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C3440',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F5F7FB',
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: '#0B0F14',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2C3440',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#F5F7FB',
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
    borderColor: '#2C3440',
  },
  modalButtonText: {
    color: '#F5F7FB',
    fontWeight: '600',
  },
  modalButtonPrimary: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: '#7C5CFF',
  },
  modalButtonPrimaryText: {
    color: '#0B0F14',
    fontWeight: '700',
  },
  modalButtonDisabled: {
    backgroundColor: '#2C3440',
  },
});
