import { formatDateKey, formatDateDisplay } from './formatDateKey';
import { enUS } from 'date-fns/locale';
import { format } from 'date-fns';

describe('formatDateKey', () => {
  it('formats YYYY-MM-DD with zero padding and day of week', () => {
    const d = new Date(2024, 0, 5); // Fri Jan 5, 2024
    const expected = format(d, 'yyyy-MM-dd-EEE', { locale: enUS });
    expect(formatDateKey(d)).toBe(expected);
  });

  it('defaults to today when no date is provided', () => {
    const today = new Date();
    const expected = format(today, 'yyyy-MM-dd-EEE', { locale: enUS });
    expect(formatDateKey()).toBe(expected);
  });

  it('formats a user-facing display string', () => {
    const d = new Date(2024, 0, 5); // Fri Jan 5, 2024
    expect(formatDateDisplay(d, 'EEE, MMM dd, yyyy', enUS)).toBe('Fri, Jan 05, 2024');
  });
});
