import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal, TextInput, RefreshControl,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import { COLORS, FONTS, SPACING, RADIUS, CARD, BUTTON } from '../../constants/theme';
import {
  getStepsForRange, getWorkoutLog, calculateStreak,
  getExerciseRecords, getBodyWeightLog, addBodyWeight,
  getMonthSteps, getDateKey, getStepsForDate,
} from '../../utils/progress';
import { getProfile } from '../../hooks/useStorage';
import StreakCalendar from '../../components/StreakCalendar';
import WorkoutHistory from '../../components/WorkoutHistory';
import WeeklyReport from '../../components/WeeklyReport';
import MuscleHeatMap from '../../components/MuscleHeatMap';
import PhotoProgress from '../../components/PhotoProgress';
import ProgressOverload from '../../components/ProgressOverload';
import BodyMeasurements from '../../components/BodyMeasurements';
import FocusTimer from '../../components/FocusTimer';
import exercises from '../../data/exercises';

export default function ProgressScreen() {
  const [profile, setProfile] = useState(null);
  const [totalWorkouts, setTotalWorkouts] = useState(0);
  const [streakData, setStreakData] = useState({ current: 0, best: 0 });
  const [monthSteps, setMonthSteps] = useState(0);
  const [stepData, setStepData] = useState([]);
  const [stepRange, setStepRange] = useState('week');
  const [workoutDates, setWorkoutDates] = useState([]);
  const [stepGoalDates, setStepGoalDates] = useState([]);
  const [weightLog, setWeightLog] = useState([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [weightInput, setWeightInput] = useState('');
  const [records, setRecords] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    const p = await getProfile();
    setProfile(p);
    const goal = p?.dailyStepGoal || 10000;

    const log = await getWorkoutLog();
    setTotalWorkouts(log.length);
    setStreakData(calculateStreak(log));
    setWorkoutDates([...new Set(log.map(w => w.date))]);

    const ms = await getMonthSteps();
    setMonthSteps(ms);

    await loadStepData(stepRange);

    // Find step goal dates this month
    const today = new Date();
    const sgDates = [];
    for (let i = 0; i < today.getDate(); i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = getDateKey(d);
      const steps = await getStepsForDate(key);
      if (steps >= goal) sgDates.push(key);
    }
    setStepGoalDates(sgDates);

    const wl = await getBodyWeightLog();
    setWeightLog(wl);

    const rec = await getExerciseRecords();
    setRecords(rec);
  };

  const loadStepData = async (range) => {
    const days = range === 'week' ? 7 : range === 'month' ? 30 : 90;
    const data = await getStepsForRange(days);
    setStepData(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleRangeChange = async (range) => {
    setStepRange(range);
    await loadStepData(range);
  };

  const handleLogWeight = async () => {
    const w = parseFloat(weightInput);
    if (isNaN(w) || w < 20 || w > 300) return;
    await addBodyWeight(w);
    setWeightLog(await getBodyWeightLog());
    setShowWeightModal(false);
    setWeightInput('');
  };

  const avgSteps = stepData.length
    ? Math.round(stepData.reduce((s, d) => s + d.steps, 0) / stepData.length)
    : 0;

  const totalStepsInRange = stepData.reduce((s, d) => s + d.steps, 0);

  const barData = stepData.map((d, i) => ({
    value: d.steps,
    label: stepRange === 'week' ? d.dayLabel : d.dayNum?.toString(),
    frontColor: i === stepData.length - 1 ? COLORS.primaryLight : COLORS.primary,
  }));

  const weightChartData = weightLog.map(w => ({
    value: w.weightKg,
    label: w.date.slice(5),
    dataPointText: w.weightKg.toString(),
  }));

  const weightTrend = weightLog.length >= 2
    ? weightLog[weightLog.length - 1].weightKg - weightLog[weightLog.length - 2].weightKg
    : 0;

  const recordEntries = Object.entries(records)
    .filter(([id]) => exercises[id])
    .map(([id, rec]) => ({
      id,
      name: exercises[id].name,
      bestReps: rec.bestReps,
      bestDate: rec.bestDate,
    }))
    .sort((a, b) => b.bestReps - a.bestReps);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      contentContainerStyle={{ paddingBottom: 120, paddingTop: 60 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      <View style={{ paddingHorizontal: SPACING.lg }}>
        <Text style={{ color: COLORS.text, fontSize: 24, ...FONTS.bold, marginBottom: SPACING.lg }}>
          Progress
        </Text>

        {/* Top stats */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
          <MiniStat icon="barbell-outline" label="Workouts" value={totalWorkouts} />
          <MiniStat icon="flame-outline" label="Streak" value={`${streakData.current} days`} color={COLORS.warning} />
          <MiniStat icon="trophy-outline" label="Best Streak" value={`${streakData.best} days`} color={COLORS.gold} />
          <MiniStat icon="footsteps-outline" label="Month Steps" value={monthSteps.toLocaleString()} />
        </View>

        {/* Step History */}
        <View style={{ ...CARD, marginTop: SPACING.lg }}>
          <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginBottom: SPACING.md }}>
            Step History
          </Text>

          <View style={{ flexDirection: 'row', gap: SPACING.xs, marginBottom: SPACING.md }}>
            {['week', 'month', '3months'].map(r => (
              <TouchableOpacity
                key={r}
                onPress={() => handleRangeChange(r)}
                style={{
                  backgroundColor: stepRange === r ? COLORS.primary : COLORS.surface2,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.xs,
                  borderRadius: RADIUS.pill,
                }}
              >
                <Text style={{ color: COLORS.text, fontSize: 12, ...FONTS.medium }}>
                  {r === 'week' ? 'Week' : r === 'month' ? 'Month' : '3 Months'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {barData.length > 0 && (
            <BarChart
              data={barData}
              width={260}
              height={140}
              barWidth={stepRange === 'week' ? 28 : 6}
              spacing={stepRange === 'week' ? 12 : 2}
              maxValue={Math.max(...stepData.map(d => d.steps), 1000) * 1.2}
              noOfSections={4}
              barBorderRadius={4}
              yAxisThickness={0}
              xAxisThickness={1}
              xAxisColor={COLORS.border}
              yAxisTextStyle={{ color: COLORS.textFaint, fontSize: 9 }}
              xAxisLabelTextStyle={{ color: COLORS.textMuted, fontSize: stepRange === 'week' ? 10 : 7 }}
              backgroundColor={COLORS.surface}
              rulesColor={COLORS.border}
              showReferenceLine1
              referenceLine1Position={avgSteps}
              referenceLine1Config={{ color: COLORS.warning, dashWidth: 4, dashGap: 4 }}
              isAnimated
            />
          )}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm }}>
            <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.regular }}>
              Total: {totalStepsInRange.toLocaleString()}
            </Text>
            <Text style={{ color: COLORS.textMuted, fontSize: 12, ...FONTS.regular }}>
              Avg: {avgSteps.toLocaleString()}/day
            </Text>
          </View>
        </View>

        {/* Streak Calendar */}
        <StreakCalendar workoutDates={workoutDates} stepGoalDates={stepGoalDates} />

        {/* Body Weight */}
        <View style={{ ...CARD, marginTop: SPACING.md }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
            <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold }}>
              Body Weight
            </Text>
            {weightTrend !== 0 && (
              <Text style={{
                color: weightTrend < 0 ? COLORS.success : COLORS.secondary,
                fontSize: 14, ...FONTS.bold,
              }}>
                {weightTrend > 0 ? '↑' : '↓'} {Math.abs(weightTrend).toFixed(1)} kg
              </Text>
            )}
          </View>

          {weightChartData.length > 1 ? (
            <LineChart
              data={weightChartData}
              width={260}
              height={120}
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
              backgroundColor={COLORS.surface}
              rulesColor={COLORS.border}
              isAnimated
            />
          ) : (
            <Text style={{ color: COLORS.textMuted, fontSize: 14, textAlign: 'center', padding: SPACING.md }}>
              {weightLog.length === 0 ? 'No weight data yet' : 'Log more entries to see chart'}
            </Text>
          )}

          <TouchableOpacity
            onPress={() => {
              setWeightInput(profile?.weightKg?.toString() || '');
              setShowWeightModal(true);
            }}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: RADIUS.button,
              paddingVertical: SPACING.sm,
              alignItems: 'center',
              marginTop: SPACING.md,
            }}
          >
            <Text style={{ color: COLORS.text, fontSize: 14, ...FONTS.bold }}>
              Log Today's Weight
            </Text>
          </TouchableOpacity>
        </View>

        {/* Exercise Records */}
        {recordEntries.length > 0 && (
          <View style={{ ...CARD, marginTop: SPACING.md }}>
            <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginBottom: SPACING.md }}>
              Exercise Records
            </Text>
            {recordEntries.slice(0, 10).map(rec => (
              <View key={rec.id} style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: SPACING.sm,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              }}>
                <Text style={{ color: COLORS.text, fontSize: 14, ...FONTS.medium, flex: 1 }}>
                  {rec.name}
                </Text>
                <Text style={{ color: COLORS.success, fontSize: 14, ...FONTS.bold }}>
                  Best: {rec.bestReps} reps
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Progressive Overload Dashboard */}
        <ProgressOverload />

        {/* Weekly Report */}
        <WeeklyReport />

        {/* Workout History */}
        <WorkoutHistory />

        {/* Muscle Heat Map */}
        <MuscleHeatMap />

        {/* Body Measurements */}
        <BodyMeasurements />

        {/* Progress Photos */}
        <PhotoProgress />

        {/* Focus Timer */}
        <FocusTimer />
      </View>

      {/* Weight Modal */}
      <Modal visible={showWeightModal} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: SPACING.lg,
        }}>
          <View style={{
            ...CARD,
            width: '100%',
            maxWidth: 340,
            backgroundColor: COLORS.surface,
          }}>
            <Text style={{ color: COLORS.text, fontSize: 20, ...FONTS.bold, marginBottom: SPACING.md }}>
              Log Weight
            </Text>
            <TextInput
              value={weightInput}
              onChangeText={setWeightInput}
              keyboardType="decimal-pad"
              placeholder="Enter weight in kg"
              placeholderTextColor={COLORS.textFaint}
              style={{
                backgroundColor: COLORS.surface2,
                borderRadius: RADIUS.button,
                borderWidth: 1,
                borderColor: COLORS.border,
                color: COLORS.text,
                fontSize: 24,
                padding: SPACING.md,
                textAlign: 'center',
                ...FONTS.bold,
              }}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.lg }}>
              <TouchableOpacity
                onPress={() => setShowWeightModal(false)}
                style={{
                  flex: 1,
                  backgroundColor: COLORS.surface2,
                  height: 48,
                  borderRadius: RADIUS.button,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.medium }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogWeight}
                style={{ flex: 1, ...BUTTON.primary, height: 48 }}
              >
                <Text style={BUTTON.primaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function MiniStat({ icon, label, value, color = COLORS.primary }) {
  return (
    <View style={{
      ...CARD,
      flex: 1,
      minWidth: '45%',
      alignItems: 'center',
      paddingVertical: SPACING.md,
    }}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={{ color: COLORS.text, fontSize: 18, ...FONTS.bold, marginTop: SPACING.xs }}>
        {value}
      </Text>
      <Text style={{ color: COLORS.textMuted, fontSize: 11, ...FONTS.regular }}>
        {label}
      </Text>
    </View>
  );
}
