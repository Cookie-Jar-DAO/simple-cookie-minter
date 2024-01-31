import { useWalletClient } from "wagmi";
import { prepareWriteContract, writeContract } from "wagmi/actions";
import { IClaimFromJarFormInput } from "../../components/ClaimFromJarForm";

export const useReachInJar = () => {
  const walletClient = useWalletClient();

  const reachInCookieJar = async (claimData: IClaimFromJarFormInput) => {
    if (!walletClient) {
      throw new Error("Not connected to wallet");
    }

    const config = await prepareWriteContract({
      address: claimData.cookieJarAddress,
      abi: [
        {
          type: "function",
          name: "reachInJar",
          inputs: [{ name: "_reason", type: "string", internalType: "string" }],
          outputs: [],
          stateMutability: "nonpayable",
        },
      ],
      functionName: "reachInJar",
      args: [claimData.cookieMonster, claimData.reason],
    });

    return await writeContract(config);
  };

  return {
    reachInCookieJar,
  };
};
