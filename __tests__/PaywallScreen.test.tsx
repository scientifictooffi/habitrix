import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

import PaywallScreen from '../src/screens/PaywallScreen';
import { useSubscriptionStore } from '../src/store/subscriptionStore';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

describe('PaywallScreen', () => {
  beforeEach(() => {
    useSubscriptionStore.setState({ isPremium: false });
  });

  it('activates local Premium and returns to the previous screen', async () => {
    const goBack = jest.fn();
    let renderer!: ReactTestRenderer.ReactTestRenderer;

    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(
        <PaywallScreen
          navigation={{ goBack } as never}
          route={{
            key: 'Paywall-test',
            name: 'Paywall',
            params: { source: 'dashboard_add' },
          }}
        />,
      );
    });

    const activationLabel = renderer.root.findByProps({
      children: 'Включить локальный Premium',
    });
    let activationButton: ReactTestRenderer.ReactTestInstance | null =
      activationLabel;
    while (
      activationButton &&
      typeof activationButton.props.onPress !== 'function'
    ) {
      activationButton = activationButton.parent;
    }

    await ReactTestRenderer.act(() => {
      activationButton?.props.onPress();
    });

    expect(useSubscriptionStore.getState().isPremium).toBe(true);
    expect(goBack).toHaveBeenCalledTimes(1);
  });
});
