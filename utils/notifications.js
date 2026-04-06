let Notifications = null;

try {
  Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
} catch (e) {
  console.warn('expo-notifications not available:', e.message);
}

export async function requestNotificationPermissions() {
  if (!Notifications) return false;
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === 'granted';
  } catch {
    return false;
  }
}

export async function scheduleWorkoutReminder(hour, minute, workoutName) {
  if (!Notifications) return;
  try {
    await cancelWorkoutReminder();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to train 💪',
        body: `Your ${workoutName || 'workout'} is waiting. 25 minutes is all it takes.`,
      },
      trigger: {
        type: 'daily',
        hour,
        minute,
      },
    });
  } catch (e) {
    console.warn('scheduleWorkoutReminder error:', e.message);
  }
}

export async function cancelWorkoutReminder() {
  if (!Notifications) return;
  try {
    const scheduled = await Notifications.getAllScheduledNotificationsAsync();
    for (const notif of scheduled) {
      if (notif.content.title === 'Time to train 💪') {
        await Notifications.cancelScheduledNotificationAsync(notif.identifier);
      }
    }
  } catch (e) {
    console.warn('cancelWorkoutReminder error:', e.message);
  }
}

export async function scheduleStepGoalCheck(currentSteps, goalSteps) {
  if (!Notifications) return;
  try {
    const ratio = currentSteps / goalSteps;
    let body;
    const remaining = goalSteps - currentSteps;

    if (ratio < 0.5) {
      body = `You're at ${currentSteps.toLocaleString()} steps. A 10-min walk = 1,200 steps!`;
    } else if (ratio < 0.8) {
      body = `Almost there! ${remaining.toLocaleString()} more steps to hit your goal 🚶`;
    } else {
      body = `So close! Just ${remaining.toLocaleString()} steps away from your daily goal! 🔥`;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Step Goal Check',
        body,
      },
      trigger: {
        type: 'daily',
        hour: 18,
        minute: 0,
      },
    });
  } catch (e) {
    console.warn('scheduleStepGoalCheck error:', e.message);
  }
}

export async function scheduleStreakProtection(streakDays) {
  if (!Notifications) return;
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Don't break your ${streakDays}-day streak! 🔥`,
        body: 'Even a 10-minute workout counts. Your streak is worth protecting.',
      },
      trigger: {
        type: 'daily',
        hour: 20,
        minute: 0,
      },
    });
  } catch (e) {
    console.warn('scheduleStreakProtection error:', e.message);
  }
}

export async function scheduleWeeklySummary(workoutCount, totalSteps) {
  if (!Notifications) return;
  try {
    const encouragement = totalSteps > 50000
      ? 'Amazing week! Keep this momentum going!'
      : 'Every step counts. Let\'s make next week even better!';

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Your week in review 📊',
        body: `${workoutCount} workouts, ${totalSteps.toLocaleString()} total steps. ${encouragement}`,
      },
      trigger: {
        type: 'weekly',
        weekday: 1,
        hour: 9,
        minute: 0,
      },
    });
  } catch (e) {
    console.warn('scheduleWeeklySummary error:', e.message);
  }
}
