import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-gifted-charts';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { getExerciseRecords } from '../utils/progress';
import exercises from '../data/exercises';

export default function ProgressOverload() {
  const [records, setRecords] = useState({});
  const [selectedEx, setSelectedEx] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const rec = await getExerciseRecords();
    setRecords(rec);
  };

  // Get exercises with history
  const exercisesWithHistory = Object.entries(records)
    .filter(([id, rec]) => rec.history && rec.history.length >= 2 && exercises[id])
    .map(([id, rec]) => ({
      id,
      name: exercises[id].name,
      history: rec.history.sort((a, b) => a.date.localeCompare(b.date)),
      bestReps: rec.bestReps,
      improvement: rec.history.length >= 2
        ? rec.history[rec.history.length - 1].reps - rec.history[0].reps
        : 0,
    }))
    .sort((a, b) => b.history.length - a.history.length);

  if (exercisesWithHistory.length === 0) {
    return (
      <View style={{
        backgroundColor: COLORS.surface,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: 18,
        marginTop: SPACING.md,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Ionicons name="trending-up" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            Progressive Overload
          </Text>
        </View>
        <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular }}>
          Complete a few workouts to see your progression charts here.
        </Text>
      </View>
    );
  }

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
          <Ionicons name="trending-up" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            Progressive Overload
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowModal(true)}>
          <Text style={{ color: COLORS.primary, fontSize: 13, ...FONTS.medium }}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Top 3 improving exercises */}
      {exercisesWithHistory.slice(0, 3).map(ex => (
        <TouchableOpacity
          key={ex.id}
          onPress={() => { setSelectedEx(ex); setShowModal(true); }}
          activeOpacity={0.7}
          style={{
            backgroundColor: COLORS.surface2,
            borderRadius: 14,
            padding: 14,
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.text, fontSize: 14, ...FONTS.bold }}>{ex.name}</Text>
            <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginTop: 2 }}>
              {ex.history.length} sessions · Best: {ex.bestReps}
            </Text>
          </View>
          <View style={{
            backgroundColor: ex.improvement > 0 ? COLORS.success + '20' : COLORS.textFaint + '20',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
          }}>
            <Text style={{
              color: ex.improvement > 0 ? COLORS.success : COLORS.textFaint,
              fontSize: 13,
              ...FONTS.bold,
            }}>
              {ex.improvement > 0 ? '+' : ''}{ex.improvement}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Detail Modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: COLORS.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '85%',
            paddingBottom: 40,
          }}>
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.textFaint }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md }}>
              <Text style={{ color: COLORS.text, fontSize: 22, ...FONTS.bold }}>
                {selectedEx ? selectedEx.name : 'Progression'}
              </Text>
              <TouchableOpacity onPress={() => { setShowModal(false); setSelectedEx(null); }}>
                <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 20 }}>
              {selectedEx ? (
                <ExerciseChart exercise={selectedEx} />
              ) : (
                exercisesWithHistory.map(ex => (
                  <TouchableOpacity
                    key={ex.id}
                    onPress={() => setSelectedEx(ex)}
                    activeOpacity={0.7}
                    style={{
                      backgroundColor: COLORS.surface,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: COLORS.border,
                      padding: 14,
                      marginBottom: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: COLORS.text, fontSize: 15, ...FONTS.medium }}>{ex.name}</Text>
                      <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular }}>
                        {ex.history.length} sessions
                      </Text>
                    </View>
                    <Text style={{
                      color: ex.improvement > 0 ? COLORS.success : COLORS.textMuted,
                      fontSize: 14, ...FONTS.bold,
                    }}>
                      {ex.improvement > 0 ? '+' : ''}{ex.improvement} reps
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function ExerciseChart({ exercise }) {
  const chartData = exercise.history.map((h, i) => ({
    value: h.reps,
    label: h.date ? h.date.slice(5) : `#${i + 1}`,
    dataPointText: h.reps.toString(),
  }));

  const first = exercise.history[0]?.reps || 0;
  const last = exercise.history[exercise.history.length - 1]?.reps || 0;
  const pctChange = first > 0 ? Math.round(((last - first) / first) * 100) : 0;

  return (
    <View>
      {/* Summary */}
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: SPACING.lg }}>
        <View style={{ flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.regular }}>First Session</Text>
          <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold, marginTop: 4 }}>{first}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: COLORS.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border }}>
          <Text style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.regular }}>Latest</Text>
          <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold, marginTop: 4 }}>{last}</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: pctChange > 0 ? COLORS.success + '10' : COLORS.surface, borderRadius: 14, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: pctChange > 0 ? COLORS.success + '30' : COLORS.border }}>
          <Text style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.regular }}>Change</Text>
          <Text style={{ color: pctChange > 0 ? COLORS.success : COLORS.textMuted, fontSize: 20, ...FONTS.bold, marginTop: 4 }}>
            {pctChange > 0 ? '+' : ''}{pctChange}%
          </Text>
        </View>
      </View>

      {/* Chart */}
      {chartData.length > 1 && (
        <LineChart
          data={chartData}
          width={260}
          height={160}
          color={COLORS.primary}
          thickness={2}
          dataPointsColor={COLORS.primaryLight}
          dataPointsRadius={4}
          startFillColor={COLORS.primary + '30'}
          endFillColor={COLORS.primary + '05'}
          areaChart
          yAxisTextStyle={{ color: COLORS.textFaint, fontSize: 10 }}
          xAxisLabelTextStyle={{ color: COLORS.textMuted, fontSize: 9 }}
          yAxisThickness={0}
          xAxisThickness={1}
          xAxisColor={COLORS.border}
          backgroundColor="transparent"
          rulesColor={COLORS.border}
          isAnimated
          textColor={COLORS.textMuted}
          textFontSize={10}
          textShiftY={-8}
        />
      )}
    </View>
  );
}
