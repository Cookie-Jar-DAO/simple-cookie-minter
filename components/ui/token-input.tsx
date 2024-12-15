import { forwardRef, useCallback, useEffect, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { Input } from "./input";

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
      (value: string, decimalPlaces: number) => {
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
      [clearError, onChangeAmount, setError],
    );

    useEffect(() => {
      if (initialValue != null && decimalPlaces != null && !initialized) {
        handleChange(
          formatUnits(BigInt(initialValue), decimalPlaces),
          decimalPlaces,
        );
        setInitialized(true);
      }
    }, [initialValue, initialized, handleChange, decimalPlaces]);

    return (
      <div className="flex items-center gap-2">
        <Input
          {...props}
          value={innerValue}
          onChange={(e) => handleChange(e.target.value, decimalPlaces ?? 0)}
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
