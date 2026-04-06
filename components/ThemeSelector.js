import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS } from '../constants/theme';
import { calculateStreak, getWorkoutLog } from '../utils/progress';
import THEMES from '../data/themes';

export default function ThemeSelector() {
  const [visible, setVisible] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const theme = await AsyncStorage.getItem('unlocked_theme');
      if (theme) setCurrentTheme(theme);

      const log = await getWorkoutLog();
      const { best } = calculateStreak(log);
      setBestStreak(best);
    } catch {}
  };

  const selectTheme = async (themeId) => {
    try { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); } catch {}
    setCurrentTheme(themeId);
    await AsyncStorage.setItem('unlocked_theme', themeId);
    setVisible(false);
  };

  const theme = THEMES[currentTheme] || THEMES.default;

  return (
    <>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.7}
        style={{
          backgroundColor: COLORS.surface,
          borderRadius: RADIUS.card,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: SPACING.md,
          marginTop: SPACING.sm,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <View style={{
          width: 24, height: 24, borderRadius: 12,
          backgroundColor: theme.primary,
          marginRight: 12,
        }} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: COLORS.text, fontSize: 16, ...FONTS.medium }}>App Theme</Text>
          <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular }}>{theme.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={COLORS.textFaint} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
          <View style={{
            backgroundColor: COLORS.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: '80%',
            paddingBottom: 50,
          }}>
            <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: COLORS.textFaint }} />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md }}>
              <Text style={{ color: COLORS.text, fontSize: 22, ...FONTS.bold }}>Streak Rewards</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close-circle" size={28} color={COLORS.textFaint} />
              </TouchableOpacity>
            </View>
            <Text style={{ color: COLORS.textMuted, fontSize: 14, ...FONTS.regular, paddingHorizontal: SPACING.lg, marginBottom: SPACING.md }}>
              Your best streak: {bestStreak} days. Unlock themes by building streaks!
            </Text>
            <ScrollView contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 20 }}>
              {Object.values(THEMES).map(t => {
                const unlocked = !t.unlockRequirement || bestStreak >= t.unlockRequirement;
                const isActive = currentTheme === t.id;
                return (
                  <TouchableOpacity
                    key={t.id}
                    onPress={() => unlocked && selectTheme(t.id)}
                    activeOpacity={unlocked ? 0.7 : 1}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 16,
                      backgroundColor: isActive ? t.primary + '15' : COLORS.surface,
                      borderRadius: 16,
                      borderWidth: isActive ? 1.5 : 1,
                      borderColor: isActive ? t.primary + '50' : COLORS.border,
                      marginBottom: 8,
                      opacity: unlocked ? 1 : 0.4,
                    }}
                  >
                    <View style={{
                      width: 40, height: 40, borderRadius: 20,
                      backgroundColor: t.primary,
                      marginRight: 14,
                      alignItems: 'center', justifyContent: 'center',
                    }}>
                      {!unlocked && <Ionicons name="lock-closed" size={16} color="#fff" />}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: unlocked ? COLORS.text : COLORS.textFaint, fontSize: 16, ...FONTS.bold }}>
                        {t.name}
                      </Text>
                      <Text style={{ color: COLORS.textFaint, fontSize: 12, ...FONTS.regular }}>
                        {t.unlockRequirement ? `Unlock: ${t.unlockLabel}` : 'Always available'}
                      </Text>
                    </View>
                    {isActive && <Ionicons name="checkmark-circle" size={22} color={t.primary} />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
