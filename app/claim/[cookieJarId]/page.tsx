"use client";
import Confetti from "react-confetti";

import { DisplayClaim } from "@/components/DisplayClaim";
import { DetailsBox } from "@/components/DetailsBox";
import ClaimFromJarForm from "@/components/ClaimFromJarForm";
import { useState } from "react";
import { useCookieJar } from "@/app/hooks/useCookieJar";
import { useAccount } from "wagmi";
import { Spinner } from "@/components/Spinner";
import useWindowSize from "@/app/hooks/useWindowSize";
import { isAddress } from "viem";
import Link from "next/link";

export default function Claims({
  params,
}: {
  params: { cookieJarId: string };
}) {
  const { isConnected } = useAccount();
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();
  const { cookieJarId } = params;

  const {
    cookieJar,
    isLoading,
    error,
    data,
    hasClaimed,
    canClaim,
    token,
    refetch,
  } = useCookieJar({
    cookieJarId,
  });

  console.log({ cookieJarId, cookieJar, isLoading, error, data });

  if (!cookieJar || !token)
    return (
      <DisplayClaim
        heading="Cookiejar not found"
        description="How did you get here?"
      />
    );

  if (!isConnected)
    return (
      <DisplayClaim
        heading="Connect Your Wallet"
        description="You need to connect your wallet in order to see if you are eligable for a claim"
      />
    );

  if (isLoading)
    return (
      <DisplayClaim
        heading="Loading Claim Data"
        description="Please wait while we load your claim data"
        element={<Spinner size="12rem" />}
      />
    );
  if (error)
    return (
      <DisplayClaim
        heading="Error"
        description={"Error fetching claim data from network RPC"}
      />
    );

  // Has Claimed, but needs to wait for the next claim period
  if (data && hasClaimed && !canClaim)
    return (
      <DisplayClaim
        heading="Time until next claim period."
        description="You have already claimed your cookie. You will be able to claim again in the next claim period."
        element={
          <>
            {showConfetti && (
              <Confetti
                width={width}
                height={height}
                gravity={0.05}
                recycle={false}
                numberOfPieces={100}
                tweenDuration={20000}
                colors={[
                  "#f5deb3",
                  "#e6c281",
                  "#8a6015",
                  "#f44336",
                  "#e91e63",
                  "#9c27b0",
                  "#673ab7",
                  "#3f51b5",
                  "#2196f3",
                  "#03a9f4",
                  "#00bcd4",
                  "#009688",
                  "#4CAF50",
                  "#8BC34A",
                  "#CDDC39",
                  "#FFEB3B",
                  "#FFC107",
                  "#FF9800",
                  "#FF5722",
                  "#795548",
                ]}
                onConfettiComplete={() => setShowConfetti(false)}
                drawShape={(ctx) => {
                  // Draw the cookie
                  ctx.beginPath();
                  // ctx.fillStyle = '#f5deb3';
                  ctx.arc(40, 40, 32, 0, 2 * Math.PI);
                  ctx.fill();

                  // Draw the chocolate chips
                  const numChips = 15;

                  for (let i = 0; i < numChips; i++) {
                    let randomSize = Math.floor(Math.random() * 2.4) + 1.6;
                    let chipSize = randomSize;
                    let chipX =
                      Math.floor(Math.random() * (80 - chipSize * 2)) +
                      chipSize;
                    let chipY =
                      Math.floor(Math.random() * (80 - chipSize * 2)) +
                      chipSize;

                    // Check if the chip is inside the cookie
                    let dX = chipX - 40;
                    let dY = chipY - 40;
                    let distance = Math.sqrt(dX * dX + dY * dY);
                    if (distance + chipSize <= 32) {
                      // The chip is inside the cookie, so draw it
                      ctx.beginPath();
                      ctx.fillStyle = "#8b4513";
                      ctx.arc(chipX, chipY, chipSize, 0, 2 * Math.PI);
                      ctx.fill();
                    }
                  }
                }}
              />
            )}

            <DetailsBox
              claimAmt={data.claimAmt}
              claimPeriod={data.claimPeriod}
              unit={token.token!.symbol}
              claimId={cookieJar?.jarUid}
            />
            <p className="mb-4">
              Go to <Link href={`/history/${cookieJar?.jarUid}`}>History</Link>
              to inspect the crumbles.
            </p>
          </>
        }
      />
    );
  // Has not claimed
  if (data && canClaim && cookieJar?.address && isAddress(cookieJar.address))
    return (
      <div className="flex flex-column p-24">
        <DetailsBox
          claimAmt={data.claimAmt}
          claimPeriod={data.claimPeriod}
          unit={token.token!.symbol}
          claimId={cookieJar?.jarUid}
        />
        <ClaimFromJarForm cookieJarAddress={cookieJar?.address} />
      </div>
    );

  return null;
}
