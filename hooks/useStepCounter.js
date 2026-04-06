import { useState, useEffect, useRef, useCallback } from 'react';
import { Linking, Platform, AppState } from 'react-native';
import { Pedometer } from 'expo-sensors';
import * as Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDateKey } from '../utils/progress';

export function useStepCounter() {
  const [steps, setSteps] = useState(0);
  const [isAvailable, setIsAvailable] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(null);
  const [isExpoGo, setIsExpoGo] = useState(false);
  const dateRef = useRef(getDateKey());
  const subscriptionRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    // Detect if running in Expo Go
    const appOwnership = Constants.default?.executionEnvironment;
    const inExpoGo = appOwnership === 'storeClient' || appOwnership === 'standalone' === false;
    // More reliable check
    const expoGo = !Constants.default?.expoConfig?.android?.package ||
                    Constants.default?.appOwnership === 'expo';
    setIsExpoGo(expoGo);

    init(expoGo);

    const sub = AppState.addEventListener('change', (nextState) => {
      if (appStateRef.current.match(/inactive|background/) && nextState === 'active') {
        recheckPermission();
      }
      appStateRef.current = nextState;
    });

    return () => {
      sub.remove();
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
      }
    };
  }, []);

  const init = async (expoGo) => {
    // Load any previously saved steps regardless
    const today = getDateKey();
    const stored = await AsyncStorage.getItem(`steps_${today}`);
    if (stored) setSteps(parseInt(stored, 10));

    let available = false;
    try {
      available = await Pedometer.isAvailableAsync();
    } catch {
      available = false;
    }
    setIsAvailable(available);

    if (!available) {
      setPermissionGranted(false);
      return;
    }

    // Try getting permission
    try {
      const { status } = await Pedometer.getPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        await loadTodaySteps();
        await startWatching();
        return;
      }
    } catch {}

    try {
      const { status } = await Pedometer.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        await loadTodaySteps();
        await startWatching();
      } else {
        setPermissionGranted(false);
      }
    } catch {
      setPermissionGranted(false);
    }
  };

  const retryPermission = useCallback(async () => {
    try {
      const { status, canAskAgain } = await Pedometer.requestPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        await loadTodaySteps();
        await startWatching();
        return true;
      }
      // Open app settings so user can enable manually
      openAppSettings();
      return false;
    } catch {
      openAppSettings();
      return false;
    }
  }, []);

  const openAppSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {}
  };

  const recheckPermission = async () => {
    if (permissionGranted) return;
    try {
      const available = await Pedometer.isAvailableAsync();
      if (!available) return;
      const { status } = await Pedometer.getPermissionsAsync();
      if (status === 'granted') {
        setPermissionGranted(true);
        setIsAvailable(true);
        await loadTodaySteps();
        await startWatching();
      }
    } catch {}
  };

  const loadTodaySteps = async () => {
    try {
      const today = getDateKey();
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      try {
        const result = await Pedometer.getStepCountAsync(start, end);
        if (result && result.steps > 0) {
          setSteps(result.steps);
          await AsyncStorage.setItem(`steps_${today}`, String(result.steps));
          return;
        }
      } catch {}
      // Fallback to stored
      const stored = await AsyncStorage.getItem(`steps_${today}`);
      if (stored) setSteps(parseInt(stored, 10));
    } catch (e) {
      console.warn('loadTodaySteps error:', e);
    }
  };

  const startWatching = async () => {
    try {
      if (subscriptionRef.current) subscriptionRef.current.remove();

      subscriptionRef.current = Pedometer.watchStepCount(async (result) => {
        const today = getDateKey();
        if (today !== dateRef.current) {
          dateRef.current = today;
          setSteps(result.steps);
          await AsyncStorage.setItem(`steps_${today}`, String(result.steps));
          return;
        }
        const stored = await AsyncStorage.getItem(`steps_${today}`);
        const baseSteps = stored ? parseInt(stored, 10) : 0;
        const totalSteps = Math.max(baseSteps, result.steps);
        setSteps(totalSteps);
        await AsyncStorage.setItem(`steps_${today}`, String(totalSteps));
      });
    } catch (e) {
      console.warn('Step counter watch error:', e);
    }
  };

  const saveSteps = async (count) => {
    const today = getDateKey();
    setSteps(count);
    await AsyncStorage.setItem(`steps_${today}`, String(count));
  };

  return {
    steps,
    isAvailable,
    permissionGranted,
    isExpoGo,
    saveSteps,
    reload: loadTodaySteps,
    retryPermission,
  };
}
