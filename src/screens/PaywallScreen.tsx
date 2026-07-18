import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { FREE_HABIT_LIMIT } from '../constants/habitLimits';
import {
  isDevPremiumAvailable,
  useSubscriptionStore,
} from '../store/subscriptionStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

export default function PaywallScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const isPremium = useSubscriptionStore(state => state.isPremium);
  const activateDevPremium = useSubscriptionStore(
    state => state.activateDevPremium,
  );
  const restorePurchases = useSubscriptionStore(
    state => state.restorePurchases,
  );
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [isRestoring, setIsRestoring] = React.useState(false);

  const handleActivate = () => {
    activateDevPremium();
    navigation.goBack();
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    setFeedback(null);
    try {
      const result = await Promise.resolve(restorePurchases());
      if (result === 'not_found') {
        setFeedback(
          'Покупки не найдены. В этой сборке Premium можно включить только локально.',
        );
      } else {
        setFeedback('Premium восстановлен.');
      }
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12 },
      ]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Закрыть"
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={styles.closeText}>×</Text>
        </Pressable>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>PREMIUM</Text>
        </View>
        <Text style={styles.title}>Привычки без лимита</Text>
        <Text style={styles.subtitle}>
          Бесплатно можно вести до {FREE_HABIT_LIMIT} привычек. Premium снимает
          ограничение — добавляй столько, сколько нужно.
        </Text>

        <View style={styles.comparison}>
          <View style={styles.planRow}>
            <Text style={styles.planName}>Бесплатно</Text>
            <Text style={styles.planValue}>
              до {FREE_HABIT_LIMIT} привычек
            </Text>
          </View>
          <View style={[styles.planRow, styles.premiumRow]}>
            <Text style={styles.planName}>Premium</Text>
            <Text style={styles.premiumValue}>без лимита</Text>
          </View>
        </View>

        {isPremium ? (
          <View style={styles.activeCard}>
            <Text style={styles.activeTitle}>Premium уже активен</Text>
            <Text style={styles.activeHint}>
              Ограничение на количество привычек снято.
            </Text>
          </View>
        ) : isDevPremiumAvailable ? (
          <Pressable style={styles.primaryButton} onPress={handleActivate}>
            <Text style={styles.primaryButtonText}>
              Включить локальный Premium
            </Text>
            <Text style={styles.primaryButtonHint}>
              DEV-РЕЖИМ · НЕ НАСТОЯЩАЯ ПОКУПКА
            </Text>
          </Pressable>
        ) : (
          <View style={styles.unavailableCard}>
            <Text style={styles.unavailableText}>
              Покупки пока не настроены.
            </Text>
          </View>
        )}

        <Pressable
          disabled={isRestoring}
          style={[
            styles.secondaryButton,
            isRestoring && styles.buttonDisabled,
          ]}
          onPress={handleRestore}
        >
          <Text style={styles.secondaryButtonText}>
            {isRestoring ? 'Проверяем…' : 'Восстановить'}
          </Text>
        </Pressable>

        {feedback && <Text style={styles.feedback}>{feedback}</Text>}

        <Pressable style={styles.laterButton} onPress={() => navigation.goBack()}>
          <Text style={styles.laterButtonText}>Не сейчас</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 22,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 25,
    lineHeight: 27,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(190,255,80,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(190,255,80,0.35)',
    marginBottom: 16,
  },
  badgeText: {
    color: '#C9FF72',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
  },
  comparison: {
    marginTop: 28,
    gap: 10,
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  premiumRow: {
    borderColor: 'rgba(190,255,80,0.32)',
    backgroundColor: 'rgba(190,255,80,0.08)',
  },
  planName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  planValue: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
  },
  premiumValue: {
    color: '#C9FF72',
    fontSize: 14,
    fontWeight: '700',
  },
  primaryButton: {
    marginTop: 28,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
  },
  primaryButtonHint: {
    color: 'rgba(0,0,0,0.52)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  unavailableCard: {
    marginTop: 28,
    borderRadius: 17,
    padding: 16,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  unavailableText: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 14,
    textAlign: 'center',
  },
  activeCard: {
    marginTop: 28,
    borderRadius: 17,
    padding: 16,
    backgroundColor: 'rgba(190,255,80,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(190,255,80,0.3)',
  },
  activeTitle: {
    color: '#C9FF72',
    fontSize: 16,
    fontWeight: '800',
  },
  activeHint: {
    color: 'rgba(255,255,255,0.62)',
    fontSize: 13,
    marginTop: 4,
  },
  secondaryButton: {
    marginTop: 12,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  feedback: {
    color: 'rgba(255,255,255,0.62)',
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 12,
  },
  laterButton: {
    alignItems: 'center',
    paddingVertical: 15,
    marginTop: 2,
  },
  laterButtonText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    fontWeight: '600',
  },
});
