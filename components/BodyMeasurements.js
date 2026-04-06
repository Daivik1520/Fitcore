import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-gifted-charts';
import { COLORS, FONTS, SPACING, RADIUS, BUTTON } from '../constants/theme';
import { getDateKey } from '../utils/progress';

const MEASUREMENTS = [
  { key: 'chest', label: 'Chest', icon: 'body-outline' },
  { key: 'waist', label: 'Waist', icon: 'body-outline' },
  { key: 'hips', label: 'Hips', icon: 'body-outline' },
  { key: 'leftArm', label: 'Left Arm', icon: 'fitness-outline' },
  { key: 'rightArm', label: 'Right Arm', icon: 'fitness-outline' },
  { key: 'leftThigh', label: 'Left Thigh', icon: 'walk-outline' },
  { key: 'rightThigh', label: 'Right Thigh', icon: 'walk-outline' },
];

export default function BodyMeasurements() {
  const [log, setLog] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState({});
  const [selectedChart, setSelectedChart] = useState(null);

  useEffect(() => {
    loadLog();
  }, []);

  const loadLog = async () => {
    try {
      const stored = await AsyncStorage.getItem('body_measurements');
      if (stored) setLog(JSON.parse(stored));
    } catch {}
  };

  const saveEntry = async () => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    const entry = { date: getDateKey(), ...inputs };
    // Only save if at least one measurement
    const hasData = Object.values(inputs).some(v => v && parseFloat(v) > 0);
    if (!hasData) { setShowModal(false); return; }

    const numericEntry = { date: entry.date };
    for (const m of MEASUREMENTS) {
      if (inputs[m.key]) numericEntry[m.key] = parseFloat(inputs[m.key]);
    }

    const updated = [...log.filter(e => e.date !== getDateKey()), numericEntry];
    setLog(updated);
    await AsyncStorage.setItem('body_measurements', JSON.stringify(updated));
    setShowModal(false);
    setInputs({});
  };

  const latest = log.length > 0 ? log[log.length - 1] : null;
  const prev = log.length > 1 ? log[log.length - 2] : null;

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
          <Ionicons name="resize-outline" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            Body Measurements
          </Text>
        </View>
        <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium }}>
          {log.length} entries
        </Text>
      </View>

      {/* Current measurements */}
      {latest ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
          {MEASUREMENTS.map(m => {
            const val = latest[m.key];
            if (!val) return null;
            const prevVal = prev?.[m.key];
            const diff = prevVal ? val - prevVal : null;
            return (
              <TouchableOpacity
                key={m.key}
                onPress={() => setSelectedChart(selectedChart === m.key ? null : m.key)}
                activeOpacity={0.7}
                style={{
                  backgroundColor: selectedChart === m.key ? COLORS.primary + '15' : COLORS.surface2,
                  borderRadius: 12,
                  padding: 10,
                  minWidth: '30%',
                  flex: 1,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLORS.textFaint, fontSize: 10, ...FONTS.regular }}>{m.label}</Text>
                <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginTop: 2 }}>{val}</Text>
                {diff !== null && diff !== 0 && (
                  <Text style={{
                    color: diff < 0 ? COLORS.success : COLORS.secondary,
                    fontSize: 10, ...FONTS.bold, marginTop: 1,
                  }}>
                    {diff > 0 ? '+' : ''}{diff.toFixed(1)} cm
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ) : (
        <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, marginBottom: 14 }}>
          No measurements logged yet. Track your body changes over time.
        </Text>
      )}

      {/* Mini chart for selected measurement */}
      {selectedChart && log.length > 1 && (
        <View style={{ marginBottom: 14 }}>
          <LineChart
            data={log
              .filter(e => e[selectedChart])
              .map(e => ({
                value: e[selectedChart],
                label: e.date.slice(5),
              }))}
            width={260}
            height={100}
            color={COLORS.primary}
            thickness={2}
            dataPointsColor={COLORS.primaryLight}
            dataPointsRadius={3}
            yAxisTextStyle={{ color: COLORS.textFaint, fontSize: 9 }}
            xAxisLabelTextStyle={{ color: COLORS.textMuted, fontSize: 8 }}
            yAxisThickness={0}
            xAxisThickness={0}
            backgroundColor="transparent"
            hideRules
            isAnimated
          />
        </View>
      )}

      {/* Log button */}
      <TouchableOpacity
        onPress={() => {
          const prefill = {};
          if (latest) {
            for (const m of MEASUREMENTS) {
              if (latest[m.key]) prefill[m.key] = latest[m.key].toString();
            }
          }
          setInputs(prefill);
          setShowModal(true);
        }}
        activeOpacity={0.7}
        style={{
          backgroundColor: COLORS.primary,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: '#fff', fontSize: 14, ...FONTS.bold }}>Log Measurements</Text>
      </TouchableOpacity>

      {/* Input Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: COLORS.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 50,
          }}>
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.textFaint }} />
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 20 }} keyboardShouldPersistTaps="handled">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
                <Text style={{ color: COLORS.text, fontSize: 22, ...FONTS.bold }}>Log Measurements</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
                </TouchableOpacity>
              </View>
              <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.regular, marginBottom: SPACING.md }}>
                All measurements in centimeters (cm)
              </Text>
              {MEASUREMENTS.map(m => (
                <View key={m.key} style={{
                  flexDirection: 'row', alignItems: 'center',
                  marginBottom: 10,
                }}>
                  <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.medium, width: 100 }}>
                    {m.label}
                  </Text>
                  <TextInput
                    value={inputs[m.key] || ''}
                    onChangeText={t => setInputs(prev => ({ ...prev, [m.key]: t }))}
                    keyboardType="decimal-pad"
                    placeholder="—"
                    placeholderTextColor={COLORS.textFaint}
                    style={{
                      flex: 1,
                      backgroundColor: COLORS.surface,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      color: COLORS.text,
                      fontSize: 16,
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      ...FONTS.medium,
                      textAlign: 'center',
                    }}
                  />
                </View>
              ))}
              <TouchableOpacity onPress={saveEntry} style={{ ...BUTTON.primary, marginTop: SPACING.md }}>
                <Text style={BUTTON.primaryText}>Save</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
