import { nextReminderTimestamp } from '../src/utils/notifications';

describe('nextReminderTimestamp', () => {
  it('schedules for later today when the time is still ahead', () => {
    const from = new Date(2026, 5, 16, 7, 0, 0); // 07:00
    const ts = nextReminderTimestamp('08:00', from);
    expect(new Date(ts)).toEqual(new Date(2026, 5, 16, 8, 0, 0, 0));
  });

  it('rolls over to tomorrow when the time has already passed', () => {
    const from = new Date(2026, 5, 16, 9, 0, 0); // 09:00
    const ts = nextReminderTimestamp('08:00', from);
    expect(new Date(ts)).toEqual(new Date(2026, 5, 17, 8, 0, 0, 0));
  });

  it('rolls over when the time is exactly now (strictly future)', () => {
    const from = new Date(2026, 5, 16, 8, 0, 0);
    const ts = nextReminderTimestamp('08:00', from);
    expect(new Date(ts)).toEqual(new Date(2026, 5, 17, 8, 0, 0, 0));
  });

  it('zeroes seconds and milliseconds', () => {
    const from = new Date(2026, 5, 16, 7, 30, 45, 500);
    const ts = nextReminderTimestamp('21:00', from);
    const d = new Date(ts);
    expect(d.getSeconds()).toBe(0);
    expect(d.getMilliseconds()).toBe(0);
    expect(d.getHours()).toBe(21);
  });
});
