import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../../constants/theme';
import { useStepCounter } from '../../hooks/useStepCounter';
import { getProfile } from '../../hooks/useStorage';
import { getStepsForRange, getWorkoutLog, calculateStreak } from '../../utils/progress';
import { calculateStepCalories, calculateDistance, calculateActiveMinutes } from '../../utils/calories';
import StepRing from '../../components/StepRing';
import WeeklyChart from '../../components/WeeklyChart';
import WaterTracker from '../../components/WaterTracker';
import DailyQuote from '../../components/DailyQuote';
import MoodTracker from '../../components/MoodTracker';
import WorkoutCalendar from '../../components/WorkoutCalendar';
import programs from '../../data/programs';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const { steps, isAvailable, permissionGranted, retryPermission, isExpoGo } = useStepCounter();
  const [profile, setProfile] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [streak, setStreak] = useState(0);
  const [nextWorkout, setNextWorkout] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const p = await getProfile();
    setProfile(p);

    const weekly = await getStepsForRange(7);
    setWeeklyData(weekly);

    const log = await getWorkoutLog();
    const { current } = calculateStreak(log);
    setStreak(current);

    try {
      const stateStr = await AsyncStorage.getItem('current_program_state');
      if (stateStr && p) {
        const state = JSON.parse(stateStr);
        const program = programs[state.programId];
        if (program) {
          const totalDays = program.phases.flatMap(ph => ph.days);
          const dayIndex = state.currentDayIndex % totalDays.length;
          const day = totalDays[dayIndex];
          if (day) {
            const estMin = day.exercises.length * 5 + (day.exercises.length - 1);
            setNextWorkout({ name: day.name, estMin, programName: program.name, emoji: program.emoji });
          }
        }
      }
    } catch {}
  };

  useFocusEffect(useCallback(() => { loadData(); }, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const goal = profile?.dailyStepGoal || 10000;
  const weightKg = profile?.weightKg || 70;
  const calories = calculateStepCalories(steps, weightKg);
  const distance = calculateDistance(steps);
  const activeMin = calculateActiveMinutes(steps);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 110 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      <View style={{ paddingHorizontal: SPACING.lg, paddingTop: 60 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular }}>
              {formatDate()}
            </Text>
            <Text style={{ color: COLORS.text, fontSize: 26, ...FONTS.bold, marginTop: 4 }}>
              {getGreeting()},{'\n'}{profile?.name || 'there'}
            </Text>
          </View>

          {streak > 0 && (
            <View style={{
              backgroundColor: '#FF6B3520',
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: RADIUS.pill,
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 4,
            }}>
              <Text style={{ fontSize: 15 }}>🔥</Text>
              <Text style={{ color: '#FF6B35', fontSize: 14, ...FONTS.bold, marginLeft: 5 }}>
                {streak}
              </Text>
            </View>
          )}
        </View>

        {/* Step Ring */}
        <View style={{
          alignItems: 'center',
          marginTop: SPACING.xl,
          marginBottom: SPACING.md,
          backgroundColor: COLORS.surface,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: COLORS.border,
          paddingVertical: SPACING.xl,
        }}>
          {isAvailable === null || permissionGranted === null ? (
            <View style={{ alignItems: 'center', padding: SPACING.xl }}>
              <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.medium }}>
                Setting up step tracking...
              </Text>
            </View>
          ) : (!isAvailable || !permissionGranted) ? (
            <View style={{ alignItems: 'center', padding: SPACING.xl }}>
              <Ionicons name="footsteps-outline" size={48} color={isExpoGo ? COLORS.warning : COLORS.primary} />
              <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginTop: SPACING.md, textAlign: 'center' }}>
                {isExpoGo ? 'Step Tracking Not Available in Expo Go' : !isAvailable ? 'Step Tracking Unavailable' : 'Enable Step Tracking'}
              </Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.regular, marginTop: 6, textAlign: 'center', paddingHorizontal: SPACING.md }}>
                {isExpoGo
                  ? 'Step counting requires the installed APK. Build and install the app to enable this feature. All other features work normally.'
                  : !isAvailable
                    ? 'Step counting is not supported on this device. You can still use all workout features.'
                    : 'FitCore needs the "Physical Activity" permission to count your steps. Tap below to open Settings and enable it.'}
              </Text>
              {isAvailable && !isExpoGo && (
                <TouchableOpacity
                  onPress={retryPermission}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: COLORS.primary,
                    paddingHorizontal: 28,
                    paddingVertical: 14,
                    borderRadius: 14,
                    marginTop: SPACING.lg,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 15, ...FONTS.bold }}>
                    Open Settings
                  </Text>
                </TouchableOpacity>
              )}
              {isAvailable && !isExpoGo && (
                <Text style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.regular, marginTop: 10, textAlign: 'center', paddingHorizontal: SPACING.md }}>
                  Go to Permissions → Physical Activity → Allow
                </Text>
              )}
            </View>
          ) : (
            <StepRing steps={steps} goal={goal} />
          )}
        </View>

        {/* Stat cards */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <StatCard icon="flame-outline" label="Calories" value={calories} color={COLORS.secondary} />
          <StatCard icon="navigate-outline" label="Distance" value={`${distance} km`} color={COLORS.primary} />
          <StatCard icon="time-outline" label="Active" value={`${activeMin} min`} color={COLORS.success} />
        </View>

        {/* Daily Check-In */}
        <MoodTracker />

        {/* Water Tracker */}
        <WaterTracker />

        {/* Workout Calendar */}
        <WorkoutCalendar />

        {/* Quick Start / Rest Day */}
        {nextWorkout ? (
          <TouchableOpacity
            onPress={() => router.push('/workout')}
            activeOpacity={0.7}
            style={{
              backgroundColor: COLORS.primary + '12',
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.primary + '30',
              padding: 20,
              marginTop: SPACING.md,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              backgroundColor: COLORS.primary + '25',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: SPACING.md,
            }}>
              <Text style={{ fontSize: 24 }}>{nextWorkout.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold }}>
                {nextWorkout.name}
              </Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.regular, marginTop: 3 }}>
                {nextWorkout.programName} · ~{nextWorkout.estMin} min
              </Text>
            </View>
            <View style={{
              width: 36, height: 36, borderRadius: 12,
              backgroundColor: COLORS.primary,
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Ionicons name="play" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        ) : (
          <View style={{
            backgroundColor: COLORS.success + '12',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.success + '30',
            padding: 20,
            marginTop: SPACING.md,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{
              width: 50,
              height: 50,
              borderRadius: 16,
              backgroundColor: COLORS.success + '25',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: SPACING.md,
            }}>
              <Ionicons name="leaf-outline" size={24} color={COLORS.success} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold }}>
                Rest Day
              </Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.regular, marginTop: 3 }}>
                Recovery is just as important as training. Try a light walk or stretching.
              </Text>
            </View>
          </View>
        )}

        {/* Weekly Chart */}
        <WeeklyChart data={weeklyData} goal={goal} />

        {/* Daily Quote */}
        <DailyQuote />
      </View>
    </ScrollView>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.surface,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: COLORS.border,
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 8,
    }}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginTop: 8 }}>
        {value}
      </Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 11, ...FONTS.regular, marginTop: 3 }}>
        {label}
      </Text>
    </View>
  );
}
