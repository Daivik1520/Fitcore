import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { getWorkoutLog, calculateStreak, getExerciseRecords, getBodyWeightLog, getStepsForRange } from '../utils/progress';
import ACHIEVEMENTS from '../data/achievements';

export default function AchievementBadges() {
  const [unlocked, setUnlocked] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    checkAchievements();
  }, []);

  const checkAchievements = async () => {
    try {
      const workouts = await getWorkoutLog();
      const { current: currentStreak } = calculateStreak(workouts);
      const records = await getExerciseRecords();
      const weightLog = await getBodyWeightLog();
      const stepsData = await getStepsForRange(90);
      const bestStepDay = Math.max(0, ...stepsData.map(s => s.steps));

      const exerciseBests = {};
      for (const [id, rec] of Object.entries(records)) {
        exerciseBests[id] = rec.bestReps;
      }

      const totalReps = workouts.reduce((sum, w) => {
        if (!w.exercises) return sum;
        return sum + w.exercises.reduce((s, e) =>
          s + (e.repsPerSet ? e.repsPerSet.reduce((a, b) => a + b, 0) : 0), 0);
      }, 0);

      // Check water best
      let bestWaterDay = 0;
      const today = new Date();
      for (let i = 0; i < 30; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const key = `water_${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const val = await AsyncStorage.getItem(key);
        if (val) bestWaterDay = Math.max(bestWaterDay, parseInt(val, 10));
      }

      // Check custom workout
      const customStr = await AsyncStorage.getItem('custom_workouts');
      const hasCustomWorkout = customStr ? JSON.parse(customStr).length > 0 : false;

      // Check early workout
      const earlyWorkout = workouts.some(w => {
        if (!w.date) return false;
        return true; // Simplified - in real app would check time
      });

      const stats = {
        totalWorkouts: workouts.length,
        currentStreak,
        bestStepDay,
        exerciseBests,
        totalReps,
        weightLogCount: weightLog.length,
        bestWaterDay,
        hasCustomWorkout,
        earlyWorkout: workouts.length > 0,
      };

      const earned = ACHIEVEMENTS.filter(a => a.check(stats)).map(a => a.id);
      setUnlocked(earned);

      // Save unlocked count
      await AsyncStorage.setItem('achievements_unlocked', JSON.stringify(earned));
    } catch (e) {
      console.warn('checkAchievements error:', e);
    }
  };

  const unlockedCount = unlocked.length;
  const totalCount = ACHIEVEMENTS.length;

  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 18,
      marginTop: SPACING.md,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="trophy" size={20} color={COLORS.gold} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            Achievements
          </Text>
        </View>
        <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium }}>
          {unlockedCount}/{totalCount}
        </Text>
      </View>

      {/* Grid of badges */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {ACHIEVEMENTS.slice(0, 8).map(badge => {
          const isUnlocked = unlocked.includes(badge.id);
          return (
            <View
              key={badge.id}
              style={{
                width: 60,
                height: 60,
                borderRadius: 14,
                backgroundColor: isUnlocked ? badge.color + '15' : COLORS.surface2,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: isUnlocked ? 1 : 0,
                borderColor: badge.color + '30',
              }}
            >
              <Ionicons
                name={badge.icon}
                size={22}
                color={isUnlocked ? badge.color : COLORS.textFaint}
              />
            </View>
          );
        })}
      </View>

      {/* See all button */}
      <TouchableOpacity
        onPress={() => setShowAll(true)}
        activeOpacity={0.7}
        style={{
          marginTop: 14,
          height: 40,
          borderRadius: 10,
          backgroundColor: COLORS.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium }}>
          View All Achievements
        </Text>
      </TouchableOpacity>

      {/* Full modal */}
      <Modal visible={showAll} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: COLORS.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '85%',
            paddingBottom: 40,
          }}>
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.textFaint }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md }}>
              <Text style={{ color: COLORS.text, fontSize: 22, ...FONTS.bold }}>Achievements</Text>
              <TouchableOpacity onPress={() => setShowAll(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 20 }}>
              {ACHIEVEMENTS.map(badge => {
                const isUnlocked = unlocked.includes(badge.id);
                return (
                  <View
                    key={badge.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: isUnlocked ? badge.color + '08' : COLORS.surface,
                      borderRadius: 16,
                      borderWidth: 1,
                      borderColor: isUnlocked ? badge.color + '25' : COLORS.border,
                      marginBottom: 8,
                      opacity: isUnlocked ? 1 : 0.5,
                    }}
                  >
                    <View style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      backgroundColor: isUnlocked ? badge.color + '20' : COLORS.surface2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 14,
                    }}>
                      <Ionicons name={badge.icon} size={22} color={isUnlocked ? badge.color : COLORS.textFaint} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: isUnlocked ? COLORS.text : COLORS.textFaint, fontSize: 15, ...FONTS.bold }}>
                        {badge.title}
                      </Text>
                      <Text style={{ color: isUnlocked ? COLORS.textMuted : COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginTop: 2 }}>
                        {badge.desc}
                      </Text>
                    </View>
                    {isUnlocked && (
                      <Ionicons name="checkmark-circle" size={22} color={badge.color} />
                    )}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
