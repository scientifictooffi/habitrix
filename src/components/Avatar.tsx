import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';

type Props = {
  emoji: string;
  size?: number;
  style?: ViewStyle | ViewStyle[];
  background?: string;
  border?: boolean;
};

export default function Avatar({
  emoji,
  size = 22,
  style,
  background = 'rgba(255,255,255,0.08)',
  border = true,
}: Props) {
  return (
    <View
      style={[
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: background,
          borderWidth: border ? 1.5 : 0,
        },
        style,
      ]}
    >
      <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(0,0,0,0.55)',
  },
});
