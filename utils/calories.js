export function calculateStepCalories(steps, weightKg = 70) {
  return Math.round(steps * 0.04 * weightKg / 70);
}

export function calculateDistance(steps) {
  return (steps * 0.000762).toFixed(1);
}

export function calculateActiveMinutes(steps) {
  return Math.round(steps / 100);
}

export function calculateExerciseCalories(exerciseId, reps, exercises) {
  const exercise = exercises[exerciseId];
  if (!exercise) return 0;
  return Math.round(exercise.caloriesPerRep * reps);
}

export function calculateWorkoutCalories(completedExercises, exercises) {
  let total = 0;
  for (const ex of completedExercises) {
    const exercise = exercises[ex.id];
    if (!exercise) continue;
    const totalReps = ex.repsPerSet
      ? ex.repsPerSet.reduce((sum, r) => sum + r, 0)
      : ex.setsCompleted * (ex.reps || 0);
    total += exercise.caloriesPerRep * totalReps;
  }
  return Math.round(total);
}
