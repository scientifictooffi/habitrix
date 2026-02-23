/**
 * Returns date string YYYY-MM-DD for the given date (local time).
 */
export function getDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Returns [Monday, Tuesday, ..., Sunday] of the current week as date keys.
 */
export function getWeekDateKeys(): string[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    keys.push(getDateKey(d));
  }
  return keys;
}

/**
 * True if on that day all given habitIds are in completions for that date.
 */
export function isDayComplete(
  dateKey: string,
  habitIds: string[],
  completions: Record<string, string[]>,
): boolean {
  if (habitIds.length === 0) return false;
  const done = completions[dateKey] ?? [];
  return habitIds.every(id => done.includes(id));
}

/**
 * Returns calendar cells for a month: 6 rows × 7 columns.
 * Each cell is either null (empty pad) or a date key YYYY-MM-DD.
 * First day of month is placed according to weekday (Mon=0).
 */
export function getMonthCalendarCells(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const firstWeekday = first.getDay();
  const mondayOffset = firstWeekday === 0 ? 6 : firstWeekday - 1;
  const cells: (string | null)[] = [];
  for (let i = 0; i < mondayOffset; i++) cells.push(null);
  for (let d = 1; d <= last.getDate(); d++) {
    cells.push(getDateKey(new Date(year, month, d)));
  }
  const total = 42;
  while (cells.length < total) cells.push(null);
  return cells.slice(0, total);
}

/**
 * Number of consecutive complete days ending today (today counts if complete).
 */
export function getCurrentStreak(
  completions: Record<string, string[]>,
  habitIds: string[],
  todayKey: string,
): number {
  if (habitIds.length === 0) return 0;
  let count = 0;
  const d = new Date(todayKey);
  while (true) {
    const key = getDateKey(d);
    if (!isDayComplete(key, habitIds, completions)) break;
    count++;
    d.setDate(d.getDate() - 1);
  }
  return count;
}
