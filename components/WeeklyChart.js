import React from 'react';
import { View, Text } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { COLORS, FONTS, SPACING, CARD } from '../constants/theme';

export default function WeeklyChart({ data = [], goal = 10000 }) {
  const barData = data.map((d, i) => ({
    value: d.steps,
    label: d.dayLabel,
    frontColor: i === data.length - 1 ? COLORS.primaryLight : COLORS.primary,
    topLabelComponent: () => (
      <Text style={{ color: COLORS.textFaint, fontSize: 10, ...FONTS.regular, marginBottom: 4 }}>
        {d.steps > 999 ? `${(d.steps / 1000).toFixed(1)}k` : d.steps}
      </Text>
    ),
  }));

  const maxValue = Math.max(...data.map(d => d.steps), goal) * 1.2;

  return (
    <View style={{ ...CARD, marginTop: SPACING.md }}>
      <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginBottom: SPACING.md }}>
        This Week
      </Text>
      {data.length > 0 ? (
        <BarChart
          data={barData}
          width={280}
          height={160}
          barWidth={28}
          spacing={12}
          maxValue={maxValue || 10000}
          noOfSections={4}
          barBorderRadius={6}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={COLORS.border}
          yAxisTextStyle={{ color: COLORS.textFaint, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: COLORS.textMuted, fontSize: 11 }}
          backgroundColor={COLORS.surface}
          rulesColor={COLORS.border}
          rulesType="dashed"
          hideRules={false}
          showReferenceLine1
          referenceLine1Position={goal}
          referenceLine1Config={{
            color: COLORS.warning,
            dashWidth: 4,
            dashGap: 4,
          }}
          isAnimated
          animationDuration={600}
        />
      ) : (
        <Text style={{ color: COLORS.textMuted, fontSize: 14, textAlign: 'center', padding: SPACING.lg }}>
          No step data yet. Start walking!
        </Text>
      )}
    </View>
  );
}
