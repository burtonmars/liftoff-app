import type { Category } from './types';

export const CATEGORIES: { key: Category; label: string; color: string }[] = [
  { key: 'health', label: 'Health', color: '#E07A5F' },
  { key: 'finances', label: 'Finances', color: '#81B29A' },
  { key: 'home', label: 'Home', color: '#E6B84F' },
  { key: 'relationships', label: 'Relationships', color: '#5B8FBD' },
  { key: 'admin', label: 'Admin', color: '#7C8594' },
  { key: 'career', label: 'Career', color: '#3D8B8B' },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c])
) as Record<Category, { key: Category; label: string; color: string }>;

export const MAX_BURDEN_PER_CATEGORY = 500;

export const TOKEN_THRESHOLDS = {
  low: { min: 60, max: 74, tokens: 1 },
  mid: { min: 75, max: 89, tokens: 2 },
  high: { min: 90, max: 100, tokens: 3 },
} as const;

export const COMPLETION_MESSAGES: Record<string, { title: string; body: string }> = {
  low: { title: 'Nice.', body: 'One less thing.' },
  medium: { title: 'Real progress.', body: "You can feel the difference." },
  high: { title: 'That was a big one.', body: 'You earned this.' },
  veryHigh: { title: 'You just dropped a boulder.', body: 'Incredible.' },
};

export function getCompletionMessage(score: number) {
  if (score >= 90) return COMPLETION_MESSAGES.veryHigh;
  if (score >= 60) return COMPLETION_MESSAGES.high;
  if (score >= 31) return COMPLETION_MESSAGES.medium;
  return COMPLETION_MESSAGES.low;
}

export function getTokensForScore(score: number): number {
  if (score >= 90) return 3;
  if (score >= 75) return 2;
  if (score >= 60) return 1;
  return 0;
}
