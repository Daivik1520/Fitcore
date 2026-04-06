import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const SIZE = 200;
const STROKE_WIDTH = 8;
const R = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

// Smart rest: adjust based on exercise difficulty and type
export function getSmartRestDuration(exercise, baseDuration = 60) {
  if (!exercise) return baseDuration;
  const difficulty = exercise.difficulty || 2;
  const isCompound = ['bodyweight_squat', 'burpee', 'jump_squat', 'bulgarian_split_squat', 'pushup', 'inverted_row'].includes(exercise.id);

  if (isCompound) {
    return Math.min(120, baseDuration + (difficulty * 10));
  }
  if (exercise.isHold) {
    return Math.max(30, baseDuration - 15);
  }
  // Isolation / simple exercises
  return Math.max(30, baseDuration - (5 - difficulty) * 5);
}

export default function RestTimer({ visible, duration = 60, nextExerciseName, onComplete, onSkip, exerciseData }) {
  // Use smart duration if exercise data provided
  const smartDuration = exerciseData ? getSmartRestDuration(exerciseData, duration) : duration;
  const [remaining, setRemaining] = useState(smartDuration);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (visible) {
      const d = exerciseData ? getSmartRestDuration(exerciseData, duration) : duration;
      setRemaining(d);
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
            onComplete?.();
            return 0;
          }
          if (prev === 4) {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
          }
          if (prev % 10 === 0 && prev > 0) {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [visible, duration, exerciseData]);

  const totalDuration = exerciseData ? getSmartRestDuration(exerciseData, duration) : duration;
  const progress = remaining / totalDuration;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  if (!visible) return null;

  // Recovery zone label
  const getZoneLabel = () => {
    if (remaining > totalDuration * 0.6) return 'Active Recovery';
    if (remaining > totalDuration * 0.3) return 'Recovering...';
    return 'Almost Ready!';
  };

  const zoneColor = remaining > totalDuration * 0.6
    ? COLORS.secondary
    : remaining > totalDuration * 0.3
      ? COLORS.warning
      : COLORS.success;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
      }}>
        {/* Recovery zone */}
        <View style={{
          backgroundColor: zoneColor + '15',
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderRadius: RADIUS.pill,
          marginBottom: SPACING.lg,
        }}>
          <Text style={{ color: zoneColor, fontSize: 13, ...FONTS.bold }}>
            {getZoneLabel()}
          </Text>
        </View>

        <Text style={{ color: COLORS.textMuted, fontSize: 16, ...FONTS.medium, marginBottom: SPACING.md }}>
          REST
        </Text>

        <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
          <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
            <Circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              stroke={COLORS.surface2} strokeWidth={STROKE_WIDTH} fill="none"
            />
            <Circle
              cx={SIZE / 2} cy={SIZE / 2} r={R}
              stroke={remaining <= 3 ? COLORS.secondary : COLORS.primary}
              strokeWidth={STROKE_WIDTH} fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>
          <Text style={{ color: COLORS.text, fontSize: 56, ...FONTS.bold }}>
            {remaining}
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular }}>
            seconds
          </Text>
        </View>

        {/* Smart rest info */}
        {exerciseData && (
          <Text style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.regular, marginTop: SPACING.sm }}>
            Smart rest: adjusted for exercise difficulty
          </Text>
        )}

        {nextExerciseName && (
          <View style={{ marginTop: SPACING.xl, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textFaint, fontSize: 14, ...FONTS.regular }}>
              Next exercise
            </Text>
            <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginTop: 4 }}>
              {nextExerciseName}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            onSkip?.();
          }}
          style={{
            marginTop: SPACING.xxl,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface2,
            paddingHorizontal: SPACING.lg,
            paddingVertical: SPACING.md,
            borderRadius: RADIUS.pill,
          }}
        >
          <Ionicons name="play-skip-forward" size={18} color={COLORS.text} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.medium, marginLeft: SPACING.sm }}>
            Skip Rest
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
