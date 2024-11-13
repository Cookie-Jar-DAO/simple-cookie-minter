import { Config, useWalletClient } from "wagmi";
import { writeContract, simulateContract } from "wagmi/actions";
import type { z } from "zod";
import { CookieClaimSchema } from "@/components/claim-from-jar-form";

import { CookieJarCore } from "../abis";
import { wagmiConfig } from "@/config/wagmi";
export const useReachInJar = () => {
  const walletClient = useWalletClient();

  const reachInCookieJar = async (claimData: z.infer<typeof CookieClaimSchema>) => {
    if (!walletClient) {
      throw new Error("Not connected to wallet");
    }
    console.log("claim data jar address:", claimData.cookieJarAddress);

    const { request } = await simulateContract(wagmiConfig, {
      address: claimData.cookieJarAddress,
      abi: CookieJarCore,
      functionName: "reachInJar",
      args: [claimData.cookieMonster, JSON.stringify(claimData.reason)],
    });
    console.log("request", request);

    return await writeContract(wagmiConfig, request);
  };

  return {
    reachInCookieJar,
  };
};
