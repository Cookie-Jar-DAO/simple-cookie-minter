"use client";
import React from "react";
import type { Address } from "viem";

import { useBalance } from "wagmi";

import { truncateEthereumAddress } from "@/lib/utils";
import { Button } from "./ui/button";
import { Copy, Info } from "lucide-react";
import { useToast } from "./ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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
      <p>Owned by: {truncateEthereumAddress(owner)}</p>
      <div className="flex flex-row items-center gap-x-2">
        <span>Jar address: {truncateEthereumAddress(owner)}</span>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                size={16}
                strokeWidth={2}
                aria-label="Information about jar address"
                className="rounded-md text-gray-400 hover:bg-accent hover:text-white"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                This is the address of the safe that holds CookieJar funds. Use
                this if you want to fund the jar from a DAO or Multisig
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-400 hover:text-white"
          aria-label="Copy address"
          onClick={() => {
            navigator.clipboard.writeText(jarTargetAddress);
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
