import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { getWorkoutLog } from '../utils/progress';
import exercises from '../data/exercises';

const MUSCLE_GROUPS = [
  { key: 'CHEST', label: 'Chest', icon: 'fitness-outline' },
  { key: 'SHOULDERS', label: 'Shoulders', icon: 'fitness-outline' },
  { key: 'TRICEPS', label: 'Triceps', icon: 'fitness-outline' },
  { key: 'BACK', label: 'Back', icon: 'arrow-down-outline' },
  { key: 'LEGS', label: 'Legs', icon: 'walk-outline' },
  { key: 'GLUTES', label: 'Glutes', icon: 'walk-outline' },
  { key: 'CALVES', label: 'Calves', icon: 'walk-outline' },
  { key: 'CORE', label: 'Core', icon: 'body-outline' },
  { key: 'CARDIO', label: 'Cardio', icon: 'flash-outline' },
  { key: 'FLEXIBILITY', label: 'Flexibility', icon: 'leaf-outline' },
];

export default function MuscleHeatMap() {
  const [heatData, setHeatData] = useState({});

  useEffect(() => {
    loadHeatData();
  }, []);

  const loadHeatData = async () => {
    try {
      const log = await getWorkoutLog();
      const last14Days = new Date();
      last14Days.setDate(last14Days.getDate() - 14);
      const dateStr = `${last14Days.getFullYear()}-${String(last14Days.getMonth() + 1).padStart(2, '0')}-${String(last14Days.getDate()).padStart(2, '0')}`;

      const recent = log.filter(w => w.date >= dateStr);
      const counts = {};

      for (const workout of recent) {
        if (!workout.exercises) continue;
        for (const ex of workout.exercises) {
          const exData = exercises[ex.id];
          if (!exData) continue;
          const tag = exData.muscleTag;
          counts[tag] = (counts[tag] || 0) + (ex.setsCompleted || 1);
        }
      }

      setHeatData(counts);
    } catch {}
  };

  const maxCount = Math.max(1, ...Object.values(heatData));

  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 18,
      marginTop: SPACING.md,
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Ionicons name="body-outline" size={20} color={COLORS.primary} />
        <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
          Muscle Activity (14 days)
        </Text>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {MUSCLE_GROUPS.map(group => {
          const count = heatData[group.key] || 0;
          const intensity = count / maxCount;
          const bgColor = count === 0
            ? COLORS.surface2
            : intensity > 0.7
              ? COLORS.success + '35'
              : intensity > 0.3
                ? COLORS.primary + '25'
                : COLORS.primary + '10';
          const textColor = count === 0 ? COLORS.textFaint : COLORS.text;
          const iconColor = count === 0
            ? COLORS.textFaint
            : intensity > 0.7
              ? COLORS.success
              : COLORS.primary;

          return (
            <View
              key={group.key}
              style={{
                width: '31%',
                backgroundColor: bgColor,
                borderRadius: 14,
                padding: 12,
                alignItems: 'center',
              }}
            >
              <Ionicons name={group.icon} size={20} color={iconColor} />
              <Text style={{ color: textColor, fontSize: 11, ...FONTS.medium, marginTop: 6, textAlign: 'center' }}>
                {group.label}
              </Text>
              {count > 0 && (
                <Text style={{ color: iconColor, fontSize: 10, ...FONTS.bold, marginTop: 2 }}>
                  {count} sets
                </Text>
              )}
            </View>
          );
        })}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 14, gap: 16 }}>
        <LegendDot color={COLORS.textFaint} label="Not trained" />
        <LegendDot color={COLORS.primary} label="Light" />
        <LegendDot color={COLORS.success} label="Heavy" />
      </View>
    </View>
  );
}

function LegendDot({ color, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 5 }} />
      <Text style={{ color: COLORS.textFaint, fontSize: 10, ...FONTS.regular }}>{label}</Text>
    </View>
  );
}
