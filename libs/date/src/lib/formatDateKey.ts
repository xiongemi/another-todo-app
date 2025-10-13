import { format } from 'date-fns';
import type { Locale } from 'date-fns';

export function formatDateKey(d = new Date()): string {
  return format(d, 'yyyy-MM-dd-EEE');
}

export function formatDateDisplay(
  d = new Date(),
  pattern = 'EEE, MMM dd, yyyy',
  locale?: Locale
): string {
  return format(d, pattern, { locale });
}
