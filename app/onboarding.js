import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView,
  Dimensions, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { GOAL_TO_PROGRAM } from '../data/programs';

const { width, height } = Dimensions.get('window');

const GOALS = [
  { key: 'fat_loss', emoji: '🔥', title: 'Fat Loss', desc: 'Burn fat with cardio + strength', color: '#FF6B6B' },
  { key: 'muscle_gain', emoji: '💪', title: 'Muscle Gain', desc: 'Build strength progressively', color: '#6C63FF' },
  { key: 'flexibility', emoji: '🧘', title: 'Flexibility', desc: 'Improve posture and mobility', color: '#43E97B' },
  { key: 'stamina', emoji: '🏃', title: 'Stamina', desc: 'Build endurance and energy', color: '#FFB347' },
  { key: 'beginner', emoji: '🌱', title: 'Beginner', desc: 'Start from zero, no experience needed', color: '#4ECDC4' },
];

const LEVELS = [
  { key: 'beginner', icon: 'leaf-outline', title: 'Beginner', desc: 'Just starting out' },
  { key: 'intermediate', icon: 'trending-up-outline', title: 'Intermediate', desc: 'Some experience' },
  { key: 'advanced', icon: 'rocket-outline', title: 'Advanced', desc: 'Seasoned athlete' },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    age: 25,
    weightKg: 70,
    heightCm: 170,
    goal: '',
    level: '',
    daysPerWeek: 3,
    dailyStepGoal: 10000,
  });

  const next = () => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
    setStep(s => s + 1);
  };

  const back = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const finish = async () => {
    if (saving) return;
    setSaving(true);
    try {
      try { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
      const fullProfile = {
        ...profile,
        onboardingComplete: true,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem('user_profile', JSON.stringify(fullProfile));

      const programState = {
        programId: GOAL_TO_PROGRAM[profile.goal] || 'beginner',
        currentDayIndex: 0,
        currentWeek: 1,
        startedAt: new Date().toISOString(),
        lastWorkoutDate: null,
      };
      await AsyncStorage.setItem('current_program_state', JSON.stringify(programState));

      router.replace('/');
    } catch (e) {
      console.warn('Onboarding finish error:', e);
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0: return <WelcomeStep onNext={next} />;
      case 1: return (
        <GoalStep
          selected={profile.goal}
          onSelect={(goal) => { setProfile(p => ({ ...p, goal })); next(); }}
        />
      );
      case 2: return (
        <LevelStep
          selected={profile.level}
          onSelect={(level) => { setProfile(p => ({ ...p, level })); next(); }}
        />
      );
      case 3: return (
        <DetailsStep
          profile={profile}
          setProfile={setProfile}
          onFinish={finish}
          saving={saving}
        />
      );
      default: return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Top bar with back button and progress */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 56,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.md,
      }}>
        {step > 0 ? (
          <TouchableOpacity onPress={back} style={{ padding: 4, marginRight: SPACING.md }}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} />
        )}

        {/* Progress bar */}
        <View style={{ flex: 1, height: 4, backgroundColor: COLORS.surface2, borderRadius: 2, overflow: 'hidden' }}>
          <View style={{
            height: 4,
            backgroundColor: COLORS.primary,
            borderRadius: 2,
            width: `${((step + 1) / 4) * 100}%`,
          }} />
        </View>

        <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.medium, marginLeft: SPACING.md }}>
          {step + 1}/4
        </Text>
      </View>

      {renderStep()}
    </View>
  );
}

function WelcomeStep({ onNext }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: SPACING.xl }}>
      {/* Glow effect behind icon */}
      <View style={{
        width: 120,
        height: 120,
        borderRadius: 32,
        backgroundColor: COLORS.primary + '15',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.xl,
      }}>
        <View style={{
          width: 88,
          height: 88,
          borderRadius: 24,
          backgroundColor: COLORS.primary + '25',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="barbell" size={44} color={COLORS.primary} />
        </View>
      </View>

      <Text style={{
        color: COLORS.text,
        fontSize: 40,
        ...FONTS.bold,
        letterSpacing: -1,
        marginBottom: SPACING.sm,
      }}>
        FitCore
      </Text>

      <Text style={{
        color: COLORS.textMuted,
        fontSize: 17,
        ...FONTS.regular,
        textAlign: 'center',
        lineHeight: 26,
        marginBottom: SPACING.xxl,
        maxWidth: 300,
      }}>
        Your personal fitness companion.{'\n'}No account. No internet. Just results.
      </Text>

      {/* Feature pills */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: SPACING.sm, marginBottom: SPACING.xxl }}>
        <FeaturePill icon="footsteps-outline" text="Step Tracking" />
        <FeaturePill icon="barbell-outline" text="Guided Workouts" />
        <FeaturePill icon="stats-chart-outline" text="Progress Charts" />
        <FeaturePill icon="lock-closed-outline" text="100% Offline" />
      </View>

      <TouchableOpacity
        onPress={onNext}
        activeOpacity={0.8}
        style={{
          backgroundColor: COLORS.primary,
          height: 56,
          borderRadius: RADIUS.button,
          alignItems: 'center',
          justifyContent: 'center',
          width: width - 64,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 17, ...FONTS.bold }}>Get Started</Text>
      </TouchableOpacity>

      <Text style={{
        color: COLORS.textFaint,
        fontSize: 12,
        ...FONTS.regular,
        marginTop: SPACING.md,
        textAlign: 'center',
      }}>
        No data ever leaves your phone
      </Text>
    </View>
  );
}

function FeaturePill({ icon, text }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: RADIUS.pill,
      borderWidth: 1,
      borderColor: COLORS.border,
    }}>
      <Ionicons name={icon} size={14} color={COLORS.primaryLight} />
      <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.medium, marginLeft: 6 }}>{text}</Text>
    </View>
  );
}

function GoalStep({ selected, onSelect }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: SPACING.lg }}>
      <Text style={{ color: COLORS.text, fontSize: 28, ...FONTS.bold, marginBottom: 6 }}>
        What's your goal?
      </Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 15, ...FONTS.regular, marginBottom: SPACING.lg }}>
        We'll build your program around this
      </Text>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {GOALS.map(goal => (
          <TouchableOpacity
            key={goal.key}
            onPress={() => onSelect(goal.key)}
            activeOpacity={0.7}
            style={{
              backgroundColor: selected === goal.key ? goal.color + '12' : COLORS.surface,
              borderRadius: 20,
              borderWidth: selected === goal.key ? 1.5 : 1,
              borderColor: selected === goal.key ? goal.color + '60' : COLORS.border,
              padding: 20,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              backgroundColor: goal.color + '18',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: SPACING.md,
            }}>
              <Text style={{ fontSize: 26 }}>{goal.emoji}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: COLORS.text, fontSize: 17, ...FONTS.bold }}>{goal.title}</Text>
              <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.regular, marginTop: 3 }}>
                {goal.desc}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textFaint} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

function LevelStep({ selected, onSelect }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: SPACING.lg }}>
      <Text style={{ color: COLORS.text, fontSize: 28, ...FONTS.bold, marginBottom: 6 }}>
        Your fitness level
      </Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 15, ...FONTS.regular, marginBottom: SPACING.xl }}>
        Be honest — we'll match the difficulty
      </Text>

      {LEVELS.map(level => (
        <TouchableOpacity
          key={level.key}
          onPress={() => onSelect(level.key)}
          activeOpacity={0.7}
          style={{
            backgroundColor: selected === level.key ? COLORS.primary + '12' : COLORS.surface,
            borderRadius: 20,
            borderWidth: selected === level.key ? 1.5 : 1,
            borderColor: selected === level.key ? COLORS.primary + '60' : COLORS.border,
            padding: 24,
            marginBottom: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: COLORS.primary + '15',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.md,
          }}>
            <Ionicons name={level.icon} size={26} color={COLORS.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: COLORS.text, fontSize: 17, ...FONTS.bold }}>{level.title}</Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 13, ...FONTS.regular, marginTop: 3 }}>
              {level.desc}
            </Text>
          </View>
          {selected === level.key && (
            <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function DetailsStep({ profile, setProfile, onFinish, saving }) {
  const update = (key, val) => setProfile(p => ({ ...p, [key]: val }));
  const canFinish = profile.name.trim().length > 0;
  const scrollRef = useRef(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={{ color: COLORS.text, fontSize: 28, ...FONTS.bold, marginBottom: 6 }}>
          About you
        </Text>
        <Text style={{ color: COLORS.textMuted, fontSize: 15, ...FONTS.regular, marginBottom: SPACING.lg }}>
          Everything stays on your device
        </Text>

        {/* Name */}
        <Label text="What should we call you?" />
        <TextInput
          value={profile.name}
          onChangeText={(t) => update('name', t)}
          placeholder="Enter your name"
          placeholderTextColor={COLORS.textFaint}
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            color: COLORS.text,
            fontSize: 17,
            paddingHorizontal: 18,
            paddingVertical: 16,
            marginBottom: SPACING.lg,
            ...FONTS.medium,
          }}
          onFocus={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
        />

        {/* Age */}
        <Label text="Age" />
        <StepperRow
          value={profile.age}
          unit="years"
          onMinus={() => update('age', Math.max(10, profile.age - 1))}
          onPlus={() => update('age', Math.min(80, profile.age + 1))}
        />

        {/* Weight */}
        <Label text="Weight" />
        <StepperRow
          value={profile.weightKg}
          unit="kg"
          onMinus={() => update('weightKg', Math.max(30, profile.weightKg - 1))}
          onPlus={() => update('weightKg', Math.min(150, profile.weightKg + 1))}
        />

        {/* Height */}
        <Label text="Height" />
        <StepperRow
          value={profile.heightCm}
          unit="cm"
          onMinus={() => update('heightCm', Math.max(120, profile.heightCm - 1))}
          onPlus={() => update('heightCm', Math.min(220, profile.heightCm + 1))}
        />

        {/* Days per week */}
        <Label text="Workout days per week" />
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: SPACING.lg }}>
          {[3, 4, 5].map(d => (
            <TouchableOpacity
              key={d}
              onPress={() => update('daysPerWeek', d)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                backgroundColor: profile.daysPerWeek === d ? COLORS.primary : COLORS.surface,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: profile.daysPerWeek === d ? COLORS.primary : COLORS.border,
              }}
            >
              <Text style={{
                color: COLORS.text,
                fontSize: 18,
                ...FONTS.bold,
              }}>
                {d}
              </Text>
              <Text style={{ color: profile.daysPerWeek === d ? 'rgba(255,255,255,0.7)' : COLORS.textFaint, fontSize: 11, ...FONTS.regular, marginTop: 2 }}>
                days
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Step Goal */}
        <Label text="Daily step goal" />
        <StepperRow
          value={profile.dailyStepGoal}
          unit="steps"
          step={1000}
          onMinus={() => update('dailyStepGoal', Math.max(4000, profile.dailyStepGoal - 1000))}
          onPlus={() => update('dailyStepGoal', Math.min(15000, profile.dailyStepGoal + 1000))}
        />

        {/* Finish button */}
        <TouchableOpacity
          onPress={onFinish}
          disabled={!canFinish || saving}
          activeOpacity={0.8}
          style={{
            backgroundColor: canFinish ? COLORS.primary : COLORS.surface2,
            height: 58,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: SPACING.md,
            opacity: saving ? 0.6 : 1,
          }}
        >
          <Text style={{
            color: canFinish ? '#fff' : COLORS.textFaint,
            fontSize: 17,
            ...FONTS.bold,
          }}>
            {saving ? 'Setting up...' : 'Start My Journey'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Label({ text }) {
  return (
    <Text style={{
      color: COLORS.textMuted,
      fontSize: 14,
      ...FONTS.medium,
      marginBottom: 10,
    }}>
      {text}
    </Text>
  );
}

function StepperRow({ value, unit, onMinus, onPlus }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.surface,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: COLORS.border,
      padding: 6,
      marginBottom: SPACING.lg,
    }}>
      <TouchableOpacity
        onPress={onMinus}
        activeOpacity={0.6}
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: COLORS.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="remove" size={22} color={COLORS.text} />
      </TouchableOpacity>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ color: COLORS.text, fontSize: 26, ...FONTS.bold }}>
          {typeof value === 'number' && value >= 1000 ? value.toLocaleString() : value}
        </Text>
        <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular, marginTop: -2 }}>
          {unit}
        </Text>
      </View>
      <TouchableOpacity
        onPress={onPlus}
        activeOpacity={0.6}
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: COLORS.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="add" size={22} color={COLORS.text} />
      </TouchableOpacity>
    </View>
  );
}
