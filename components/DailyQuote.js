import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { MOTIVATIONAL_QUOTES } from '../data/programs';

export default function DailyQuote() {
  // Use day of year to rotate quotes
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  const quote = MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];

  return (
    <View style={{
      backgroundColor: COLORS.primary + '0A',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.primary + '20',
      padding: 20,
      marginTop: SPACING.md,
    }}>
      <Ionicons name="chatbubble-ellipses-outline" size={18} color={COLORS.primary} style={{ marginBottom: 10 }} />
      <Text style={{
        color: COLORS.textMuted,
        fontSize: 14,
        ...FONTS.regular,
        fontStyle: 'italic',
        lineHeight: 22,
      }}>
        "{quote}"
      </Text>
    </View>
  );
}
