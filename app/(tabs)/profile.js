import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Platform,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { COLORS, FONTS, SPACING, RADIUS, CARD, BUTTON } from '../../constants/theme';
import { getProfile, saveProfile, clearAllData } from '../../hooks/useStorage';
import { scheduleWorkoutReminder, requestNotificationPermissions } from '../../utils/notifications';
import { GOAL_TO_PROGRAM } from '../../data/programs';
import { exportAllDataAsCSV } from '../../utils/export';
import BMICard from '../../components/BMICard';
import AchievementBadges from '../../components/AchievementBadges';
import ThemeSelector from '../../components/ThemeSelector';
import { exportBackup } from '../../utils/backup';

const GOALS = [
  { key: 'fat_loss', emoji: '🔥', title: 'Fat Loss' },
  { key: 'muscle_gain', emoji: '💪', title: 'Muscle Gain' },
  { key: 'flexibility', emoji: '🧘', title: 'Flexibility' },
  { key: 'stamina', emoji: '🏃', title: 'Stamina' },
  { key: 'beginner', emoji: '🌱', title: 'Beginner' },
];

const LEVELS = ['beginner', 'intermediate', 'advanced'];
const REST_OPTIONS = [30, 60, 90, 120];

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({});
  const [reminderHour, setReminderHour] = useState(8);
  const [reminderMin, setReminderMin] = useState(0);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [restDuration, setRestDuration] = useState(60);
  const [weightUnit, setWeightUnit] = useState('kg');

  const loadProfile = async () => {
    const p = await getProfile();
    if (p) {
      setProfile(p);
      setDraft(p);
    }
    try {
      const rest = await AsyncStorage.getItem('rest_timer_duration');
      if (rest) setRestDuration(parseInt(rest, 10));
      const unit = await AsyncStorage.getItem('weight_unit');
      if (unit) setWeightUnit(unit);
      const rem = await AsyncStorage.getItem('reminder_enabled');
      setReminderEnabled(rem === 'true');
      const rh = await AsyncStorage.getItem('reminder_hour');
      const rm = await AsyncStorage.getItem('reminder_min');
      if (rh) setReminderHour(parseInt(rh, 10));
      if (rm) setReminderMin(parseInt(rm, 10));
    } catch {}
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [])
  );

  const handleSave = async () => {
    try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
    await saveProfile(draft);
    setProfile(draft);
    setEditing(false);

    // Update program if goal changed
    if (draft.goal !== profile.goal) {
      const programState = {
        programId: GOAL_TO_PROGRAM[draft.goal] || 'beginner',
        currentDayIndex: 0,
        currentWeek: 1,
        startedAt: new Date().toISOString(),
        lastWorkoutDate: null,
      };
      await AsyncStorage.setItem('current_program_state', JSON.stringify(programState));
    }
  };

  const handleReminderToggle = async () => {
    const newState = !reminderEnabled;
    setReminderEnabled(newState);
    await AsyncStorage.setItem('reminder_enabled', String(newState));

    if (newState) {
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleWorkoutReminder(reminderHour, reminderMin);
      } else {
        Alert.alert('Permission Required', 'Please enable notifications in your device settings.');
        setReminderEnabled(false);
        await AsyncStorage.setItem('reminder_enabled', 'false');
      }
    }
  };

  const handleTimeChange = async (hour, min) => {
    setReminderHour(hour);
    setReminderMin(min);
    await AsyncStorage.setItem('reminder_hour', String(hour));
    await AsyncStorage.setItem('reminder_min', String(min));
    if (reminderEnabled) {
      await scheduleWorkoutReminder(hour, min);
    }
  };

  const handleRestChange = async (dur) => {
    setRestDuration(dur);
    await AsyncStorage.setItem('rest_timer_duration', String(dur));
  };

  const handleWeightUnit = async (unit) => {
    setWeightUnit(unit);
    await AsyncStorage.setItem('weight_unit', unit);
  };

  const handleReset = () => {
    Alert.alert(
      'Reset All Data',
      'This will delete all your workouts, steps, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Everything',
          style: 'destructive',
          onPress: async () => {
            await clearAllData();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const update = (key, val) => setDraft(d => ({ ...d, [key]: val }));

  if (!profile) return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;

  const displayWeight = weightUnit === 'lbs'
    ? Math.round((draft.weightKg || 70) * 2.205)
    : draft.weightKg || 70;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }}
    >
      <View style={{ paddingHorizontal: SPACING.lg }}>
        <Text style={{ color: COLORS.text, fontSize: 24, ...FONTS.bold, marginBottom: SPACING.lg }}>
          Profile
        </Text>

        {/* Profile Card */}
        <View style={CARD}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
            <View style={{
              width: 56, height: 56, borderRadius: 28,
              backgroundColor: COLORS.primary + '20',
              alignItems: 'center', justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 24 }}>
                {GOALS.find(g => g.key === (editing ? draft.goal : profile.goal))?.emoji || '💪'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => editing ? handleSave() : setEditing(true)}>
              <Text style={{ color: COLORS.primary, fontSize: 14, ...FONTS.bold }}>
                {editing ? 'Save' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {editing ? (
            <View>
              <FieldLabel label="Name" />
              <TextInput
                value={draft.name}
                onChangeText={(t) => update('name', t)}
                style={inputStyle}
              />

              <FieldLabel label="Age" />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <TouchableOpacity onPress={() => update('age', Math.max(10, draft.age - 1))} style={stepperBtn}>
                  <Ionicons name="remove" size={18} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold, marginHorizontal: SPACING.lg }}>
                  {draft.age}
                </Text>
                <TouchableOpacity onPress={() => update('age', Math.min(80, draft.age + 1))} style={stepperBtn}>
                  <Ionicons name="add" size={18} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <FieldLabel label={`Weight (${weightUnit})`} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <TouchableOpacity onPress={() => update('weightKg', Math.max(30, draft.weightKg - 1))} style={stepperBtn}>
                  <Ionicons name="remove" size={18} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold, marginHorizontal: SPACING.lg }}>
                  {displayWeight}
                </Text>
                <TouchableOpacity onPress={() => update('weightKg', Math.min(150, draft.weightKg + 1))} style={stepperBtn}>
                  <Ionicons name="add" size={18} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <FieldLabel label="Height (cm)" />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <TouchableOpacity onPress={() => update('heightCm', Math.max(120, (draft.heightCm || 170) - 1))} style={stepperBtn}>
                  <Ionicons name="remove" size={18} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold, marginHorizontal: SPACING.lg }}>
                  {draft.heightCm || 170}
                </Text>
                <TouchableOpacity onPress={() => update('heightCm', Math.min(220, (draft.heightCm || 170) + 1))} style={stepperBtn}>
                  <Ionicons name="add" size={18} color={COLORS.text} />
                </TouchableOpacity>
              </View>

              <FieldLabel label="Goal" />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.md }}>
                {GOALS.map(g => (
                  <TouchableOpacity
                    key={g.key}
                    onPress={() => update('goal', g.key)}
                    style={{
                      backgroundColor: draft.goal === g.key ? COLORS.primary : COLORS.surface2,
                      paddingHorizontal: SPACING.sm,
                      paddingVertical: SPACING.xs,
                      borderRadius: RADIUS.pill,
                    }}
                  >
                    <Text style={{ color: COLORS.text, fontSize: 12, ...FONTS.medium }}>
                      {g.emoji} {g.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FieldLabel label="Level" />
              <View style={{ flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md }}>
                {LEVELS.map(l => (
                  <TouchableOpacity
                    key={l}
                    onPress={() => update('level', l)}
                    style={{
                      flex: 1,
                      backgroundColor: draft.level === l ? COLORS.primary : COLORS.surface2,
                      paddingVertical: SPACING.xs,
                      borderRadius: RADIUS.pill,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: COLORS.text, fontSize: 12, ...FONTS.medium, textTransform: 'capitalize' }}>
                      {l}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FieldLabel label="Days per Week" />
              <View style={{ flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md }}>
                {[3, 4, 5].map(d => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => update('daysPerWeek', d)}
                    style={{
                      flex: 1,
                      backgroundColor: draft.daysPerWeek === d ? COLORS.primary : COLORS.surface2,
                      paddingVertical: SPACING.xs,
                      borderRadius: RADIUS.pill,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: COLORS.text, fontSize: 14, ...FONTS.bold }}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <FieldLabel label={`Daily Step Goal: ${draft.dailyStepGoal?.toLocaleString()}`} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <TouchableOpacity
                  onPress={() => update('dailyStepGoal', Math.max(4000, (draft.dailyStepGoal || 10000) - 1000))}
                  style={stepperBtn}
                >
                  <Ionicons name="remove" size={18} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold, flex: 1, textAlign: 'center' }}>
                  {(draft.dailyStepGoal || 10000).toLocaleString()}
                </Text>
                <TouchableOpacity
                  onPress={() => update('dailyStepGoal', Math.min(15000, (draft.dailyStepGoal || 10000) + 1000))}
                  style={stepperBtn}
                >
                  <Ionicons name="add" size={18} color={COLORS.text} />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              <Text style={{ color: COLORS.text, fontSize: 22, ...FONTS.bold }}>{profile.name}</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, marginTop: SPACING.xs }}>
                {profile.age} years · {weightUnit === 'lbs' ? Math.round(profile.weightKg * 2.205) : profile.weightKg} {weightUnit} · {profile.heightCm || 170} cm
              </Text>
              <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, flexWrap: 'wrap' }}>
                <InfoPill text={GOALS.find(g => g.key === profile.goal)?.title || profile.goal} />
                <InfoPill text={profile.level} />
                <InfoPill text={`${profile.daysPerWeek} days/week`} />
                <InfoPill text={`${profile.dailyStepGoal?.toLocaleString()} steps/day`} />
              </View>
            </View>
          )}
        </View>

        {/* BMI Card */}
        <BMICard weightKg={profile.weightKg} heightCm={profile.heightCm} />

        {/* Achievements */}
        <AchievementBadges />

        {/* Settings */}
        <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginTop: SPACING.xl, marginBottom: SPACING.md }}>
          Settings
        </Text>

        {/* Workout Reminder */}
        <View style={CARD}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.medium }}>Workout Reminder</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.regular, marginTop: 2 }}>
                {reminderEnabled ? `Daily at ${reminderHour}:${String(reminderMin).padStart(2, '0')}` : 'Off'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleReminderToggle}
              style={{
                width: 52, height: 28, borderRadius: 14,
                backgroundColor: reminderEnabled ? COLORS.primary : COLORS.surface2,
                justifyContent: 'center',
                paddingHorizontal: 2,
              }}
            >
              <View style={{
                width: 24, height: 24, borderRadius: 12,
                backgroundColor: COLORS.text,
                alignSelf: reminderEnabled ? 'flex-end' : 'flex-start',
              }} />
            </TouchableOpacity>
          </View>

          {reminderEnabled && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.md, gap: SPACING.sm }}>
              <TouchableOpacity
                onPress={() => handleTimeChange(Math.max(0, reminderHour - 1), reminderMin)}
                style={stepperBtnSm}
              >
                <Ionicons name="remove" size={14} color={COLORS.text} />
              </TouchableOpacity>
              <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold }}>
                {reminderHour}:{String(reminderMin).padStart(2, '0')}
              </Text>
              <TouchableOpacity
                onPress={() => handleTimeChange(Math.min(23, reminderHour + 1), reminderMin)}
                style={stepperBtnSm}
              >
                <Ionicons name="add" size={14} color={COLORS.text} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Rest Timer Duration */}
        <View style={{ ...CARD, marginTop: SPACING.sm }}>
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.medium, marginBottom: SPACING.sm }}>
            Rest Timer
          </Text>
          <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
            {REST_OPTIONS.map(d => (
              <TouchableOpacity
                key={d}
                onPress={() => handleRestChange(d)}
                style={{
                  flex: 1,
                  backgroundColor: restDuration === d ? COLORS.primary : COLORS.surface2,
                  paddingVertical: SPACING.xs,
                  borderRadius: RADIUS.pill,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLORS.text, fontSize: 13, ...FONTS.medium }}>{d}s</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Weight Unit */}
        <View style={{ ...CARD, marginTop: SPACING.sm }}>
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.medium, marginBottom: SPACING.sm }}>
            Weight Unit
          </Text>
          <View style={{ flexDirection: 'row', gap: SPACING.xs }}>
            {['kg', 'lbs'].map(u => (
              <TouchableOpacity
                key={u}
                onPress={() => handleWeightUnit(u)}
                style={{
                  flex: 1,
                  backgroundColor: weightUnit === u ? COLORS.primary : COLORS.surface2,
                  paddingVertical: SPACING.xs,
                  borderRadius: RADIUS.pill,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: COLORS.text, fontSize: 13, ...FONTS.medium }}>{u}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Theme Selector */}
        <ThemeSelector />

        {/* Backup */}
        <TouchableOpacity
          onPress={async () => {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
            const success = await exportBackup();
            if (!success) Alert.alert('Backup Failed', 'Could not create backup.');
          }}
          style={{
            ...CARD,
            marginTop: SPACING.sm,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="cloud-upload-outline" size={20} color={COLORS.success} />
          <Text style={{ color: COLORS.success, fontSize: 16, ...FONTS.medium, marginLeft: SPACING.sm }}>
            Backup All Data (JSON)
          </Text>
        </TouchableOpacity>

        {/* Export Data */}
        <TouchableOpacity
          onPress={async () => {
            try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
            const success = await exportAllDataAsCSV();
            if (!success) Alert.alert('Export Failed', 'Could not export data. Try again.');
          }}
          style={{
            ...CARD,
            marginTop: SPACING.sm,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="download-outline" size={20} color={COLORS.primary} />
          <Text style={{ color: COLORS.primary, fontSize: 16, ...FONTS.medium, marginLeft: SPACING.sm }}>
            Export Data as CSV
          </Text>
        </TouchableOpacity>

        {/* Reset */}
        <TouchableOpacity
          onPress={handleReset}
          style={{
            ...CARD,
            marginTop: SPACING.sm,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.secondary} />
          <Text style={{ color: COLORS.secondary, fontSize: 16, ...FONTS.medium, marginLeft: SPACING.sm }}>
            Reset All Data
          </Text>
        </TouchableOpacity>

        {/* About */}
        <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginTop: SPACING.xl, marginBottom: SPACING.md }}>
          About
        </Text>

        <View style={CARD}>
          <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular }}>
            FitCore v1.0.0
          </Text>
          <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.regular, marginTop: SPACING.sm }}>
            No data ever leaves your phone. Everything is stored locally on your device.
          </Text>
          <Text style={{ color: COLORS.textFaint, fontSize: 13, ...FONTS.regular, marginTop: SPACING.sm }}>
            Built with ❤️ in India
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function FieldLabel({ label }) {
  return (
    <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium, marginBottom: SPACING.xs }}>
      {label}
    </Text>
  );
}

function InfoPill({ text }) {
  return (
    <View style={{
      backgroundColor: COLORS.surface2,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      borderRadius: RADIUS.pill,
    }}>
      <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.medium, textTransform: 'capitalize' }}>
        {text}
      </Text>
    </View>
  );
}

const inputStyle = {
  backgroundColor: COLORS.surface2,
  borderRadius: RADIUS.button,
  borderWidth: 1,
  borderColor: COLORS.border,
  color: COLORS.text,
  fontSize: 16,
  padding: SPACING.md,
  marginBottom: SPACING.md,
};

const stepperBtn = {
  width: 40, height: 40, borderRadius: 20,
  backgroundColor: COLORS.surface2,
  borderWidth: 1, borderColor: COLORS.border,
  alignItems: 'center', justifyContent: 'center',
};

const stepperBtnSm = {
  width: 32, height: 32, borderRadius: 16,
  backgroundColor: COLORS.surface2,
  borderWidth: 1, borderColor: COLORS.border,
  alignItems: 'center', justifyContent: 'center',
};
