import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import programs from '../data/programs';
import { getProfile } from '../hooks/useStorage';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WorkoutCalendar() {
  const [visible, setVisible] = useState(false);
  const [schedule, setSchedule] = useState({});
  const [profile, setProfile] = useState(null);
  const [programState, setProgramState] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const p = await getProfile();
    setProfile(p);

    try {
      const stateStr = await AsyncStorage.getItem('current_program_state');
      if (stateStr) setProgramState(JSON.parse(stateStr));

      const schedStr = await AsyncStorage.getItem('workout_schedule');
      if (schedStr) {
        setSchedule(JSON.parse(schedStr));
      } else if (p) {
        // Default schedule based on days per week
        const defaults = {};
        const daysPerWeek = p.daysPerWeek || 3;
        const patterns = {
          3: [0, 2, 4],    // Mon, Wed, Fri
          4: [0, 1, 3, 4], // Mon, Tue, Thu, Fri
          5: [0, 1, 2, 3, 4], // Mon-Fri
        };
        const dayIndices = patterns[daysPerWeek] || patterns[3];
        DAYS.forEach((d, i) => {
          defaults[d] = dayIndices.includes(i) ? 'workout' : 'rest';
        });
        setSchedule(defaults);
        await AsyncStorage.setItem('workout_schedule', JSON.stringify(defaults));
      }
    } catch {}
  };

  const toggleDay = async (day) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    const newSchedule = { ...schedule };
    newSchedule[day] = newSchedule[day] === 'workout' ? 'rest' : 'workout';
    setSchedule(newSchedule);
    await AsyncStorage.setItem('workout_schedule', JSON.stringify(newSchedule));
  };

  const workoutDays = Object.values(schedule).filter(v => v === 'workout').length;
  const todayIdx = (new Date().getDay() + 6) % 7; // Monday = 0
  const todayName = DAYS[todayIdx];
  const todayType = schedule[todayName] || 'rest';

  // Get today's workout name
  let todayWorkoutName = '';
  if (programState && profile) {
    try {
      const program = programs[programState.programId];
      if (program) {
        const allDays = program.phases.flatMap(ph => ph.days);
        const dayIndex = programState.currentDayIndex % allDays.length;
        todayWorkoutName = allDays[dayIndex]?.name || '';
      }
    } catch {}
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 18,
          marginTop: SPACING.md,
        }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
            <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
              This Week
            </Text>
          </View>
          <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium }}>
            {workoutDays} days
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 6 }}>
          {DAYS.map((day, i) => {
            const isWorkout = schedule[day] === 'workout';
            const isToday = i === todayIdx;
            return (
              <View key={day} style={{
                flex: 1,
                alignItems: 'center',
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: isToday ? (isWorkout ? COLORS.primary + '20' : COLORS.success + '15') : 'transparent',
                borderWidth: isToday ? 1 : 0,
                borderColor: isToday ? (isWorkout ? COLORS.primary + '40' : COLORS.success + '30') : 'transparent',
              }}>
                <Text style={{
                  color: isToday ? COLORS.text : COLORS.textFaint,
                  fontSize: 10,
                  ...FONTS.medium,
                }}>
                  {day}
                </Text>
                <View style={{
                  width: 8, height: 8, borderRadius: 4, marginTop: 6,
                  backgroundColor: isWorkout ? COLORS.primary : COLORS.textFaint,
                }} />
              </View>
            );
          })}
        </View>
      </TouchableOpacity>

      {/* Edit Modal */}
      <Modal visible={visible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: COLORS.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 50,
          }}>
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.textFaint }} />
            </View>

            <View style={{ paddingHorizontal: SPACING.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
                <Text style={{ color: COLORS.text, fontSize: 22, ...FONTS.bold }}>
                  Weekly Plan
                </Text>
                <TouchableOpacity onPress={() => setVisible(false)}>
                  <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
                </TouchableOpacity>
              </View>

              <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, marginBottom: SPACING.lg }}>
                Tap to toggle workout or rest day
              </Text>

              {DAYS.map((day, i) => {
                const isWorkout = schedule[day] === 'workout';
                const isToday = i === todayIdx;
                return (
                  <TouchableOpacity
                    key={day}
                    onPress={() => toggleDay(day)}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: isWorkout ? COLORS.primary + '10' : COLORS.surface,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: isToday ? COLORS.primary + '50' : COLORS.border,
                      marginBottom: 8,
                    }}
                  >
                    <View style={{
                      width: 40, height: 40, borderRadius: 12,
                      backgroundColor: isWorkout ? COLORS.primary + '20' : COLORS.surface2,
                      alignItems: 'center', justifyContent: 'center', marginRight: 14,
                    }}>
                      <Ionicons
                        name={isWorkout ? 'barbell' : 'leaf'}
                        size={18}
                        color={isWorkout ? COLORS.primary : COLORS.success}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.medium }}>
                        {day}{isToday ? ' (Today)' : ''}
                      </Text>
                      <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular }}>
                        {isWorkout ? 'Workout Day' : 'Rest Day'}
                      </Text>
                    </View>
                    <View style={{
                      width: 28, height: 28, borderRadius: 14,
                      backgroundColor: isWorkout ? COLORS.primary : COLORS.surface2,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Ionicons
                        name={isWorkout ? 'checkmark' : 'close'}
                        size={14}
                        color={isWorkout ? '#fff' : COLORS.textFaint}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
