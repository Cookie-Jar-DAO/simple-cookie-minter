import { useWalletClient } from "wagmi";
import { ICreateJarFormInput } from "../../components/CreateJarForm";
import { CookieNFT } from "../abis";
import { useDeployment } from "./useDeployment";
import { ZERO_ADDRESS } from "../constants";
import { prepareWriteContract, writeContract } from "wagmi/actions";
import { parseEther } from "viem/utils";

export const useMintNFTJar = () => {
  const walletClient = useWalletClient();
  const deployment = useDeployment();

  console.log("deployment", deployment);

  //   inputs: [
  //     { internalType: "address", name: "to", type: "address" },
  //     { internalType: "uint256", name: "periodLength", type: "uint256" },
  //     { internalType: "uint256", name: "cookieAmount", type: "uint256" },
  //     { internalType: "address", name: "cookieToken", type: "address" },
  //     { internalType: "address", name: "donationToken", type: "address" },
  //     { internalType: "uint256", name: "donationAmount", type: "uint256" },
  //     { internalType: "address[]", name: "allowList", type: "address[]" },
  //     { internalType: "string", name: "details", type: "string" },
  //   ],

  // Details
  // "{\"type\":\"Baal\",\"name\":\"Moloch Pastries\",\"description\":\"This is where you add some more content\",\"link\":\"app.daohaus.club/0x64/0x0....666\"}";

  const mintCookieJarNFT = async (mintData: ICreateJarFormInput) => {
    if (!walletClient) {
      throw new Error("Not connected to wallet");
    }

    if (!deployment?.COOKIE_JAR_NFT_ADDRESS) {
      throw new Error("No cookie jar NFT address provided");
    }

    const details = {
      type: 6551,
      name: mintData.title,
      description: mintData.description,
      link: mintData.link,
    };

    console.log(mintData, details);

    const allowList = mintData.allowList
      .map((a) => a.account)
      .filter((account) => account !== ZERO_ADDRESS);

    const value =
      mintData.donation &&
      mintData.donationAmount &&
      BigInt(mintData.donationAmount) > 0
        ? parseEther(mintData.donationAmount)
        : undefined;

    console.log(JSON.stringify(details));

    const config = await prepareWriteContract({
      address: deployment?.COOKIE_JAR_NFT_ADDRESS,
      abi: CookieNFT,
      functionName: "cookieMint",
      args: [
        mintData.receiver,
        mintData.cookiePeriod,
        mintData.cookieAmount,
        mintData.cookieToken,
        ZERO_ADDRESS, // donation in native token
        mintData.donationAmount,
        allowList,
        JSON.stringify(details),
      ],
      value,
    });

    return await writeContract(config);
  };

  return {
    mintCookieJarNFT,
  };
};
