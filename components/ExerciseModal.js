import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import exerciseData from '../data/exercises';

export default function ExerciseModal({ exerciseId, visible, onClose }) {
  const ex = exerciseData[exerciseId];
  if (!ex) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'flex-end',
      }}>
        <View style={{
          backgroundColor: COLORS.surface,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: '85%',
          paddingBottom: 40,
        }}>
          {/* Handle bar */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.textFaint }} />
          </View>

          <ScrollView
            contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.text, fontSize: 24, ...FONTS.bold }}>
                  {ex.name}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                  <TagPill text={ex.muscleTag} color={COLORS.primary} />
                  <TagPill text={`Difficulty ${ex.difficulty}/5`} color={getDiffColor(ex.difficulty)} />
                  {ex.equipment !== 'none' && (
                    <TagPill text={ex.equipment} color={COLORS.warning} />
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={onClose} style={{ padding: 4 }}>
                <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
              </TouchableOpacity>
            </View>

            {/* Muscles */}
            <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, marginBottom: SPACING.lg }}>
              Muscles: {ex.muscle}
            </Text>

            {/* Muscle icon */}
            <View style={{
              backgroundColor: COLORS.surface2,
              borderRadius: 20,
              padding: SPACING.xl,
              alignItems: 'center',
              marginBottom: SPACING.lg,
            }}>
              <Ionicons name={getGroupIcon(ex.muscleGroup)} size={64} color={COLORS.primary + '60'} />
              <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginTop: 8 }}>
                {ex.muscleGroup.toUpperCase()}
              </Text>
            </View>

            {/* Instructions */}
            <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginBottom: SPACING.md }}>
              How to do it
            </Text>
            {ex.instructions.map((step, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 12 }}>
                <View style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: COLORS.primary + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  marginTop: 1,
                }}>
                  <Text style={{ color: COLORS.primary, fontSize: 12, ...FONTS.bold }}>
                    {i + 1}
                  </Text>
                </View>
                <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, flex: 1, lineHeight: 22 }}>
                  {step}
                </Text>
              </View>
            ))}

            {/* Common Mistakes */}
            <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginTop: SPACING.md, marginBottom: SPACING.md }}>
              Common mistakes
            </Text>
            {ex.commonMistakes.map((mistake, i) => (
              <View key={i} style={{ flexDirection: 'row', marginBottom: 10, alignItems: 'flex-start' }}>
                <Ionicons name="close-circle" size={18} color={COLORS.secondary} style={{ marginRight: 10, marginTop: 2 }} />
                <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, flex: 1, lineHeight: 22 }}>
                  {mistake}
                </Text>
              </View>
            ))}

            {/* Stats */}
            <View style={{
              flexDirection: 'row',
              gap: 10,
              marginTop: SPACING.lg,
            }}>
              <InfoBox label="Cal / Rep" value={ex.caloriesPerRep.toString()} />
              <InfoBox label="Equipment" value={ex.equipment === 'none' ? 'None' : ex.equipment} />
              <InfoBox label="Type" value={ex.isHold ? 'Hold' : 'Reps'} />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function TagPill({ text, color }) {
  return (
    <View style={{
      backgroundColor: color + '15',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: RADIUS.pill,
    }}>
      <Text style={{ color, fontSize: 11, ...FONTS.bold }}>{text}</Text>
    </View>
  );
}

function InfoBox({ label, value }) {
  return (
    <View style={{
      flex: 1,
      backgroundColor: COLORS.surface2,
      borderRadius: 14,
      padding: 14,
      alignItems: 'center',
    }}>
      <Text style={{ color: COLORS.text, fontSize: 15, ...FONTS.bold }}>{value}</Text>
      <Text style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.regular, marginTop: 3 }}>{label}</Text>
    </View>
  );
}

function getDiffColor(d) {
  if (d <= 1) return '#43E97B';
  if (d <= 2) return '#4ECDC4';
  if (d <= 3) return '#FFB347';
  if (d <= 4) return '#FF6584';
  return '#FF2D55';
}

function getGroupIcon(group) {
  switch (group) {
    case 'push': return 'fitness-outline';
    case 'pull': return 'arrow-down-outline';
    case 'legs': return 'walk-outline';
    case 'core': return 'body-outline';
    case 'cardio': return 'flash-outline';
    case 'flexibility': return 'leaf-outline';
    default: return 'barbell-outline';
  }
}
