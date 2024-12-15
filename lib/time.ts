export type TimeInterval =
  | "minutes"
  | "hours"
  | "days"
  | "weeks"
  | "months"
  | "years";

export const intervals: Record<TimeInterval, number> = {
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2592000,
  years: 31536000,
} as const;

export const toSeconds = (value: number, interval: TimeInterval) =>
  Math.floor(value * intervals[interval]);
export const fromSeconds = (value: number, interval: TimeInterval) =>
  Math.floor(value / intervals[interval]);
