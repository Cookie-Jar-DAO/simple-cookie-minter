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

export function formatTimeDuration(seconds: number): string {
  if (seconds <= 0) return "0 seconds";

  const timeUnits = [
    { unit: "year", seconds: 31536000 }, // 365 days
    { unit: "month", seconds: 2592000 }, // 30 days
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  let remainingSeconds = seconds;
  const parts: string[] = [];

  for (const { unit, seconds: unitSeconds } of timeUnits) {
    if (remainingSeconds >= unitSeconds) {
      const count = Math.floor(remainingSeconds / unitSeconds);
      parts.push(`${count} ${unit}${count !== 1 ? "s" : ""}`);
      remainingSeconds %= unitSeconds;
    }

    // Optional: Limit to 2 units for readability
    if (parts.length === 2) break;
  }

  return parts.join(" ");
}
