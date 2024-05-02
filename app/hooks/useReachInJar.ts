import { useWalletClient } from "wagmi";
import { writeContract, simulateContract } from "wagmi/actions";
import { IClaimFromJarFormInput } from "../../components/ClaimFromJarForm";
import { wagmiConfig } from "../providers";
import { CookieJarCore } from "../abis";

export const useReachInJar = () => {
  const walletClient = useWalletClient();

  const reachInCookieJar = async (claimData: IClaimFromJarFormInput) => {
    if (!walletClient) {
      throw new Error("Not connected to wallet");
    }

    const { request } = await simulateContract(wagmiConfig, {
      address: claimData.cookieJarAddress,
      abi: CookieJarCore,
      functionName: "reachInJar",
      args: [claimData.cookieMonster, claimData.reason],
    });
    console.log("request", request);

    return await writeContract(wagmiConfig, request);
  };

  return {
    reachInCookieJar,
  };
};
