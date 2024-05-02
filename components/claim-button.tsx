"use client";
import React from "react";

import { CookieJarCore } from "@/app/abis/CookieJarCore";
import { useAccount, useReadContract } from "wagmi";

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

  if (canClaim) {
    <div>Claim Button Modal</div>;
  }
};

export default ClaimButton;
