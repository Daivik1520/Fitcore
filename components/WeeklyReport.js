import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { getStepsForRange, getWorkoutLog, getBodyWeightLog } from '../utils/progress';

export default function WeeklyReport() {
  const [report, setReport] = useState(null);

  useEffect(() => {
    loadReport();
  }, []);

  const loadReport = async () => {
    try {
      const thisWeek = await getStepsForRange(7);
      const lastWeek = await getStepsForRange(14);

      const thisWeekSteps = thisWeek.reduce((s, d) => s + d.steps, 0);
      const lastWeekSteps = lastWeek.slice(0, 7).reduce((s, d) => s + d.steps, 0);

      const log = await getWorkoutLog();
      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fourteenDaysAgo = new Date(today);
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

      const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      const thisWeekWorkouts = log.filter(w => w.date >= fmt(sevenDaysAgo)).length;
      const lastWeekWorkouts = log.filter(w => w.date >= fmt(fourteenDaysAgo) && w.date < fmt(sevenDaysAgo)).length;

      const weightLog = await getBodyWeightLog();
      let weightChange = null;
      if (weightLog.length >= 2) {
        weightChange = weightLog[weightLog.length - 1].weightKg - weightLog[weightLog.length - 2].weightKg;
      }

      setReport({
        thisWeekSteps,
        lastWeekSteps,
        stepsDiff: thisWeekSteps - lastWeekSteps,
        thisWeekWorkouts,
        lastWeekWorkouts,
        workoutDiff: thisWeekWorkouts - lastWeekWorkouts,
        weightChange,
        avgSteps: Math.round(thisWeekSteps / 7),
      });
    } catch {}
  };

  if (!report) return null;

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
        <Ionicons name="newspaper-outline" size={20} color={COLORS.primary} />
        <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
          Weekly Summary
        </Text>
      </View>

      <View style={{ gap: 10 }}>
        <ReportRow
          icon="footsteps-outline"
          label="Total Steps"
          value={report.thisWeekSteps.toLocaleString()}
          diff={report.stepsDiff}
          diffLabel="vs last week"
        />
        <ReportRow
          icon="barbell-outline"
          label="Workouts"
          value={report.thisWeekWorkouts.toString()}
          diff={report.workoutDiff}
          diffLabel="vs last week"
        />
        <ReportRow
          icon="speedometer-outline"
          label="Daily Average"
          value={`${report.avgSteps.toLocaleString()} steps`}
          diff={null}
        />
        {report.weightChange !== null && (
          <ReportRow
            icon="scale-outline"
            label="Weight Change"
            value={`${report.weightChange > 0 ? '+' : ''}${report.weightChange.toFixed(1)} kg`}
            diff={null}
            valueColor={report.weightChange === 0 ? COLORS.textMuted : report.weightChange < 0 ? COLORS.success : COLORS.secondary}
          />
        )}
      </View>
    </View>
  );
}

function ReportRow({ icon, label, value, diff, diffLabel, valueColor }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface2,
      borderRadius: 14,
      padding: 14,
    }}>
      <Ionicons name={icon} size={18} color={COLORS.primary} style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.regular }}>{label}</Text>
        <Text style={{ color: valueColor || COLORS.text, fontSize: 16, ...FONTS.bold, marginTop: 2 }}>
          {value}
        </Text>
      </View>
      {diff !== null && diff !== undefined && (
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{
            color: diff >= 0 ? COLORS.success : COLORS.secondary,
            fontSize: 13,
            ...FONTS.bold,
          }}>
            {diff >= 0 ? '+' : ''}{typeof diff === 'number' && Math.abs(diff) > 999 ? `${(diff / 1000).toFixed(1)}k` : diff}
          </Text>
          {diffLabel && (
            <Text style={{ color: COLORS.textFaint, fontSize: 10, ...FONTS.regular }}>{diffLabel}</Text>
          )}
        </View>
      )}
    </View>
  );
}
