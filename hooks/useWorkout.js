import { useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDateKey, updateExerciseRecord, addWorkoutLog } from '../utils/progress';
import { calculateWorkoutCalories } from '../utils/calories';
import exercises from '../data/exercises';

// States: idle, active, resting, set_logging, complete
export function useWorkout() {
  const [state, setState] = useState('idle');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [repsLogged, setRepsLogged] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [progressionMessage, setProgressionMessage] = useState(null);
  const exerciseDataRef = useRef([]);

  const startWorkout = useCallback((exerciseList) => {
    exerciseDataRef.current = exerciseList;
    setState('active');
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setRepsLogged(0);
    setCompletedExercises([]);
    setWorkoutStartTime(Date.now());
    setProgressionMessage(null);
  }, []);

  const getCurrentExercise = useCallback(() => {
    if (!exerciseDataRef.current.length) return null;
    return exerciseDataRef.current[currentExerciseIndex];
  }, [currentExerciseIndex]);

  const startSet = useCallback(() => {
    const exercise = getCurrentExercise();
    if (!exercise) return;
    setRepsLogged(exercise.reps);
    setState('set_logging');
  }, [getCurrentExercise]);

  const adjustReps = useCallback((delta) => {
    setRepsLogged(prev => Math.max(0, prev + delta));
  }, []);

  const completeSet = useCallback(async () => {
    const exercise = getCurrentExercise();
    if (!exercise) return;

    const exIndex = currentExerciseIndex;
    const existing = completedExercises.find(e => e.id === exercise.id);

    if (existing) {
      existing.repsPerSet.push(repsLogged);
      existing.setsCompleted++;
    } else {
      completedExercises.push({
        id: exercise.id,
        setsCompleted: 1,
        repsPerSet: [repsLogged],
        targetReps: exercise.reps,
        targetSets: exercise.sets,
      });
    }

    setCompletedExercises([...completedExercises]);

    // Check if all sets done for this exercise
    if (currentSet >= exercise.sets) {
      // Check progressive overload
      await checkProgression(exercise, repsLogged);

      // Move to next exercise or finish
      if (currentExerciseIndex < exerciseDataRef.current.length - 1) {
        setState('resting');
      } else {
        await finishWorkout();
      }
    } else {
      setCurrentSet(prev => prev + 1);
      setRepsLogged(exercise.reps);
      setState('resting');
    }
  }, [currentExerciseIndex, currentSet, repsLogged, completedExercises]);

  const checkProgression = async (exercise, reps) => {
    try {
      const recordsStr = await AsyncStorage.getItem('exercise_records');
      const records = recordsStr ? JSON.parse(recordsStr) : {};
      const prevRecord = records[exercise.id];

      if (reps >= exercise.reps) {
        const isNewBest = await updateExerciseRecord(exercise.id, reps, getDateKey());
        if (prevRecord && reps > prevRecord.bestReps) {
          setProgressionMessage(`+${reps - prevRecord.bestReps} rep${reps - prevRecord.bestReps > 1 ? 's' : ''} unlocked!`);
          setTimeout(() => setProgressionMessage(null), 3000);
        }

        // Auto-difficulty: check if user hit target 3 sessions in a row
        await checkAutoDifficulty(exercise, reps, records);
      } else {
        await updateExerciseRecord(exercise.id, reps, getDateKey());

        // Check if failing consistently
        await checkAutoDowngrade(exercise, reps, records);
      }
    } catch (e) {
      console.warn('checkProgression error:', e);
    }
  };

  const checkAutoDifficulty = async (exercise, reps, records) => {
    try {
      const exData = exercises[exercise.id];
      if (!exData || !exData.variations || exData.variations.length === 0) return;

      const history = records[exercise.id]?.history || [];
      const lastThree = history.slice(-3);
      if (lastThree.length < 3) return;

      const allHitTarget = lastThree.every(h => h.reps >= exercise.reps);
      if (allHitTarget && reps >= exercise.reps + 3) {
        // Suggest harder variation
        const harder = exData.variations.find(v => {
          const vData = exercises[v];
          return vData && vData.difficulty > exData.difficulty;
        });
        if (harder) {
          const harderName = exercises[harder]?.name || harder;
          setProgressionMessage(`Level up! Try ${harderName} next time`);
          setTimeout(() => setProgressionMessage(null), 4000);

          // Store suggestion
          await AsyncStorage.setItem(`suggestion_${exercise.id}`, JSON.stringify({
            type: 'upgrade',
            to: harder,
            date: getDateKey(),
          }));
        }
      }
    } catch {}
  };

  const checkAutoDowngrade = async (exercise, reps, records) => {
    try {
      const exData = exercises[exercise.id];
      if (!exData) return;

      const history = records[exercise.id]?.history || [];
      const lastTwo = history.slice(-2);
      if (lastTwo.length < 2) return;

      const failedTwice = lastTwo.every(h => h.reps < exercise.reps);
      if (failedTwice && reps < exercise.reps) {
        const easier = exData.variations?.find(v => {
          const vData = exercises[v];
          return vData && vData.difficulty < exData.difficulty;
        });
        if (easier) {
          const easierName = exercises[easier]?.name || easier;
          setProgressionMessage(`Try ${easierName} to build up strength`);
          setTimeout(() => setProgressionMessage(null), 4000);
        }
      }
    } catch {}
  };

  const skipRest = useCallback(() => {
    const exercise = getCurrentExercise();
    if (!exercise) return;

    // If all sets done for current exercise, move to next
    if (currentSet >= exercise.sets) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      const nextExercise = exerciseDataRef.current[currentExerciseIndex + 1];
      if (nextExercise) {
        setRepsLogged(nextExercise.reps);
      }
    }
    setState('active');
  }, [currentExerciseIndex, currentSet]);

  const onRestComplete = useCallback(() => {
    skipRest();
  }, [skipRest]);

  const finishWorkout = async () => {
    const duration = Math.round((Date.now() - workoutStartTime) / 60000);
    const totalCalories = calculateWorkoutCalories(completedExercises, exercises);
    const totalSets = completedExercises.reduce((sum, e) => sum + e.setsCompleted, 0);
    const totalReps = completedExercises.reduce(
      (sum, e) => sum + e.repsPerSet.reduce((s, r) => s + r, 0), 0
    );

    const logEntry = {
      date: getDateKey(),
      durationMin: duration,
      exercises: completedExercises,
      totalCalories,
      totalSets,
      totalReps,
    };

    setState('complete');

    return logEntry;
  };

  const getWorkoutStats = useCallback(() => {
    const duration = workoutStartTime
      ? Math.round((Date.now() - workoutStartTime) / 60000)
      : 0;
    const totalSets = completedExercises.reduce((sum, e) => sum + e.setsCompleted, 0);
    const totalReps = completedExercises.reduce(
      (sum, e) => sum + e.repsPerSet.reduce((s, r) => s + r, 0), 0
    );
    const totalCalories = calculateWorkoutCalories(completedExercises, exercises);

    return { duration, totalSets, totalReps, totalCalories };
  }, [completedExercises, workoutStartTime]);

  const resetWorkout = useCallback(() => {
    setState('idle');
    setCurrentExerciseIndex(0);
    setCurrentSet(1);
    setRepsLogged(0);
    setCompletedExercises([]);
    setWorkoutStartTime(null);
    setProgressionMessage(null);
    exerciseDataRef.current = [];
  }, []);

  const getLastPerformance = async (exerciseId) => {
    try {
      const recordsStr = await AsyncStorage.getItem('exercise_records');
      const records = recordsStr ? JSON.parse(recordsStr) : {};
      return records[exerciseId] || null;
    } catch {
      return null;
    }
  };

  // Estimated max reps based on training progression
  const estimateMaxReps = async (exerciseId) => {
    try {
      const recordsStr = await AsyncStorage.getItem('exercise_records');
      const records = recordsStr ? JSON.parse(recordsStr) : {};
      const record = records[exerciseId];
      if (!record || !record.history || record.history.length < 3) return null;

      const recent = record.history.slice(-5);
      const avgRate = recent.length > 1
        ? (recent[recent.length - 1].reps - recent[0].reps) / (recent.length - 1)
        : 0;

      // Project 3 more sessions ahead
      const estimated = Math.round(record.bestReps + avgRate * 3);
      return Math.max(estimated, record.bestReps);
    } catch {
      return null;
    }
  };

  return {
    state,
    currentExerciseIndex,
    currentSet,
    repsLogged,
    completedExercises,
    progressionMessage,
    exerciseList: exerciseDataRef.current,
    startWorkout,
    getCurrentExercise,
    startSet,
    adjustReps,
    completeSet,
    skipRest,
    onRestComplete,
    getWorkoutStats,
    resetWorkout,
    getLastPerformance,
  };
}
