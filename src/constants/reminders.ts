export const REMINDER_TIME_OPTIONS = [
  '08:00',
  '12:00',
  '18:00',
  '21:00',
] as const;

export type ReminderTime = (typeof REMINDER_TIME_OPTIONS)[number];
