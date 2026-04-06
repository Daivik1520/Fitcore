import React, { useState, useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS } from '../constants/theme';

export default function WorkoutTimer({ isRunning = false }) {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      startRef.current = Date.now() - elapsed * 1000;
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const mins = Math.floor(elapsed / 60);
  const secs = elapsed % 60;

  if (!isRunning && elapsed === 0) return null;

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.primary + '15',
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      alignSelf: 'flex-start',
      marginTop: 8,
    }}>
      <Ionicons name="timer-outline" size={16} color={COLORS.primary} />
      <Text style={{
        color: COLORS.primary,
        fontSize: 15,
        ...FONTS.bold,
        marginLeft: 6,
        fontVariant: ['tabular-nums'],
      }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </Text>
    </View>
  );
}
