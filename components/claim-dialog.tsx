"use client";
import React from "react";

import type { Address } from "viem";
import { useAccount, useReadContract } from "wagmi";
import { ConnectKitButton } from "connectkit";

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

const ClaimDialog = ({ contractAddress }: { contractAddress: Address }) => {
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

  if (isDisconnected) {
    return <ConnectKitButton />;
  }

  if (isConnecting || isLoading) {
    return <div>Loading...</div>;
  }

  if (!canClaim) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger disabled className={cn(buttonVariants)}>
            Claim
          </TooltipTrigger>
          <TooltipContent>
            <p>You are not eligible to reach in this jar</p>
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
