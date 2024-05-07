"use client";
import React from "react";

import { useAccount, useReadContract } from "wagmi";

import { CookieJarCore } from "@/app/abis/CookieJarCore";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClaimFromJarForm } from "./claim-from-jar-form";

const ClaimButton = ({
  contractAddress,
}: {
  contractAddress: `0x${string}`;
}) => {
  console.log("contractAddress", contractAddress);
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
    return <div>You must Connect your Wallet</div>;
  }

  if (isConnecting || isLoading) {
    return <div>Loading...</div>;
  }

  if (!canClaim) {
    return <div>You are not eligible to claim from this Jar</div>;
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

export default ClaimButton;
