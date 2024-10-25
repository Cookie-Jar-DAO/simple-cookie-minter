"use client";
import React from "react";
import type { Address } from "viem";

import { useBalance, useReadContract } from "wagmi";

import { formatEther } from "viem";
import { truncateEthereumAddress } from "@/lib/utils";

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
    </div>
  );
};

export { CookieJarBalance };
