import AsyncStorage from '@react-native-async-storage/async-storage';

export function getDateKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export async function getStepsForDate(dateKey) {
  try {
    const val = await AsyncStorage.getItem(`steps_${dateKey}`);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export async function getStepsForRange(days = 7) {
  const result = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    const steps = await getStepsForDate(key);
    result.push({
      date: key,
      steps,
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
    });
  }
  return result;
}

export async function getWorkoutLog() {
  try {
    const val = await AsyncStorage.getItem('workout_log');
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export async function addWorkoutLog(entry) {
  const log = await getWorkoutLog();
  log.push(entry);
  await AsyncStorage.setItem('workout_log', JSON.stringify(log));
  return log;
}

export function calculateStreak(workoutLog) {
  if (!workoutLog.length) return { current: 0, best: 0 };

  const dates = [...new Set(workoutLog.map(w => w.date))].sort().reverse();
  const today = getDateKey();
  const yesterday = getDateKey(new Date(Date.now() - 86400000));

  let current = 0;
  let checkDate = today;

  if (dates[0] !== today && dates[0] !== yesterday) {
    return { current: 0, best: calculateBestStreak(dates) };
  }

  for (let i = 0; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = getDateKey(d);
    if (dates.includes(key)) {
      current++;
    } else if (i > 0) {
      break;
    }
  }

  return { current, best: Math.max(current, calculateBestStreak(dates)) };
}

function calculateBestStreak(sortedDates) {
  if (!sortedDates.length) return 0;
  let best = 1;
  let streak = 1;

  const ascending = [...sortedDates].sort();
  for (let i = 1; i < ascending.length; i++) {
    const prev = new Date(ascending[i - 1]);
    const curr = new Date(ascending[i]);
    const diff = (curr - prev) / 86400000;
    if (diff === 1) {
      streak++;
      best = Math.max(best, streak);
    } else if (diff > 1) {
      streak = 1;
    }
  }
  return best;
}

export async function getExerciseRecords() {
  try {
    const val = await AsyncStorage.getItem('exercise_records');
    return val ? JSON.parse(val) : {};
  } catch {
    return {};
  }
}

export async function updateExerciseRecord(exerciseId, reps, date) {
  const records = await getExerciseRecords();
  const existing = records[exerciseId];

  if (!existing || reps > existing.bestReps) {
    records[exerciseId] = {
      bestReps: reps,
      bestDate: date || getDateKey(),
      history: existing ? [...(existing.history || []), { reps, date: date || getDateKey() }] : [{ reps, date: date || getDateKey() }],
    };
    await AsyncStorage.setItem('exercise_records', JSON.stringify(records));
    return true;
  }

  if (existing) {
    existing.history = existing.history || [];
    existing.history.push({ reps, date: date || getDateKey() });
    await AsyncStorage.setItem('exercise_records', JSON.stringify(records));
  }
  return false;
}

export async function getBodyWeightLog() {
  try {
    const val = await AsyncStorage.getItem('body_weight_log');
    return val ? JSON.parse(val) : [];
  } catch {
    return [];
  }
}

export async function addBodyWeight(weightKg) {
  const log = await getBodyWeightLog();
  const today = getDateKey();
  const existingIdx = log.findIndex(e => e.date === today);
  if (existingIdx >= 0) {
    log[existingIdx].weightKg = weightKg;
  } else {
    log.push({ date: today, weightKg });
  }
  await AsyncStorage.setItem('body_weight_log', JSON.stringify(log));
  return log;
}

export async function getMonthSteps() {
  const today = new Date();
  let total = 0;
  for (let i = 0; i < today.getDate(); i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    total += await getStepsForDate(getDateKey(d));
  }
  return total;
}

export function getCurrentWeek(startDate) {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.floor((now - start) / (7 * 86400000));
  return diff + 1;
}
