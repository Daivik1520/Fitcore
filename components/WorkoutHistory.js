import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { getWorkoutLog } from '../utils/progress';
import exercises from '../data/exercises';

export default function WorkoutHistory() {
  const [log, setLog] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getWorkoutLog();
    setLog(data.reverse().slice(0, 50));
  };

  if (log.length === 0) return null;

  const recent = log.slice(0, 3);

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
          <Ionicons name="time-outline" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.bold, marginLeft: 8 }}>
            Recent Workouts
          </Text>
        </View>
        {log.length > 3 && (
          <TouchableOpacity onPress={() => setShowAll(true)}>
            <Text style={{ color: COLORS.primary, fontSize: 13, ...FONTS.medium }}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {recent.map((entry, i) => (
        <WorkoutEntry key={i} entry={entry} />
      ))}

      {/* Full history modal */}
      <Modal visible={showAll} transparent animationType="slide">
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
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md }}>
              <Text style={{ color: COLORS.text, fontSize: 22, ...FONTS.bold }}>Workout History</Text>
              <TouchableOpacity onPress={() => setShowAll(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 20 }}>
              {log.map((entry, i) => (
                <WorkoutEntry key={i} entry={entry} />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function WorkoutEntry({ entry }) {
  const totalSets = entry.exercises
    ? entry.exercises.reduce((s, e) => s + (e.setsCompleted || 0), 0)
    : 0;
  const totalReps = entry.exercises
    ? entry.exercises.reduce((s, e) => s + (e.repsPerSet ? e.repsPerSet.reduce((a, b) => a + b, 0) : 0), 0)
    : 0;

  const exNames = entry.exercises
    ? entry.exercises.slice(0, 3).map(e => exercises[e.id]?.name || e.id).join(', ')
    : '';

  const dateLabel = formatDateLabel(entry.date);

  return (
    <View style={{
      backgroundColor: COLORS.surface2,
      borderRadius: 14,
      padding: 14,
      marginBottom: 8,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: COLORS.text, fontSize: 14, ...FONTS.bold }}>
          {dateLabel}
        </Text>
        <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.regular }}>
          {entry.durationMin || 0} min
        </Text>
      </View>
      <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginTop: 4 }} numberOfLines={1}>
        {exNames}{entry.exercises && entry.exercises.length > 3 ? ` +${entry.exercises.length - 3} more` : ''}
      </Text>
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
        <MiniStat label="Sets" value={totalSets} />
        <MiniStat label="Reps" value={totalReps} />
        <MiniStat label="Exercises" value={entry.exercises?.length || 0} />
      </View>
    </View>
  );
}

function MiniStat({ label, value }) {
  return (
    <View>
      <Text style={{ color: COLORS.text, fontSize: 14, ...FONTS.bold }}>{value}</Text>
      <Text style={{ color: COLORS.textFaint, fontSize: 10, ...FONTS.regular }}>{label}</Text>
    </View>
  );
}

function formatDateLabel(dateStr) {
  if (!dateStr) return 'Unknown';
  try {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((today - d) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
