import React from 'react';
import { View, Text } from 'react-native';
import { COLORS, FONTS, SPACING, CARD } from '../constants/theme';

export default function StreakCalendar({ workoutDates = [], stepGoalDates = [] }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const monthName = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const dayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDotColor = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const hasWorkout = workoutDates.includes(dateStr);
    const hasStepGoal = stepGoalDates.includes(dateStr);

    if (hasWorkout && hasStepGoal) return COLORS.gold;
    if (hasWorkout) return COLORS.success;
    if (hasStepGoal) return COLORS.primary;
    return COLORS.textFaint;
  };

  const isToday = (day) => day === today.getDate();

  const cells = [];
  // Add empty cells for days before the 1st
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(<View key={`empty-${i}`} style={{ width: 36, height: 36 }} />);
  }
  // Add day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const dotColor = getDotColor(d);
    cells.push(
      <View
        key={d}
        style={{
          width: 36,
          height: 36,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: dotColor === COLORS.textFaint ? 'transparent' : dotColor + '30',
          borderWidth: isToday(d) ? 1.5 : 0,
          borderColor: isToday(d) ? COLORS.primary : 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: dotColor,
          }} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ ...CARD, marginTop: SPACING.md }}>
      <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginBottom: SPACING.md }}>
        {monthName}
      </Text>

      {/* Day labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.xs }}>
        {dayLabels.map(label => (
          <Text key={label} style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.medium, width: 36, textAlign: 'center' }}>
            {label}
          </Text>
        ))}
      </View>

      {/* Calendar grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells}
      </View>

      {/* Legend */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.md, gap: SPACING.md }}>
        <LegendItem color={COLORS.success} label="Workout" />
        <LegendItem color={COLORS.primary} label="Steps Goal" />
        <LegendItem color={COLORS.gold} label="Both" />
      </View>
    </View>
  );
}

function LegendItem({ color, label }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color, marginRight: 4 }} />
      <Text style={{ color: COLORS.textMuted, fontSize: 11, ...FONTS.regular }}>{label}</Text>
    </View>
  );
}
