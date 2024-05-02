"use client";
import React from "react";

import { CookieJarCore } from "@/app/abis/CookieJarCore";
import { useReadContract } from "wagmi";

const ClaimButton = () => {
  const result = useReadContract({
    abi: CookieJarCore,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    functionName: "canClaim",
  });
  return <div>ClaimButton</div>;
};

export default ClaimButton;
