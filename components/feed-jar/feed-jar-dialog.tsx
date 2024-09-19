"use client";
import { useState } from "react";

import {
  useBalance,
  useSendTransaction,
  useWriteContract,
  useAccount,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther, type Address, erc20Abi } from "viem";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ZERO_ADDRESS } from "@/app/constants";
import type { z } from "zod";
import FeedJarForm, { type FeedJarSchema } from "./feed-jar-form";
import { toast } from "../ui/use-toast";

const FeedJarDialog = ({
  targetAddress,
  cookieToken,
  cookieAmount,
}: {
  targetAddress: Address;
  cookieToken: Address;
  cookieAmount: string;
}) => {
  const { address, isDisconnected, isReconnecting, isConnecting, isConnected } =
    useAccount();
  const { data: jarToken } = useBalance({
    address: targetAddress,
    token: cookieToken === ZERO_ADDRESS ? undefined : cookieToken,
  });
  const { sendTransaction } = useSendTransaction();
  const {
    data: approval,
    isPending: isApprovalPending,
    writeContract: approveToken,
  } = useWriteContract();
  const {
    data: hash,
    isPending,
    writeContract: transferToken,
  } = useWriteContract();
  const { data } = useWriteContract({
    mutation: {
      onError: () =>
        toast({
          title: "Oops! Failed to send",
          description: "Please try again later",
        }),
    },
  });

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const disabled = !address;

  const getDescription = () => {
    if (!address || isDisconnected) {
      return "Connect your wallet to feed this jar";
    }
    if (isConnecting || isReconnecting) {
      return "Connecting wallet...";
    }
    if (isConnected) {
      return `Deposit ${jarToken?.symbol} tokens into this jar`;
    }
  };

  async function handleSendTokens(data: z.infer<typeof FeedJarSchema>) {
    console.log("data", data);
    if (!address) {
      throw new Error("Not connected to wallet");
    }
    if (!approval) {
      approveToken(
        {
          address: cookieToken,
          abi: erc20Abi,
          functionName: "approve",
          args: [address, BigInt(data.amount)],
        },
        {
          onError: () =>
            toast({
              title: "Oops! Failed to approve",
              description: "Please try again later",
            }),
        },
      );
    }
    if (approval) {
      transferToken({
        address: cookieToken,
        abi: erc20Abi,
        functionName: "transferFrom",
        args: [address, targetAddress, BigInt(data.amount)],
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Feed me!</Button>
      </DialogTrigger>
      <DialogContent className="bg-amber-100">
        <DialogHeader>
          <DialogTitle>Feed me Seymour!</DialogTitle>
          <DialogDescription>{getDescription()}</DialogDescription>
        </DialogHeader>
        {isPending && <div>Pending...</div>}
        {isConfirming && <div>Confirming...</div>}
        {isConfirmed && <div>Confirmed!</div>}
        <FeedJarForm sendTokens={handleSendTokens} />
      </DialogContent>
    </Dialog>
  );
};

export { FeedJarDialog };
