import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 7) {
    return formatDate(d);
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

export function calculateReadingProgress(currentPage: number, totalPages: number): number {
  if (totalPages === 0) return 0;
  return Math.round((currentPage / totalPages) * 100);
}

export function calculateCalories(
  type: string,
  duration: number,
  weight: number = 70
): number {
  const metValues: { [key: string]: number } = {
    cardio: 8,
    running: 10,
    cycling: 7,
    swimming: 9,
    yoga: 3,
    strength: 5,
    walking: 3.5,
  };

  const met = metValues[type.toLowerCase()] || 5;
  return Math.round((met * weight * duration) / 60);
}
