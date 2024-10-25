"use client";
import React from "react";

import type { Address } from "viem";
import { useAccount, useBalance, useReadContract } from "wagmi";

import { CookieJarCore } from "@/abis/CookieJarCore";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ClaimFromJarForm } from "@/components/claim-from-jar-form";

import { cn } from "@/lib/utils";

const ClaimDialog = ({
  contractAddress,
  cookieToken,
  jarTargetAddress,
}: {
  contractAddress: Address;
  cookieToken: Address;
  jarTargetAddress: Address;
}) => {
  const { address, isDisconnected, isConnecting } = useAccount();
  const {
    data: canClaim,
    isError,
    isLoading,
  } = useReadContract({
    abi: CookieJarCore,
    address: contractAddress,
    functionName: "canClaim",
    args: [address],
    query: {
      enabled:
        !!address && !!contractAddress && !isDisconnected && !isConnecting,
    },
  });
  const {
    data: jarBalance,
    isLoading: isJarBalanceLoading,
    isSuccess,
    isError: isJarBalanceError,
  } = useBalance({
    address: jarTargetAddress,
    token: cookieToken,
  });

  if (isDisconnected) {
    return <p>Must connect wallet to claim</p>;
  }

  if (isConnecting || isLoading) {
    return <div>Loading...</div>;
  }

  if (!canClaim || (jarBalance && jarBalance?.value <= 0)) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="cursor-not-allowed">
              <Button disabled className=" cursor-not-allowed">
                Claim
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {jarBalance && jarBalance.value <= 0
                ? "Oh No! No Cookies in this jar"
                : "You are not eligible to reach in this jar"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Claim</Button>
      </DialogTrigger>
      <DialogContent className="bg-amber-100">
        <DialogHeader>
          <DialogTitle>Let&apos;s bake</DialogTitle>
          <DialogDescription>
            You are eligible to claim from this Jar
          </DialogDescription>
        </DialogHeader>
        <ClaimFromJarForm cookieJarAddress={contractAddress} />
      </DialogContent>
    </Dialog>
  );
};

export { ClaimDialog };
