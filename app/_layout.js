import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments, useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/theme';

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const checkOnboarding = useCallback(async () => {
    try {
      const profile = await AsyncStorage.getItem('user_profile');
      if (profile) {
        const parsed = JSON.parse(profile);
        setOnboardingDone(!!parsed.onboardingComplete);
      } else {
        setOnboardingDone(false);
      }
    } catch {}
    setIsLoading(false);
  }, []);

  // Check on mount
  useEffect(() => {
    checkOnboarding();
  }, []);

  // Re-check every time a segment changes (i.e. after navigation)
  useEffect(() => {
    if (!isLoading) {
      checkOnboarding();
    }
  }, [segments]);

  // Route guard — only runs after loading and after the latest check
  useEffect(() => {
    if (isLoading) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!onboardingDone && !inOnboarding) {
      router.replace('/onboarding');
    } else if (onboardingDone && inOnboarding) {
      router.replace('/');
    }
  }, [isLoading, onboardingDone]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="onboarding"
          options={{ gestureEnabled: false }}
        />
      </Stack>
    </>
  );
}
