import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

type Props = {
  colors: [string, string];
  style?: ViewStyle | ViewStyle[];
  /** corner radius (px) */
  radius?: number;
  /** Diagonal direction in degrees: 0 = top-bottom, 135 = top-left → bottom-right (default) */
  angle?: number;
};

/**
 * Absolutely positioned linear gradient fill, mounted as the
 * first child inside a relatively-positioned parent.
 */
export default function GradientBackground({
  colors,
  style,
  radius = 0,
  angle = 135,
}: Props) {
  const rad = (angle * Math.PI) / 180;
  const x1 = 0.5 - 0.5 * Math.cos(rad);
  const y1 = 0.5 - 0.5 * Math.sin(rad);
  const x2 = 0.5 + 0.5 * Math.cos(rad);
  const y2 = 0.5 + 0.5 * Math.sin(rad);

  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { borderRadius: radius, overflow: 'hidden' }, style]}
    >
      <Svg width="100%" height="100%">
        <Defs>
          <LinearGradient id="g" x1={x1} y1={y1} x2={x2} y2={y2}>
            <Stop offset="0" stopColor={colors[0]} stopOpacity={1} />
            <Stop offset="1" stopColor={colors[1]} stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#g)" />
      </Svg>
    </View>
  );
}
