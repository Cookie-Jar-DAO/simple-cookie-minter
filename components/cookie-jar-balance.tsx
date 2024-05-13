"use client";
import React from "react";
import { Address } from "viem";

import { useBalance, useReadContract } from "wagmi";

import { formatEther } from "viem";

const CookieJarBalance = ({ jarAddress }: { jarAddress: Address }) => {
  const { data: targetAddress } = useReadContract({
    abi: [
      {
        inputs: [],
        name: "target",
        outputs: [
          {
            internalType: "address",
            name: "target",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    address: jarAddress,
    functionName: "target",
  });

  const {
    data: jarBalance,
    isLoading,
    isSuccess,
    isError,
  } = useBalance({
    address: targetAddress,
    query: {
      enabled: !!targetAddress,
    },
  });
  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {isError && <div>Oops, something went wrong...</div>}
      {isSuccess && (
        <div className="flex gap-2">
          <p>
            Balance: {formatEther(jarBalance.value)} {jarBalance.symbol}
          </p>
        </div>
      )}
    </div>
  );
};

export { CookieJarBalance };
