import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';

const SIZE = 220;
const STROKE_WIDTH = 6;
const R = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

const PRESETS = [
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '20 min', seconds: 1200 },
];

export default function FocusTimer() {
  const [visible, setVisible] = useState(false);
  const [duration, setDuration] = useState(600);
  const [remaining, setRemaining] = useState(600);
  const [running, setRunning] = useState(false);
  const [intervalBell, setIntervalBell] = useState(60); // haptic every 60s
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
            return 0;
          }
          // Interval bell
          if (intervalBell > 0 && prev % intervalBell === 0 && prev !== duration) {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); } catch {}
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, intervalBell, duration]);

  const toggle = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      setRunning(true);
    }
  };

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setRemaining(duration);
  };

  const selectDuration = (secs) => {
    setDuration(secs);
    setRemaining(secs);
    setRunning(false);
  };

  const progress = remaining / duration;
  const dashOffset = CIRCUMFERENCE * (1 - progress);
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 18,
          marginTop: SPACING.md,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{
          width: 44, height: 44, borderRadius: 14,
          backgroundColor: '#9B59B6' + '20',
          alignItems: 'center', justifyContent: 'center', marginRight: 14,
        }}>
          <Ionicons name="timer-outline" size={22} color="#9B59B6" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold }}>Focus Timer</Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.regular }}>
            Meditation & sustained holds
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textFaint} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <View style={{
          flex: 1, backgroundColor: COLORS.background,
          alignItems: 'center', justifyContent: 'center', padding: SPACING.lg,
        }}>
          {/* Close */}
          <TouchableOpacity
            onPress={() => { reset(); setVisible(false); }}
            style={{ position: 'absolute', top: 56, right: SPACING.lg }}
          >
            <Ionicons name="close" size={28} color={COLORS.textMuted} />
          </TouchableOpacity>

          <Text style={{ color: COLORS.textMuted, fontSize: 16, ...FONTS.medium, marginBottom: SPACING.xl }}>
            FOCUS
          </Text>

          {/* Ring */}
          <View style={{ width: SIZE, height: SIZE, alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={SIZE} height={SIZE} style={{ position: 'absolute' }}>
              <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={COLORS.surface2} strokeWidth={STROKE_WIDTH} fill="none" />
              <Circle
                cx={SIZE / 2} cy={SIZE / 2} r={R}
                stroke="#9B59B6"
                strokeWidth={STROKE_WIDTH} fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                strokeLinecap="round"
                rotation="-90"
                origin={`${SIZE / 2}, ${SIZE / 2}`}
              />
            </Svg>
            <Text style={{ color: COLORS.text, fontSize: 48, ...FONTS.bold }}>
              {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
            </Text>
          </View>

          {/* Presets */}
          {!running && (
            <View style={{ flexDirection: 'row', gap: 8, marginTop: SPACING.xl }}>
              {PRESETS.map(p => (
                <TouchableOpacity
                  key={p.seconds}
                  onPress={() => selectDuration(p.seconds)}
                  style={{
                    paddingHorizontal: 16, paddingVertical: 8,
                    borderRadius: RADIUS.pill,
                    backgroundColor: duration === p.seconds ? '#9B59B6' + '25' : COLORS.surface2,
                    borderWidth: duration === p.seconds ? 1 : 0,
                    borderColor: '#9B59B6' + '50',
                  }}
                >
                  <Text style={{
                    color: duration === p.seconds ? '#9B59B6' : COLORS.textMuted,
                    fontSize: 13, ...FONTS.medium,
                  }}>
                    {p.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Interval bell */}
          {!running && (
            <View style={{ marginTop: SPACING.lg, alignItems: 'center' }}>
              <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginBottom: 8 }}>
                Haptic bell interval
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[0, 30, 60, 120].map(iv => (
                  <TouchableOpacity
                    key={iv}
                    onPress={() => setIntervalBell(iv)}
                    style={{
                      paddingHorizontal: 12, paddingVertical: 6,
                      borderRadius: RADIUS.pill,
                      backgroundColor: intervalBell === iv ? COLORS.surface2 : 'transparent',
                    }}
                  >
                    <Text style={{
                      color: intervalBell === iv ? COLORS.text : COLORS.textFaint,
                      fontSize: 12, ...FONTS.medium,
                    }}>
                      {iv === 0 ? 'Off' : `${iv}s`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Controls */}
          <View style={{ flexDirection: 'row', gap: 16, marginTop: SPACING.xxl }}>
            <TouchableOpacity
              onPress={reset}
              style={{
                width: 60, height: 60, borderRadius: 30,
                backgroundColor: COLORS.surface2,
                alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Ionicons name="refresh" size={24} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={toggle}
              style={{
                width: 80, height: 80, borderRadius: 40,
                backgroundColor: running ? COLORS.secondary + '20' : '#9B59B6',
                alignItems: 'center', justifyContent: 'center',
                borderWidth: running ? 2 : 0,
                borderColor: COLORS.secondary,
              }}
            >
              <Ionicons name={running ? 'pause' : 'play'} size={32} color={running ? COLORS.secondary : '#fff'} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
