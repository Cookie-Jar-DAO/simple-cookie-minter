import { cn } from "@/lib/utils";
import { forwardRef, useCallback, useEffect, useState } from "react";

const intervals = {
  minutes: 60,
  hours: 3600,
  days: 86400,
  weeks: 604800,
  months: 2592000,
  years: 31536000,
} as const;

export type TimeInterval = keyof typeof intervals;

export interface TimePeriodInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  initialValue: number;
  initialInterval: TimeInterval;
  onChangeAmount: (val: number) => void;
}

const toSeconds = (value: number, interval: TimeInterval) =>
  Math.floor(value * intervals[interval]);
const fromSeconds = (value: number, interval: TimeInterval) =>
  Math.floor(value / intervals[interval]);

const TimePeriodInput = forwardRef<HTMLInputElement, TimePeriodInputProps>(
  (
    {
      className,
      onChangeAmount,
      initialValue = 14,
      initialInterval = "days",
      ...props
    },
    ref,
  ) => {
    const [selectedInterval, setSelectedInterval] =
      useState<TimeInterval>(initialInterval);
    const [innerValue, setInnerValue] = useState(
      fromSeconds(initialValue, initialInterval),
    );
    const [initialized, setInitialized] = useState(false);
    const handleChange = useCallback(
      (value: string, selectedInterval: TimeInterval) => {
        try {
          const num = parseInt(value);
          if (isNaN(num)) {
            throw new Error("Error parsing");
          } else {
            setInnerValue(num);
            onChangeAmount(toSeconds(num, selectedInterval));
          }
        } catch {
          /*no need to set Error, previous value is still correct and inner value hasnt changed*/
        }
      },
      [onChangeAmount],
    );

    const changeInterval = useCallback(
      (newInterval: TimeInterval, value: number) => {
        setSelectedInterval(newInterval);
        handleChange(value.toString(), newInterval);
      },
      [handleChange],
    );

    useEffect(() => {
      if (initialValue != null && initialInterval != null && !initialized) {
        console.log(initialValue, initialInterval);
        setInnerValue(fromSeconds(initialValue, initialInterval));
        setInitialized(true);
      }
    }, [initialValue, initialized, handleChange, initialInterval]);

    return (
      <div className="flex flex-row items-center gap-2">
        <input
          {...props}
          value={innerValue}
          type="number"
          min={1}
          onChange={(e) => handleChange(e.target.value, selectedInterval)}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
        />
        <select
          value={selectedInterval}
          className="flex h-10 flex-1 cursor-pointer items-center items-center justify-center rounded-md border border-input bg-amber-200 p-2 font-semibold"
          onChange={(e) =>
            changeInterval(e.target.value as TimeInterval, innerValue)
          }
        >
          {Object.keys(intervals).map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

TimePeriodInput.displayName = "TimePeriodInput";

export { TimePeriodInput };
