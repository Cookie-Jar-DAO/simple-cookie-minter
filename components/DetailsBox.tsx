import Link from "next/link";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { parseUnits } from "viem";
import { Duration } from "luxon";

export const DetailsBox = ({
  claimAmt,
  claimPeriod,
  unit,
  claimId,
}: {
  claimAmt: bigint;
  claimPeriod: bigint;
  unit: string;
  claimId: string | undefined;
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>Claim details</CardDescription>
      </CardHeader>
      <CardContent>
        <ClaimDetails
          claimAmt={claimAmt}
          claimPeriod={claimPeriod}
          unit={unit}
        />
      </CardContent>
      <CardFooter>
        {" "}
        <Link
          rel="noopener noreferrer"
          href={`/history/${claimId || ""}`}
          className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent"
        >
          <Button>View History</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export const ClaimDetails = ({
  claimAmt,
  claimPeriod,
  unit,
}: {
  claimAmt: bigint;
  claimPeriod: bigint;
  unit: string;
}) => {
  var dur = Duration.fromObject({ seconds: Number(claimPeriod) });

  const renderDuration = () => {
    if (dur.as("hours") > 24) {
      return dur.toFormat("d 'days'");
    } else if (dur.as("hours") > 1) {
      return dur.toFormat("h 'hours'");
    } else {
      return dur.toFormat("m 'minutes'");
    }
  };

  return (
    <>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Claim amount</h4>
        <p className="text-sm text-muted-foreground">
          {parseUnits(claimAmt.toString(), 18).toString()}
        </p>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Claim period</h4>
        <p className="text-sm text-muted-foreground">{renderDuration()}</p>
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-medium leading-none">Balance</h4>
        <p className="text-sm text-muted-foreground">{unit}</p>
      </div>
    </>
  );
};
