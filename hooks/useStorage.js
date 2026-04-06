import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useStorage(key, defaultValue = null) {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = async () => {
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch (e) {
      console.warn('useStorage load error:', e);
    } finally {
      setLoading(false);
    }
  };

  const save = useCallback(async (newValue) => {
    try {
      const toSave = typeof newValue === 'function' ? newValue(value) : newValue;
      await AsyncStorage.setItem(key, JSON.stringify(toSave));
      setValue(toSave);
      return toSave;
    } catch (e) {
      console.warn('useStorage save error:', e);
    }
  }, [key, value]);

  const remove = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(key);
      setValue(defaultValue);
    } catch (e) {
      console.warn('useStorage remove error:', e);
    }
  }, [key, defaultValue]);

  return { value, loading, save, remove, reload: loadValue };
}

export async function getProfile() {
  try {
    const val = await AsyncStorage.getItem('user_profile');
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function saveProfile(profile) {
  await AsyncStorage.setItem('user_profile', JSON.stringify(profile));
}

export async function getProgramState() {
  try {
    const val = await AsyncStorage.getItem('current_program_state');
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

export async function saveProgramState(state) {
  await AsyncStorage.setItem('current_program_state', JSON.stringify(state));
}

export async function clearAllData() {
  await AsyncStorage.clear();
}
