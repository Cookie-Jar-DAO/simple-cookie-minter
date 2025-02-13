import { fromSeconds, intervals, TimeInterval, toSeconds } from "@/lib/time";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export interface TimePeriodInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  initialValue: number;
  initialInterval: TimeInterval;
  onChangeAmount: (val: number) => void;
}
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
          setInnerValue(num);
          if (isNaN(num)) {
            onChangeAmount(0);
            throw new Error("Error parsing");
          } else {
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
        setInnerValue(fromSeconds(initialValue, initialInterval));
        setInitialized(true);
      }
    }, [initialValue, initialized, handleChange, initialInterval]);

    return (
      <div className="flex flex-row items-center gap-2">
        <Input
          {...props}
          value={innerValue}
          type="number"
          min={0}
          onChange={(e) => handleChange(e.target.value, selectedInterval)}
          className={className}
          ref={ref}
        />
        <Select
          value={selectedInterval}
          onValueChange={(value: TimeInterval) =>
            changeInterval(value, innerValue)
          }
        >
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select a time interval" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(intervals).map((i) => (
              <SelectItem key={i} value={i}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  },
);

TimePeriodInput.displayName = "TimePeriodInput";

export { TimePeriodInput };
