import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { getWorkoutLog, getBodyWeightLog, getStepsForRange, getExerciseRecords } from './progress';

export async function exportAllDataAsCSV() {
  try {
    let csv = '';

    // Workout Log
    csv += '=== WORKOUT LOG ===\n';
    csv += 'Date,Duration (min),Total Sets,Total Reps\n';
    const workouts = await getWorkoutLog();
    for (const w of workouts) {
      const sets = w.exercises ? w.exercises.reduce((s, e) => s + (e.setsCompleted || 0), 0) : 0;
      const reps = w.exercises ? w.exercises.reduce((s, e) => s + (e.repsPerSet ? e.repsPerSet.reduce((a, b) => a + b, 0) : 0), 0) : 0;
      csv += `${w.date},${w.durationMin || 0},${sets},${reps}\n`;
    }

    // Step History
    csv += '\n=== STEP HISTORY (last 90 days) ===\n';
    csv += 'Date,Steps\n';
    const steps = await getStepsForRange(90);
    for (const s of steps) {
      csv += `${s.date},${s.steps}\n`;
    }

    // Body Weight
    csv += '\n=== BODY WEIGHT LOG ===\n';
    csv += 'Date,Weight (kg)\n';
    const weights = await getBodyWeightLog();
    for (const w of weights) {
      csv += `${w.date},${w.weightKg}\n`;
    }

    // Exercise Records
    csv += '\n=== EXERCISE PERSONAL RECORDS ===\n';
    csv += 'Exercise,Best Reps,Date Achieved\n';
    const records = await getExerciseRecords();
    for (const [id, rec] of Object.entries(records)) {
      csv += `${id},${rec.bestReps},${rec.bestDate}\n`;
    }

    // Write file
    const fileUri = FileSystem.documentDirectory + 'fitcore_data.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // Share
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Export FitCore Data',
        UTI: 'public.comma-separated-values-text',
      });
    }

    return true;
  } catch (e) {
    console.warn('Export error:', e);
    return false;
  }
}
