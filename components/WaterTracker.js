import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { getDateKey } from '../utils/progress';

const GOAL = 8;

export default function WaterTracker() {
  const [glasses, setGlasses] = useState(0);

  useEffect(() => {
    loadToday();
  }, []);

  const loadToday = async () => {
    try {
      const key = `water_${getDateKey()}`;
      const val = await AsyncStorage.getItem(key);
      if (val) setGlasses(parseInt(val, 10));
    } catch {}
  };

  const addGlass = async () => {
    if (glasses >= 12) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    const newVal = glasses + 1;
    setGlasses(newVal);
    await AsyncStorage.setItem(`water_${getDateKey()}`, String(newVal));

    if (newVal === GOAL) {
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    }
  };

  const removeGlass = async () => {
    if (glasses <= 0) return;
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    const newVal = glasses - 1;
    setGlasses(newVal);
    await AsyncStorage.setItem(`water_${getDateKey()}`, String(newVal));
  };

  const progress = Math.min(glasses / GOAL, 1);
  const done = glasses >= GOAL;

  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: done ? '#00B4D830' : COLORS.border,
      padding: 18,
      marginTop: SPACING.md,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="water" size={20} color="#00B4D8" />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            Water
          </Text>
        </View>
        <Text style={{ color: done ? '#00B4D8' : COLORS.textMuted, fontSize: 14, ...FONTS.medium }}>
          {glasses}/{GOAL} glasses
        </Text>
      </View>

      {/* Glass icons row */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 }}>
        {Array.from({ length: GOAL }, (_, i) => (
          <View
            key={i}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              backgroundColor: i < glasses ? '#00B4D820' : COLORS.surface2,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name={i < glasses ? 'water' : 'water-outline'}
              size={16}
              color={i < glasses ? '#00B4D8' : COLORS.textFaint}
            />
          </View>
        ))}
      </View>

      {/* Progress bar */}
      <View style={{
        height: 4,
        backgroundColor: COLORS.surface2,
        borderRadius: 2,
        overflow: 'hidden',
        marginBottom: 14,
      }}>
        <View style={{
          height: 4,
          backgroundColor: '#00B4D8',
          borderRadius: 2,
          width: `${progress * 100}%`,
        }} />
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          onPress={removeGlass}
          activeOpacity={0.6}
          style={{
            flex: 1,
            height: 40,
            borderRadius: 10,
            backgroundColor: COLORS.surface2,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="remove" size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={addGlass}
          activeOpacity={0.7}
          style={{
            flex: 3,
            height: 40,
            borderRadius: 10,
            backgroundColor: '#00B4D815',
            borderWidth: 1,
            borderColor: '#00B4D830',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          <Ionicons name="add" size={18} color="#00B4D8" />
          <Text style={{ color: '#00B4D8', fontSize: 14, ...FONTS.medium, marginLeft: 6 }}>
            Add Glass
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
