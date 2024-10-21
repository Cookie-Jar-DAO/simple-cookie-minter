import { Config, useWalletClient } from "wagmi";
import { writeContract, simulateContract } from "wagmi/actions";
import type { IClaimFromJarFormInput } from "@/components/ClaimFromJarForm";
import { config } from "@/config";
import { CookieJarCore } from "../abis";

export const useReachInJar = () => {
  const walletClient = useWalletClient();

  const reachInCookieJar = async (claimData: IClaimFromJarFormInput) => {
    console.log("claimData", claimData);
    if (!walletClient) {
      throw new Error("Not connected to wallet");
    }
    console.log("claim data jar address:", claimData.cookieJarAddress);

    const { request } = await simulateContract(config as Config, {
      address: claimData.cookieJarAddress,
      abi: CookieJarCore,
      functionName: "reachInJar",
      args: [claimData.cookieMonster, claimData.reason],
    });
    console.log("request", request);

    return await writeContract(config as Config, request);
  };

  return {
    reachInCookieJar,
  };
};
