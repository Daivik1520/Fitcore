import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Animated as RNAnimated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const SIZE = 280;
const STROKE_WIDTH = 14;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StepRing({ steps = 0, goal = 10000 }) {
  const [displaySteps, setDisplaySteps] = useState(0);
  const [dashOffset, setDashOffset] = useState(CIRCUMFERENCE);
  const animRef = useRef(null);
  const goalReached = steps >= goal;
  const scaleAnim = useRef(new RNAnimated.Value(1)).current;

  useEffect(() => {
    // Animate step count
    const startVal = displaySteps;
    const diff = steps - startVal;
    const duration = 800;
    const startTime = Date.now();

    if (animRef.current) cancelAnimationFrame(animRef.current);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startVal + diff * eased);
      setDisplaySteps(current);

      // Update ring
      const ringProgress = Math.min(current / goal, 1);
      setDashOffset(CIRCUMFERENCE * (1 - ringProgress));

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [steps, goal]);

  useEffect(() => {
    if (goalReached) {
      RNAnimated.sequence([
        RNAnimated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true, tension: 80, friction: 4 }),
        RNAnimated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, tension: 100, friction: 8 }),
      ]).start();
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    }
  }, [goalReached]);

  return (
    <RNAnimated.View style={{ alignItems: 'center', justifyContent: 'center', transform: [{ scale: scaleAnim }] }}>
      <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
          <Defs>
            <LinearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={goalReached ? COLORS.gold : COLORS.primary} />
              <Stop offset="1" stopColor={goalReached ? '#FFE066' : COLORS.success} />
            </LinearGradient>
          </Defs>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke={COLORS.surface2}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            stroke="url(#ringGrad)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${SIZE / 2}, ${SIZE / 2}`}
          />
        </Svg>

        <View style={{ alignItems: 'center' }}>
          <Text style={{
            color: goalReached ? COLORS.gold : COLORS.text,
            fontSize: 48,
            ...FONTS.bold,
          }}>
            {displaySteps.toLocaleString()}
          </Text>
          <Text style={{
            color: COLORS.textMuted,
            fontSize: 16,
            ...FONTS.regular,
            marginTop: 4,
          }}>
            / {goal.toLocaleString()} steps
          </Text>
          {goalReached && (
            <Text style={{
              color: COLORS.gold,
              fontSize: 14,
              ...FONTS.bold,
              marginTop: SPACING.xs,
            }}>
              Goal reached!
            </Text>
          )}
        </View>
      </View>
    </RNAnimated.View>
  );
}
