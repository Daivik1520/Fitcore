import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS, CARD, BUTTON } from '../../constants/theme';
import { useWorkout } from '../../hooks/useWorkout';
import { getProfile } from '../../hooks/useStorage';
import { getDateKey, addWorkoutLog } from '../../utils/progress';
import ExerciseCard from '../../components/ExerciseCard';
import RestTimer from '../../components/RestTimer';
import WorkoutComplete from '../../components/WorkoutComplete';
import ExerciseModal from '../../components/ExerciseModal';
import programs from '../../data/programs';
import exercises from '../../data/exercises';
import { WARMUP_EXERCISES, COOLDOWN_EXERCISES } from '../../data/warmup';
import WorkoutTimer from '../../components/WorkoutTimer';

export default function WorkoutScreen() {
  const [profile, setProfile] = useState(null);
  const [programState, setProgramState] = useState(null);
  const [todayExercises, setTodayExercises] = useState([]);
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [restDuration, setRestDuration] = useState(60);
  const [selectedExerciseId, setSelectedExerciseId] = useState(null);
  const [showWarmup, setShowWarmup] = useState(true);
  const [isCustom, setIsCustom] = useState(false);
  // Custom workout builder
  const [buildingCustom, setBuildingCustom] = useState(false);
  const [customExercises, setCustomExercises] = useState([]);

  const workout = useWorkout();

  const loadWorkout = async () => {
    const p = await getProfile();
    setProfile(p);

    try {
      const stateStr = await AsyncStorage.getItem('current_program_state');
      if (stateStr) {
        const state = JSON.parse(stateStr);
        setProgramState(state);

        const program = programs[state.programId];
        if (program) {
          const totalDays = program.phases.flatMap(ph => ph.days);
          const dayIndex = state.currentDayIndex % totalDays.length;
          const day = totalDays[dayIndex];
          const weekNum = Math.floor(state.currentDayIndex / (p?.daysPerWeek || 3)) + 1;

          setWorkoutTitle(`${day.name} — Week ${weekNum}`);
          setTodayExercises(day.exercises);
        }
      }

      const restPref = await AsyncStorage.getItem('rest_timer_duration');
      if (restPref) setRestDuration(parseInt(restPref, 10));
    } catch (e) {
      console.warn('loadWorkout error:', e);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (workout.state === 'idle' && !buildingCustom) {
        loadWorkout();
        setIsCustom(false);
      }
    }, [workout.state, buildingCustom])
  );

  const handleStartWorkout = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    // Prepend warmup, append cooldown
    const fullList = [
      ...WARMUP_EXERCISES,
      ...todayExercises,
      ...COOLDOWN_EXERCISES,
    ];
    workout.startWorkout(fullList);
    setShowWarmup(true);
  };

  const handleStartSet = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    workout.startSet();
  };

  const handleCompleteSet = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    workout.completeSet();
  };

  const handleWorkoutDone = async () => {
    const stats = workout.getWorkoutStats();

    await addWorkoutLog({
      date: getDateKey(),
      programId: isCustom ? 'custom' : programState?.programId,
      dayIndex: programState?.currentDayIndex,
      durationMin: stats.duration,
      exercises: workout.completedExercises,
    });

    if (programState && !isCustom) {
      const newState = {
        ...programState,
        currentDayIndex: programState.currentDayIndex + 1,
        lastWorkoutDate: getDateKey(),
      };
      const program = programs[programState.programId];
      if (program) {
        const totalDays = program.phases.flatMap(ph => ph.days);
        if (newState.currentDayIndex >= totalDays.length * (program.durationWeeks / 4)) {
          Alert.alert(
            'Program Complete!',
            'Congratulations! You completed the entire program.',
            [
              { text: 'Repeat', onPress: () => resetProgram(true) },
              { text: 'OK' },
            ]
          );
        }
      }
      await AsyncStorage.setItem('current_program_state', JSON.stringify(newState));
    }

    workout.resetWorkout();
    setBuildingCustom(false);
  };

  const resetProgram = async (repeat) => {
    if (repeat && programState) {
      await AsyncStorage.setItem('current_program_state', JSON.stringify({
        ...programState,
        currentDayIndex: 0,
        startedAt: new Date().toISOString(),
      }));
    }
  };

  // Custom workout builder
  const toggleCustomExercise = (exId) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setCustomExercises(prev => {
      if (prev.find(e => e.id === exId)) {
        return prev.filter(e => e.id !== exId);
      }
      return [...prev, { id: exId, sets: 3, reps: 12, isHold: exercises[exId]?.isHold || false }];
    });
  };

  const startCustomWorkout = async () => {
    if (customExercises.length === 0) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}

    // Save custom workout
    try {
      const stored = await AsyncStorage.getItem('custom_workouts');
      const list = stored ? JSON.parse(stored) : [];
      list.push({ date: getDateKey(), exercises: customExercises });
      await AsyncStorage.setItem('custom_workouts', JSON.stringify(list));
    } catch {}

    setIsCustom(true);
    setTodayExercises(customExercises);
    setWorkoutTitle('Custom Workout');
    const fullList = [...WARMUP_EXERCISES, ...customExercises, ...COOLDOWN_EXERCISES];
    workout.startWorkout(fullList);
    setBuildingCustom(false);
  };

  const currentExercise = workout.getCurrentExercise();
  const exerciseInfo = currentExercise ? exercises[currentExercise.id] : null;
  const nextExIndex = workout.currentExerciseIndex + 1;
  const allExercises = workout.exerciseList;
  const nextExercise = allExercises[nextExIndex];
  const nextExName = nextExercise ? exercises[nextExercise.id]?.name : null;

  const estMinutes = todayExercises.length * 5 + (todayExercises.length - 1);
  const completedCount = workout.completedExercises.length;

  // Workout Complete screen
  if (workout.state === 'complete') {
    return (
      <WorkoutComplete
        stats={workout.getWorkoutStats()}
        onDone={handleWorkoutDone}
      />
    );
  }

  // Custom workout builder screen
  if (buildingCustom) {
    const allExIds = Object.keys(exercises);
    const groups = {};
    for (const id of allExIds) {
      const ex = exercises[id];
      const g = ex.muscleGroup;
      if (!groups[g]) groups[g] = [];
      groups[g].push(ex);
    }

    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }}>
          <View style={{ paddingHorizontal: SPACING.lg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text style={{ color: COLORS.text, fontSize: 24, ...FONTS.bold }}>
                  Build Workout
                </Text>
                <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, marginTop: 4 }}>
                  Tap exercises to add them
                </Text>
              </View>
              <TouchableOpacity onPress={() => setBuildingCustom(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
              </TouchableOpacity>
            </View>

            {customExercises.length > 0 && (
              <View style={{
                backgroundColor: COLORS.primary + '10',
                borderRadius: 14,
                padding: 14,
                marginTop: SPACING.md,
                borderWidth: 1,
                borderColor: COLORS.primary + '25',
              }}>
                <Text style={{ color: COLORS.primary, fontSize: 13, ...FONTS.medium }}>
                  {customExercises.length} exercise{customExercises.length > 1 ? 's' : ''} selected
                </Text>
              </View>
            )}

            {Object.entries(groups).map(([group, exList]) => (
              <View key={group} style={{ marginTop: SPACING.lg }}>
                <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.bold, textTransform: 'uppercase', marginBottom: SPACING.sm }}>
                  {group}
                </Text>
                {exList.map(ex => {
                  const selected = customExercises.some(e => e.id === ex.id);
                  return (
                    <TouchableOpacity
                      key={ex.id}
                      onPress={() => toggleCustomExercise(ex.id)}
                      activeOpacity={0.7}
                      style={{
                        backgroundColor: selected ? COLORS.primary + '12' : COLORS.surface,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: selected ? COLORS.primary + '40' : COLORS.border,
                        padding: 14,
                        marginBottom: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}
                    >
                      <View style={{
                        width: 36, height: 36, borderRadius: 10,
                        backgroundColor: selected ? COLORS.primary + '25' : COLORS.surface2,
                        alignItems: 'center', justifyContent: 'center', marginRight: 12,
                      }}>
                        <Ionicons
                          name={selected ? 'checkmark' : getExerciseIcon(ex.muscleGroup)}
                          size={18}
                          color={selected ? COLORS.primary : COLORS.textFaint}
                        />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: COLORS.text, fontSize: 15, ...FONTS.medium }}>{ex.name}</Text>
                        <Text style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.regular }}>{ex.muscle}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        {customExercises.length > 0 && (
          <View style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: SPACING.lg, paddingBottom: SPACING.xl,
            backgroundColor: COLORS.background + 'F0',
          }}>
            <TouchableOpacity onPress={startCustomWorkout} style={BUTTON.primary}>
              <Text style={BUTTON.primaryText}>
                Start Custom Workout ({customExercises.length})
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // Determine if current exercise is warmup/cooldown
  const warmupCount = WARMUP_EXERCISES.length;
  const cooldownCount = COOLDOWN_EXERCISES.length;
  const mainExercises = todayExercises;
  const fullExerciseList = workout.state !== 'idle'
    ? allExercises
    : todayExercises;

  const getPhaseLabel = (idx) => {
    if (workout.state === 'idle') return null;
    if (idx < warmupCount) return 'WARM-UP';
    if (idx >= allExercises.length - cooldownCount) return 'COOL-DOWN';
    return null;
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }}>
        <View style={{ paddingHorizontal: SPACING.lg }}>
          {/* Header */}
          <Text style={{ color: COLORS.text, fontSize: 24, ...FONTS.bold }}>
            {workoutTitle || 'Workout'}
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, marginTop: 4 }}>
            ~{estMinutes} min · {todayExercises.length} exercises + warm-up & cool-down
          </Text>

          {/* Live workout timer */}
          <WorkoutTimer isRunning={workout.state !== 'idle' && workout.state !== 'complete'} />

          {/* Progress bar */}
          {workout.state !== 'idle' && (
            <View style={{ marginTop: SPACING.md }}>
              <View style={{
                height: 6, backgroundColor: COLORS.surface2,
                borderRadius: 3, overflow: 'hidden',
              }}>
                <View style={{
                  height: 6, backgroundColor: COLORS.primary, borderRadius: 3,
                  width: `${(completedCount / allExercises.length) * 100}%`,
                }} />
              </View>
              <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginTop: 4 }}>
                {completedCount} / {allExercises.length} exercises (incl. warm-up & cool-down)
              </Text>
            </View>
          )}

          {/* Progression toast */}
          {workout.progressionMessage && (
            <View style={{
              backgroundColor: COLORS.success + '20',
              borderRadius: RADIUS.button, padding: SPACING.sm,
              marginTop: SPACING.sm, alignItems: 'center',
            }}>
              <Text style={{ color: COLORS.success, fontSize: 14, ...FONTS.bold }}>
                {workout.progressionMessage}
              </Text>
            </View>
          )}

          {/* Set logging */}
          {workout.state === 'set_logging' && currentExercise && (
            <View style={{
              ...CARD, marginTop: SPACING.md,
              borderColor: COLORS.primary, borderWidth: 2,
            }}>
              <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium, marginBottom: SPACING.xs }}>
                Set {workout.currentSet} of {currentExercise.sets}
              </Text>
              <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold, marginBottom: SPACING.md }}>
                {exerciseInfo?.name}
              </Text>

              <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium, textAlign: 'center' }}>
                {currentExercise.isHold ? 'Hold Time (seconds)' : 'Reps Completed'}
              </Text>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: SPACING.md }}>
                <TouchableOpacity
                  onPress={() => { workout.adjustReps(-1); try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} }}
                  style={{
                    width: 56, height: 56, borderRadius: 28,
                    backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Ionicons name="remove" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.text, fontSize: 48, ...FONTS.bold, marginHorizontal: SPACING.xl }}>
                  {workout.repsLogged}
                </Text>
                <TouchableOpacity
                  onPress={() => { workout.adjustReps(1); try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {} }}
                  style={{
                    width: 56, height: 56, borderRadius: 28,
                    backgroundColor: COLORS.surface2, borderWidth: 1, borderColor: COLORS.border,
                    alignItems: 'center', justifyContent: 'center',
                  }}
                >
                  <Ionicons name="add" size={24} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleCompleteSet} style={BUTTON.primary}>
                <Text style={BUTTON.primaryText}>
                  {workout.currentSet >= currentExercise.sets ? 'Complete Exercise' : 'Log Set'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Exercise list */}
          <View style={{ marginTop: SPACING.lg }}>
            {(workout.state !== 'idle' ? allExercises : todayExercises).map((ex, idx) => {
              const isActive = workout.state !== 'idle' && idx === workout.currentExerciseIndex;
              const isCompleted = workout.completedExercises.some(
                ce => ce.id === ex.id && ce.setsCompleted >= ex.sets
              );
              const phase = getPhaseLabel(idx);

              return (
                <React.Fragment key={`${ex.id}-${idx}`}>
                  {phase && (idx === 0 || getPhaseLabel(idx - 1) !== phase) && (
                    <Text style={{
                      color: phase === 'WARM-UP' ? COLORS.warning : COLORS.success,
                      fontSize: 11, ...FONTS.bold,
                      marginTop: idx > 0 ? SPACING.md : 0,
                      marginBottom: 6,
                      letterSpacing: 1,
                    }}>
                      {phase}
                    </Text>
                  )}
                  {workout.state === 'idle' && idx === 0 && (
                    <Text style={{
                      color: COLORS.primary,
                      fontSize: 11, ...FONTS.bold,
                      marginBottom: 6, letterSpacing: 1,
                    }}>
                      MAIN WORKOUT
                    </Text>
                  )}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onLongPress={() => { setSelectedExerciseId(ex.id); try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {} }}
                  >
                    <ExerciseCard
                      exercise={ex}
                      index={idx}
                      isActive={isActive}
                      isCompleted={isCompleted}
                      onStartSet={handleStartSet}
                      currentSet={isActive ? workout.currentSet : 1}
                      totalSets={ex.sets}
                    />
                  </TouchableOpacity>
                </React.Fragment>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      {workout.state === 'idle' && todayExercises.length > 0 && (
        <View style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: SPACING.lg, paddingBottom: SPACING.xl,
          backgroundColor: COLORS.background + 'F0',
        }}>
          <TouchableOpacity onPress={handleStartWorkout} activeOpacity={0.8} style={BUTTON.primary}>
            <Text style={BUTTON.primaryText}>Start Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => { setBuildingCustom(true); setCustomExercises([]); }}
            activeOpacity={0.7}
            style={{
              height: 44, borderRadius: RADIUS.button,
              alignItems: 'center', justifyContent: 'center', marginTop: 10,
              backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border,
            }}
          >
            <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.medium }}>
              Build Custom Workout
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Rest Timer */}
      <RestTimer
        visible={workout.state === 'resting'}
        duration={restDuration}
        nextExerciseName={nextExName || exerciseInfo?.name}
        onComplete={workout.onRestComplete}
        onSkip={workout.skipRest}
        exerciseData={exerciseInfo}
      />

      {/* Exercise Detail Modal */}
      <ExerciseModal
        exerciseId={selectedExerciseId}
        visible={!!selectedExerciseId}
        onClose={() => setSelectedExerciseId(null)}
      />
    </View>
  );
}

function getExerciseIcon(muscleGroup) {
  switch (muscleGroup) {
    case 'push': return 'fitness-outline';
    case 'pull': return 'arrow-down-outline';
    case 'legs': return 'walk-outline';
    case 'core': return 'body-outline';
    case 'cardio': return 'flash-outline';
    case 'flexibility': return 'leaf-outline';
    default: return 'barbell-outline';
  }
}
