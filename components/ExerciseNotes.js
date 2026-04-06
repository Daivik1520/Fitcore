import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING } from '../constants/theme';

export default function ExerciseNotes({ exerciseId }) {
  const [note, setNote] = useState('');
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadNote();
  }, [exerciseId]);

  const loadNote = async () => {
    try {
      const stored = await AsyncStorage.getItem(`note_${exerciseId}`);
      if (stored) setNote(stored);
    } catch {}
  };

  const saveNote = async () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    await AsyncStorage.setItem(`note_${exerciseId}`, note);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!editing && !note) {
    return (
      <TouchableOpacity
        onPress={() => setEditing(true)}
        activeOpacity={0.7}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginTop: 8,
        }}
      >
        <Ionicons name="create-outline" size={14} color={COLORS.textFaint} />
        <Text style={{ color: COLORS.textFaint, fontSize: 11, ...FONTS.regular, marginLeft: 4 }}>
          Add note
        </Text>
      </TouchableOpacity>
    );
  }

  if (!editing && note) {
    return (
      <TouchableOpacity
        onPress={() => setEditing(true)}
        activeOpacity={0.7}
        style={{
          backgroundColor: COLORS.warning + '10',
          borderRadius: 8,
          padding: 8,
          marginTop: 8,
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        <Ionicons name="document-text-outline" size={12} color={COLORS.warning} style={{ marginTop: 1, marginRight: 6 }} />
        <Text style={{ color: COLORS.warning, fontSize: 11, ...FONTS.regular, flex: 1 }} numberOfLines={2}>
          {note}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ marginTop: 8 }}>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="Add a personal note..."
        placeholderTextColor={COLORS.textFaint}
        multiline
        style={{
          backgroundColor: COLORS.surface2,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: COLORS.border,
          color: COLORS.text,
          fontSize: 13,
          padding: 10,
          minHeight: 50,
          ...FONTS.regular,
        }}
        autoFocus
      />
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
        <TouchableOpacity
          onPress={() => setEditing(false)}
          style={{
            flex: 1, height: 32, borderRadius: 8,
            backgroundColor: COLORS.surface2, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.medium }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={saveNote}
          style={{
            flex: 1, height: 32, borderRadius: 8,
            backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, ...FONTS.medium }}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
