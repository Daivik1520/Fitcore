import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKUP_KEYS = [
  'user_profile',
  'workout_log',
  'exercise_records',
  'body_weight_log',
  'current_program_state',
  'workout_schedule',
  'custom_workouts',
  'body_measurements',
  'progress_photos',
  'checkin_history',
  'achievements_unlocked',
  'rest_timer_duration',
  'reminder_enabled',
  'reminder_hour',
  'reminder_min',
  'weight_unit',
  'unlocked_theme',
];

export async function exportBackup() {
  try {
    const data = {};
    for (const key of BACKUP_KEYS) {
      const val = await AsyncStorage.getItem(key);
      if (val !== null) data[key] = val;
    }

    // Also grab step and water data (last 90 days)
    const today = new Date();
    for (let i = 0; i < 90; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const steps = await AsyncStorage.getItem(`steps_${dateStr}`);
      if (steps) data[`steps_${dateStr}`] = steps;

      const water = await AsyncStorage.getItem(`water_${dateStr}`);
      if (water) data[`water_${dateStr}`] = water;

      const checkin = await AsyncStorage.getItem(`checkin_${dateStr}`);
      if (checkin) data[`checkin_${dateStr}`] = checkin;
    }

    // Get exercise notes
    const allKeys = await AsyncStorage.getAllKeys();
    for (const key of allKeys) {
      if (key.startsWith('note_')) {
        const val = await AsyncStorage.getItem(key);
        if (val) data[key] = val;
      }
    }

    const json = JSON.stringify(data, null, 2);
    const fileUri = FileSystem.documentDirectory + 'fitcore_backup.json';
    await FileSystem.writeAsStringAsync(fileUri, json, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/json',
        dialogTitle: 'FitCore Backup',
      });
    }
    return true;
  } catch (e) {
    console.warn('Backup export error:', e);
    return false;
  }
}

export async function importBackup(fileUri) {
  try {
    const json = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.UTF8,
    });
    const data = JSON.parse(json);

    for (const [key, value] of Object.entries(data)) {
      await AsyncStorage.setItem(key, value);
    }

    return true;
  } catch (e) {
    console.warn('Backup import error:', e);
    return false;
  }
}
