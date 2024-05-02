import { useWalletClient } from "wagmi";
import { writeContract, simulateContract } from "wagmi/actions";
import { IClaimFromJarFormInput } from "../../components/ClaimFromJarForm";
import { wagmiConfig } from "../providers";

export const useReachInJar = () => {
  const walletClient = useWalletClient();

  const reachInCookieJar = async (claimData: IClaimFromJarFormInput) => {
    if (!walletClient) {
      throw new Error("Not connected to wallet");
    }

    const { request } = await simulateContract(wagmiConfig, {
      address: claimData.cookieJarAddress,
      abi: [
        {
          type: "function",
          name: "reachInJar",
          inputs: [
            { name: "cookieMonster", type: "string", internalType: "address" },
            { name: "_reason", type: "string", internalType: "string" },
          ],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],
      functionName: "reachInJar",
      args: [claimData.cookieMonster, claimData.reason],
    });

    return await writeContract(wagmiConfig, request);
  };

  return {
    reachInCookieJar,
  };
};
