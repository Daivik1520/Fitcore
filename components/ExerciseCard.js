import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, CARD } from '../constants/theme';
import exerciseData from '../data/exercises';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ExerciseAnimation from './ExerciseAnimation';
import ExerciseNotes from './ExerciseNotes';

export default function ExerciseCard({
  exercise,
  index,
  isActive,
  isCompleted,
  onStartSet,
  currentSet,
  totalSets,
}) {
  const [lastPerformance, setLastPerformance] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const ex = exerciseData[exercise.id];

  useEffect(() => {
    loadLastPerformance();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1, duration: 400, delay: index * 50, useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0, duration: 400, delay: index * 50, useNativeDriver: true,
      }),
    ]).start();
  }, [exercise.id]);

  const loadLastPerformance = async () => {
    try {
      const recordsStr = await AsyncStorage.getItem('exercise_records');
      const records = recordsStr ? JSON.parse(recordsStr) : {};
      setLastPerformance(records[exercise.id] || null);
    } catch {}
  };

  if (!ex) return null;

  const holdLabel = exercise.isHold ? `${exercise.reps}s hold` : `${exercise.reps} reps`;

  return (
    <Animated.View
      style={{
        ...CARD,
        marginBottom: SPACING.sm,
        opacity: isCompleted ? 0.6 : fadeAnim,
        borderColor: isActive ? COLORS.primary : COLORS.border,
        borderWidth: isActive ? 2 : 1,
        transform: [{ translateY: slideAnim }],
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs }}>
            <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold }}>
              {ex.name}
            </Text>
            {isCompleted && (
              <Ionicons name="checkmark-circle" size={20} color={COLORS.success} style={{ marginLeft: 8 }} />
            )}
          </View>

          <View style={{
            backgroundColor: COLORS.surface2,
            paddingHorizontal: SPACING.sm, paddingVertical: 2,
            borderRadius: RADIUS.pill, alignSelf: 'flex-start', marginBottom: SPACING.sm,
          }}>
            <Text style={{ color: COLORS.primaryLight, fontSize: 11, ...FONTS.bold }}>
              {ex.muscleTag}
            </Text>
          </View>

          <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.medium }}>
            {exercise.sets} sets x {holdLabel}
          </Text>

          {lastPerformance ? (
            <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginTop: 4 }}>
              Last time: {lastPerformance.bestReps} {exercise.isHold ? 's' : 'reps'}
            </Text>
          ) : (
            <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginTop: 4 }}>
              First time! Give it your best
            </Text>
          )}

          {/* Personal notes */}
          <ExerciseNotes exerciseId={exercise.id} />
        </View>

        {/* Animated exercise demo */}
        <View style={{
          width: 64, height: 64, borderRadius: RADIUS.card,
          backgroundColor: COLORS.surface2,
          alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}>
          <ExerciseAnimation
            muscleGroup={ex.muscleGroup}
            size={64}
            isActive={isActive}
          />
        </View>
      </View>

      {isActive && !isCompleted && (
        <TouchableOpacity
          onPress={onStartSet}
          style={{
            backgroundColor: COLORS.primary, height: 44,
            borderRadius: RADIUS.button, alignItems: 'center', justifyContent: 'center',
            marginTop: SPACING.md,
          }}
        >
          <Text style={{ color: COLORS.text, fontSize: 15, ...FONTS.bold }}>
            {currentSet > 1 ? `Start Set ${currentSet} of ${totalSets}` : 'Start Set'}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}
