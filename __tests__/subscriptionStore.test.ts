import AsyncStorage from '@react-native-async-storage/async-storage';

import { useSubscriptionStore } from '../src/store/subscriptionStore';

describe('subscriptionStore', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useSubscriptionStore.setState({ isPremium: false });
  });

  it('activates dev premium', () => {
    useSubscriptionStore.getState().activateDevPremium();

    expect(useSubscriptionStore.getState().isPremium).toBe(true);
  });

  it('does not activate dev premium in production', () => {
    const originalDev = __DEV__;
    let productionModule:
      | typeof import('../src/store/subscriptionStore')
      | undefined;

    try {
      Object.defineProperty(globalThis, '__DEV__', {
        configurable: true,
        value: false,
      });
      jest.isolateModules(() => {
        productionModule = require('../src/store/subscriptionStore');
      });

      expect(productionModule?.isDevPremiumAvailable).toBe(false);
      productionModule?.useSubscriptionStore
        .getState()
        .activateDevPremium();
      expect(productionModule?.useSubscriptionStore.getState().isPremium).toBe(
        false,
      );
    } finally {
      Object.defineProperty(globalThis, '__DEV__', {
        configurable: true,
        value: originalDev,
      });
    }
  });

  it('deactivates dev premium', () => {
    useSubscriptionStore.getState().activateDevPremium();
    useSubscriptionStore.getState().deactivateDevPremium();

    expect(useSubscriptionStore.getState().isPremium).toBe(false);
  });

  it('resets the subscription', () => {
    useSubscriptionStore.getState().activateDevPremium();
    useSubscriptionStore.getState().resetSubscription();

    expect(useSubscriptionStore.getState().isPremium).toBe(false);
  });

  it('restores an active local premium subscription', async () => {
    useSubscriptionStore.getState().activateDevPremium();

    await expect(
      useSubscriptionStore.getState().restorePurchases(),
    ).resolves.toBe('restored');
  });

  it('reports when no local premium subscription is found', async () => {
    await expect(
      useSubscriptionStore.getState().restorePurchases(),
    ).resolves.toBe('not_found');
  });
});
