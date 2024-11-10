"use client";
import React from "react";
import type { Address } from "viem";

import { useBalance, useReadContract } from "wagmi";

import { formatEther } from "viem";
import { truncateEthereumAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";
import { useToast } from "./ui/use-toast";

const CookieJarBalance = ({
  cookieToken,
  jarTargetAddress,
  owner,
  periodLength,
}: {
  cookieToken: Address;
  jarTargetAddress: Address;
  owner: Address;
  periodLength: string;
}) => {
  const {
    data: jarBalance,
    isLoading,
    isSuccess,
    isError,
  } = useBalance({
    address: jarTargetAddress,
    token: cookieToken,
  });

  const { toast } = useToast();

  return (
    <div className="flex flex-col">
      {isLoading && <div>Loading...</div>}
      {isError && <div>Oops, failed to load balance...</div>}
      {isSuccess && (
        <p>
          Balance: {jarBalance.formatted} {""}
          {jarBalance.symbol}
        </p>
      )}
      <p>Claim period: {periodLength}</p>
      <div className="flex flex-row gap-x-2">
        <span>Owned by: {truncateEthereumAddress(owner)} </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-white"
          aria-label="Copy address"
          onClick={() => {
            navigator.clipboard.writeText(owner);
            toast({
              variant: "default",
              description: `Address copied!`,
            });
          }}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export { CookieJarBalance };
