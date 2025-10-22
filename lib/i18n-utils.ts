import { format } from 'date-fns';
import { format as formatJalali } from 'date-fns-jalali';
import { enUS } from 'date-fns/locale';
import { faIR } from 'date-fns-jalali/locale';

/**
 * Format date based on locale
 */
export function formatDate(date: Date | string, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (locale === 'fa') {
    return formatJalali(d, 'yyyy/MM/dd', { locale: faIR });
  } else {
    return format(d, 'MMM dd, yyyy', { locale: enUS });
  }
}

/**
 * Format relative time (5 minutes ago)
 */
export function formatRelativeTime(date: Date | string, locale: string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const translations = {
    fa: {
      just_now: 'همین الان',
      minutes_ago: (n: number) => `${n} دقیقه پیش`,
      hours_ago: (n: number) => `${n} ساعت پیش`,
      days_ago: (n: number) => `${n} روز پیش`,
    },
    en: {
      just_now: 'Just now',
      minutes_ago: (n: number) => `${n} minute${n > 1 ? 's' : ''} ago`,
      hours_ago: (n: number) => `${n} hour${n > 1 ? 's' : ''} ago`,
      days_ago: (n: number) => `${n} day${n > 1 ? 's' : ''} ago`,
    }
  };

  const t = translations[locale as 'fa' | 'en'];

  if (days > 7) {
    return formatDate(d, locale);
  } else if (days > 0) {
    return t.days_ago(days);
  } else if (hours > 0) {
    return t.hours_ago(hours);
  } else if (minutes > 0) {
    return t.minutes_ago(minutes);
  } else {
    return t.just_now;
  }
}

/**
 * Format numbers (Persian/English)
 */
export function formatNumber(num: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'fa' ? 'fa-IR' : 'en-US').format(num);
}

/**
 * Get text direction
 */
export function getDirection(locale: string): 'rtl' | 'ltr' {
  return locale === 'fa' ? 'rtl' : 'ltr';
}
