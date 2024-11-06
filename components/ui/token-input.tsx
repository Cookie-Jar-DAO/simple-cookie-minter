import { cn } from "@/lib/utils";
import { forwardRef, useCallback, useEffect, useState } from "react";
import { parseUnits } from "viem";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  decimalPlaces?: number;
  symbol: string;
  initialValue: string;
  onChangeAmount: (val: string) => void;
  setError: (e: string) => void;
  clearError: () => void;
}

const TokenInput = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      decimalPlaces,
      symbol,
      onChangeAmount,
      initialValue,
      setError,
      clearError,
      ...props
    },
    ref,
  ) => {
    const [innerValue, setInnerValue] = useState(initialValue);
    const [initialized, setInitialized] = useState(false);
    const handleChange = useCallback(
      (value: string) => {
        setInnerValue(value);
        try {
          const inWei = parseUnits(value, decimalPlaces ?? 0);
          if (inWei === BigInt("0") && value !== "0") throw new Error();
          onChangeAmount(BigInt(inWei).toString());
          clearError();
        } catch {
          setError("Check number format");
        }
      },
      [clearError, decimalPlaces, onChangeAmount, setError],
    );

    useEffect(() => {
      if (initialValue != null && decimalPlaces != null && !initialized) {
        handleChange(initialValue);
        setInitialized(true);
      }
    }, [initialValue, initialized, handleChange, decimalPlaces]);

    return (
      <div className="flex items-center gap-2">
        <input
          {...props}
          value={innerValue}
          type="text"
          onChange={(e) => handleChange(e.target.value)}
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
        />
        <span className="flex h-10 items-center items-center justify-center rounded-md border border-input bg-amber-200 p-2 font-semibold">
          {symbol || "❓"}
        </span>
      </div>
    );
  },
);

TokenInput.displayName = "TokenInput";

export { TokenInput };
