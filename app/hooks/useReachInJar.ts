import { useWalletClient } from "wagmi";
import { CookieNFT } from "../abis";
import { useDeployment } from "./useDeployment";
import { prepareWriteContract, writeContract } from "wagmi/actions";
import { IClaimFromJarFormInput } from "../../components/ClaimFromJarForm";

export const useReachInJar = () => {
  const walletClient = useWalletClient();
  const deployment = useDeployment();

  console.log("deployment", deployment);

  // inputs: [
  //     { internalType: "address", name: "cookieMonster", type: "address" },
  //     { internalType: "string", name: "_reason", type: "string" },
  //   ],

  const reachInCookieJar = async (claimData: IClaimFromJarFormInput) => {
    if (!walletClient) {
      throw new Error("Not connected to wallet");
    }

    if (!deployment?.COOKIE_JAR_NFT_ADDRESS) {
      throw new Error("No cookie jar NFT address provided");
    }

    const config = await prepareWriteContract({
      address: deployment?.COOKIE_JAR_NFT_ADDRESS,
      abi: CookieNFT,
      functionName: "reachInJar",
      args: [claimData.cookieMonster, claimData.reason],
    });

    return await writeContract(config);
  };

  return {
    reachInCookieJar,
  };
};
