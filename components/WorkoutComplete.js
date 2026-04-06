import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Share, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, BUTTON } from '../constants/theme';
import { MOTIVATIONAL_QUOTES } from '../data/programs';

export default function WorkoutComplete({ stats, onDone }) {
  const quote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleShare = async () => {
    try {
      const shareCard = `
━━━━━━━━━━━━━━━━━
   FITCORE WORKOUT
━━━━━━━━━━━━━━━━━

  ⏱  ${stats.duration} min
  💪 ${stats.totalSets} sets
  🔄 ${stats.totalReps} reps
  🔥 ${stats.totalCalories} cal burned

━━━━━━━━━━━━━━━━━
"${quote}"
━━━━━━━━━━━━━━━━━

Track your fitness with FitCore - 100% offline, no excuses.`;
      await Share.share({ message: shareCard });
    } catch {}
  };

  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.background,
      padding: SPACING.lg,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <ConfettiParticles />

      <Animated.View style={{ alignItems: 'center', opacity: fadeAnim }}>
        <Text style={{ fontSize: 64, marginBottom: SPACING.md }}>🎉</Text>
        <Text style={{ color: COLORS.text, fontSize: 28, ...FONTS.bold, textAlign: 'center' }}>
          Workout Complete!
        </Text>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginTop: SPACING.xl,
          gap: SPACING.md,
        }}>
          <StatBox icon="time-outline" label="Duration" value={`${stats.duration} min`} />
          <StatBox icon="layers-outline" label="Total Sets" value={stats.totalSets} />
          <StatBox icon="repeat-outline" label="Total Reps" value={stats.totalReps} />
          <StatBox icon="flame-outline" label="Calories" value={`${stats.totalCalories} cal`} color={COLORS.secondary} />
        </View>

        <View style={{ marginTop: SPACING.xl, paddingHorizontal: SPACING.lg }}>
          <Text style={{
            color: COLORS.textMuted,
            fontSize: 14,
            ...FONTS.regular,
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            "{quote}"
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleShare}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface2,
            paddingHorizontal: SPACING.lg,
            paddingVertical: SPACING.md,
            borderRadius: RADIUS.pill,
            marginTop: SPACING.xl,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons name="share-social-outline" size={18} color={COLORS.text} />
          <Text style={{ color: COLORS.text, fontSize: 14, ...FONTS.medium, marginLeft: SPACING.sm }}>
            Share Progress
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDone}
          style={{ ...BUTTON.primary, width: '100%', marginTop: SPACING.lg }}
        >
          <Text style={BUTTON.primaryText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

function StatBox({ icon, label, value, color = COLORS.primary }) {
  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: RADIUS.card,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: SPACING.md,
      width: 140,
      alignItems: 'center',
    }}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={{ color: COLORS.text, fontSize: 22, ...FONTS.bold, marginTop: SPACING.xs }}>
        {value}
      </Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.regular }}>
        {label}
      </Text>
    </View>
  );
}

function ConfettiParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => i);
  const colors = [COLORS.primary, COLORS.success, COLORS.secondary, COLORS.warning, COLORS.gold];

  return (
    <View style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
    }}>
      {particles.map((i) => (
        <ConfettiPiece key={i} index={i} color={colors[i % colors.length]} />
      ))}
    </View>
  );
}

function ConfettiPiece({ index, color }) {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const startX = Math.random() * 350;

  useEffect(() => {
    const delay = index * 100;
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 800,
        duration: 2500 + Math.random() * 1000,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: (Math.random() - 0.5) * 200,
        duration: 2500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        delay: delay + 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{
      position: 'absolute',
      left: startX,
      top: 0,
      width: 8,
      height: 8,
      borderRadius: index % 2 === 0 ? 4 : 1,
      backgroundColor: color,
      opacity,
      transform: [{ translateY }, { translateX }],
    }} />
  );
}
