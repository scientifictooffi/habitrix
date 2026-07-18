import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  RepeatFrequency,
  TriggerType,
  type TimestampTrigger,
} from '@notifee/react-native';

/**
 * Local daily habit reminder.
 *
 * One repeating notification is scheduled at the user-chosen time. We keep a
 * single stable id so re-scheduling (time change / toggle) replaces the prior
 * trigger instead of stacking duplicates.
 */

const CHANNEL_ID = 'habit-reminders';
const REMINDER_ID = 'daily-habit-reminder';

const REMINDER_TITLE = 'Время отметить привычки 🔥';
const REMINDER_BODY = 'Загляни в Habitrix и сохрани свою серию';

/**
 * Asks the OS for notification permission (iOS prompt / Android 13+ runtime
 * permission). Returns true if notifications are allowed. Safe to call
 * repeatedly — the OS only prompts once.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const settings = await notifee.requestPermission();
  return (
    settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus === AuthorizationStatus.PROVISIONAL
  );
}

async function ensureChannel(): Promise<string> {
  // No-op on iOS; required on Android for the notification to be shown.
  return notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Напоминания о привычках',
    importance: AndroidImportance.HIGH,
  });
}

/**
 * Next occurrence of `HH:MM` as an epoch timestamp. If the time has already
 * passed today, schedules for the same time tomorrow.
 */
export function nextReminderTimestamp(time: string, from: Date = new Date()): number {
  const [hh, mm] = time.split(':').map(Number);
  const next = new Date(from);
  next.setHours(hh ?? 0, mm ?? 0, 0, 0);
  if (next.getTime() <= from.getTime()) {
    next.setDate(next.getDate() + 1);
  }
  return next.getTime();
}

/** Cancels the scheduled daily reminder, if any. */
export async function cancelReminder(): Promise<void> {
  await notifee.cancelTriggerNotification(REMINDER_ID);
}

/**
 * (Re)schedules the daily reminder at `time` (HH:MM). Replaces any existing
 * one. No-op if the user denies notification permission.
 */
export async function scheduleDailyReminder(time: string): Promise<boolean> {
  const granted = await requestNotificationPermission();
  if (!granted) return false;

  const channelId = await ensureChannel();
  await cancelReminder();

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: nextReminderTimestamp(time),
    repeatFrequency: RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      id: REMINDER_ID,
      title: REMINDER_TITLE,
      body: REMINDER_BODY,
      android: {
        channelId,
        smallIcon: 'ic_launcher',
        pressAction: { id: 'default' },
      },
      ios: { sound: 'default' },
    },
    trigger,
  );

  return true;
}

/**
 * Single entry point: reflects the current reminder settings onto the OS.
 * Enabled → (re)schedule, disabled → cancel.
 */
export async function syncReminders(enabled: boolean, time: string): Promise<void> {
  if (enabled) {
    await scheduleDailyReminder(time);
  } else {
    await cancelReminder();
  }
}
