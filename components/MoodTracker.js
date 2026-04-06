import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { getDateKey } from '../utils/progress';

const CATEGORIES = [
  { key: 'energy', label: 'Energy', icon: 'flash-outline', color: '#FFB347' },
  { key: 'sleep', label: 'Sleep', icon: 'moon-outline', color: '#6C63FF' },
  { key: 'soreness', label: 'Soreness', icon: 'bandage-outline', color: '#FF6584' },
];

export default function MoodTracker() {
  const [checkin, setCheckin] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    loadToday();
  }, []);

  const loadToday = async () => {
    try {
      const key = `checkin_${getDateKey()}`;
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        setCheckin(JSON.parse(stored));
        setDone(true);
      } else {
        setCheckin({ energy: 0, sleep: 0, soreness: 0 });
      }
    } catch {
      setCheckin({ energy: 0, sleep: 0, soreness: 0 });
    }
  };

  const setRating = async (category, value) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    const updated = { ...checkin, [category]: value };
    setCheckin(updated);

    // Auto-save when all 3 are set
    const allSet = CATEGORIES.every(c => updated[c.key] > 0);
    if (allSet) {
      await AsyncStorage.setItem(`checkin_${getDateKey()}`, JSON.stringify(updated));
      setDone(true);
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}

      // Also store in history for insights
      try {
        const histStr = await AsyncStorage.getItem('checkin_history');
        const history = histStr ? JSON.parse(histStr) : [];
        history.push({ date: getDateKey(), ...updated });
        // Keep last 90 days
        const trimmed = history.slice(-90);
        await AsyncStorage.setItem('checkin_history', JSON.stringify(trimmed));
      } catch {}
    }
  };

  if (!checkin) return null;

  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: done ? COLORS.success + '30' : COLORS.border,
      padding: 18,
      marginTop: SPACING.md,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name={done ? 'checkmark-circle' : 'heart-outline'} size={20} color={done ? COLORS.success : COLORS.secondary} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            {done ? 'Checked In' : 'Daily Check-In'}
          </Text>
        </View>
        {done && (
          <Text style={{ color: COLORS.success, fontSize: 12, ...FONTS.medium }}>Done</Text>
        )}
      </View>

      {!done && (
        <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.regular, marginBottom: 14 }}>
          How are you feeling today?
        </Text>
      )}

      {CATEGORIES.map(cat => (
        <View key={cat.key} style={{ marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name={cat.icon} size={16} color={cat.color} />
            <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium, marginLeft: 6 }}>
              {cat.label}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(val => (
              <TouchableOpacity
                key={val}
                onPress={() => !done && setRating(cat.key, val)}
                activeOpacity={done ? 1 : 0.6}
                style={{
                  flex: 1,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: checkin[cat.key] >= val ? cat.color + '25' : COLORS.surface2,
                  borderWidth: checkin[cat.key] === val ? 1.5 : 0,
                  borderColor: cat.color + '60',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{
                  color: checkin[cat.key] >= val ? cat.color : COLORS.textFaint,
                  fontSize: 14,
                  ...FONTS.bold,
                }}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}
