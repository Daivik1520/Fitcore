import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function BMICard({ weightKg, heightCm }) {
  if (!weightKg || !heightCm || heightCm < 100) return null;

  const heightM = heightCm / 100;
  const bmi = (weightKg / (heightM * heightM)).toFixed(1);
  const { label, color } = getBMICategory(parseFloat(bmi));

  // Bar position (BMI 15-40 range mapped to 0-100%)
  const barPos = Math.min(100, Math.max(0, ((parseFloat(bmi) - 15) / 25) * 100));

  return (
    <View style={{
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 18,
      marginTop: SPACING.md,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="analytics-outline" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            BMI
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={{ color, fontSize: 24, ...FONTS.bold }}>{bmi}</Text>
          <Text style={{ color, fontSize: 13, ...FONTS.medium, marginLeft: 6 }}>{label}</Text>
        </View>
      </View>

      {/* Color bar */}
      <View style={{
        height: 8,
        borderRadius: 4,
        flexDirection: 'row',
        overflow: 'hidden',
        marginBottom: 6,
      }}>
        <View style={{ flex: 1, backgroundColor: '#00B4D8' }} />
        <View style={{ flex: 1, backgroundColor: '#43E97B' }} />
        <View style={{ flex: 1, backgroundColor: '#FFB347' }} />
        <View style={{ flex: 1, backgroundColor: '#FF6584' }} />
      </View>

      {/* Indicator */}
      <View style={{ position: 'relative', height: 12 }}>
        <View style={{
          position: 'absolute',
          left: `${barPos}%`,
          marginLeft: -5,
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: color,
          borderWidth: 2,
          borderColor: COLORS.background,
        }} />
      </View>

      {/* Labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
        <Text style={{ color: COLORS.textFaint, fontSize: 9, ...FONTS.regular }}>Underweight</Text>
        <Text style={{ color: COLORS.textFaint, fontSize: 9, ...FONTS.regular }}>Normal</Text>
        <Text style={{ color: COLORS.textFaint, fontSize: 9, ...FONTS.regular }}>Overweight</Text>
        <Text style={{ color: COLORS.textFaint, fontSize: 9, ...FONTS.regular }}>Obese</Text>
      </View>
    </View>
  );
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', color: '#00B4D8' };
  if (bmi < 25) return { label: 'Normal', color: '#43E97B' };
  if (bmi < 30) return { label: 'Overweight', color: '#FFB347' };
  return { label: 'Obese', color: '#FF6584' };
}
