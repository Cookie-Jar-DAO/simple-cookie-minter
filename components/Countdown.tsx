import { useEffect, useState } from "react";

import { DataXl } from "@daohaus/ui";
import { formatPeriods, nowInSeconds } from "@daohaus/utils";

export const Countdown = ({
  claimPeriod,
  lastClaimed,
}: {
  claimPeriod: bigint;
  lastClaimed: bigint;
}) => {
  const [timeLeft, setTimeLeft] = useState<string | 0>("");

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(
        formatPeriods(
          BigInt(claimPeriod + lastClaimed - BigInt(nowInSeconds())).toString()
        )
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return <DataXl style={{ marginBottom: "2rem" }}>{timeLeft}</DataXl>;
};
