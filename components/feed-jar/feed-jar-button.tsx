"use client";
import { Button } from "@/components/ui/button";

import { useSendTransaction } from "wagmi";
import { type Address, parseEther } from "viem";

const FeedJarButton = ({ targetAddress }: { targetAddress: Address }) => {
  const { sendTransaction } = useSendTransaction();
  return (
    <Button
      onClick={() =>
        sendTransaction({
          to: targetAddress,
          value: parseEther("0.01"),
        })
      }
      variant="outline"
    >
      Feed me!
    </Button>
  );
};

export { FeedJarButton };
