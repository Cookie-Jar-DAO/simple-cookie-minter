import { useWalletClient } from "wagmi";
import type {
  ICreateJarFormInput,
  ICreateJarFormInputBaal,
  ICreateJarFormInputERC20,
  ICreateJarFormInputERC721,
  ICreateJarFormInputHats,
} from "@/components/types/CookieTypes";
import { useDeployment } from "./useDeployment";
import { ZERO_ADDRESS } from "@/app/constants";
import { writeContract, simulateContract } from "wagmi/actions";
import {
  encodeAbiParameters,
  isAddress,
  parseAbiParameters,
  parseEther,
} from "viem/utils";
import { useToast } from "@/components/ui/use-toast";
import { wagmiConfig } from "@/config/wagmi";

export const useMintNFTJar = () => {
  const walletClient = useWalletClient();
  const deployment = useDeployment();
  const { toast } = useToast();

  const mintCookieJarNFT = async (
    mintData: ICreateJarFormInput &
      (
        | ICreateJarFormInputERC20
        | ICreateJarFormInputERC721
        | ICreateJarFormInputBaal
        | ICreateJarFormInputHats
      ),
  ) => {
    console.log("mintData", mintData);

    if (!walletClient) {
      toast({
        variant: "destructive",
        title: "Oops! Not connected?",
        description: "We couldn't find a wallet",
      });
      return;
    }

    if (!deployment) {
      toast({
        variant: "destructive",
        title: "What? No contracts found!",
        description: "We couldn't find a deployment",
      });
      return;
    }

    const nftContract = deployment.find(
      (contract: { contractName: string }) =>
        contract.contractName === "CookieNFT",
    );

    if (!nftContract) {
      toast({
        variant: "destructive",
        title: "What? No cookie minter contract found!",
        description: "We couldn't find a minter contract for the cookie jar",
      });
      return;
    }

    if (
      !deployment.find(
        (contract: { contractName: string }) =>
          contract.contractName === mintData.cookieJar,
      )
    ) {
      toast({
        variant: "destructive",
        title: "What? No cookie jar implementation found!",
        description: "We couldn't find a cookie jar implementation",
      });
      return;
    }

    const value =
      mintData.donation &&
      mintData.donationAmount &&
      BigInt(mintData.donationAmount) > 0
        ? parseEther(mintData.donationAmount)
        : undefined;
    //   function cookieMint(
    //     address cookieJarImp,
    //     bytes memory _initializer,
    //     string memory details,
    //     address donationToken,
    //     uint256 donationAmount
    // )

    const implementationAddress = deployment.find(
      (contract: { contractName: string }) =>
        contract.contractName === mintData.cookieJar,
    )?.contractAddress;
    const initializer = encodeCookieMintParameters(mintData);
    // Details
    // "{\"type\":\"Baal\",\"name\":\"Moloch Pastries\",\"description\":\"This is where you add some more content\",\"link\":\"app.daohaus.club/0x64/0x0....666\"}";

    const details = {
      type: mintData.cookieJar,
      name: mintData.title,
      description: mintData.description,
      link: mintData.link,
    };

    const { request } = await simulateContract(wagmiConfig, {
      address: nftContract.contractAddress as `0x${string}`,
      abi: nftContract?.abi,
      functionName: "cookieMint",
      args: [
        implementationAddress,
        initializer,
        JSON.stringify(details),
        ZERO_ADDRESS, // donation in native token
        mintData.donationAmount,
      ],
      value,
    });

    return await writeContract(wagmiConfig, request);
  };

  return {
    mintCookieJarNFT,
  };
};

const encodeCookieMintParameters = (
  data: ICreateJarFormInput &
    (
      | ICreateJarFormInputERC20
      | ICreateJarFormInputERC721
      | ICreateJarFormInputBaal
      | ICreateJarFormInputHats
    ),
) => {
  console.log("encode data", data);
  console.log("hatId", "hatId" in data);
  // 0. address owner or safeTarget,
  // 1. uint256 _periodLength,
  // 2. uint256 _cookieAmount,
  // 4. address _cookieToken
  const owner = isAddress(data.receiver) ? data.receiver : ZERO_ADDRESS;
  const periodLength = BigInt(data.cookiePeriod);
  const cookieAmount = BigInt(data.cookieAmount);
  const cookieToken = isAddress(data.cookieToken)
    ? data.cookieToken
    : ZERO_ADDRESS;

  if (owner === ZERO_ADDRESS || periodLength === 0n || cookieAmount === 0n) {
    throw new Error("Invalid input");
  }

  // ERC20
  // 5. address _erc20addr,
  // 6. uint256 _threshold
  if ("erc20Token" in data && data.cookieJar === "ERC20CookieJar6551") {
    const erc20Token = isAddress(data.erc20Token)
      ? data.erc20Token
      : ZERO_ADDRESS;
    const erc20Threshold = BigInt(data.erc20Threshold);

    if (erc20Token === ZERO_ADDRESS || erc20Threshold === 0n) {
      throw new Error("Invalid input");
    }

    const parameters =
      "address owner, uint256 _periodLength, uint256 _cookieAmount, address _cookieToken, address _erc20addr, uint256 _threshold";
    return encodeAbiParameters(parseAbiParameters(parameters), [
      owner,
      periodLength,
      cookieAmount,
      cookieToken,
      erc20Token,
      erc20Threshold,
    ]);
  }

  if ("erc721Token" in data && data.cookieJar === "ERC721CookieJar6551") {
    const erc721Token = isAddress(data.erc721Token)
      ? data.erc721Token
      : ZERO_ADDRESS;
    const erc721Threshold = BigInt(data.erc721Threshold);

    if (erc721Token === ZERO_ADDRESS || erc721Threshold === 0n) {
      throw new Error("Invalid input");
    }

    const parameters =
      "address owner, uint256 _periodLength, uint256 _cookieAmount, address _cookieToken, address _erc721addr, uint256 _threshold";
    return encodeAbiParameters(parseAbiParameters(parameters), [
      owner,
      periodLength,
      cookieAmount,
      cookieToken,
      erc721Token,
      erc721Threshold,
    ]);
  }

  if ("baalDao" in data && data.cookieJar === "BaalCookieJar6551") {
    const baalDao = isAddress(data.baalDao) ? data.baalDao : ZERO_ADDRESS;
    const baalThreshold = BigInt(data.baalThreshold);

    if (baalDao === ZERO_ADDRESS || baalThreshold === 0n) {
      throw new Error("Invalid input");
    }

    const parameters =
      "address owner, uint256 _periodLength, uint256 _cookieAmount, address _cookieToken, address _dao, uint256 _threshold, bool _useShares, bool _useLoot";
    return encodeAbiParameters(parseAbiParameters(parameters), [
      owner,
      periodLength,
      cookieAmount,
      cookieToken,
      baalDao,
      baalThreshold,
      data.baalUseShares,
      data.baalUseLoot,
    ]);
  }

  if ("hatId" in data && data.cookieJar === "HatsCookieJar6551") {
    console.log("hatId in data", data.hatId);
    const hatId = isAddress(data.hatId) ? data.hatId : ZERO_ADDRESS;
    console.log("hatId", hatId);
    const hatThreshold = BigInt(1);

    if (hatId === null || hatId === undefined) {
      throw new Error("Invalid input");
    }
    const parameters =
      "address owner, uint256 _periodLength, uint256 _cookieAmount, address _cookieToken, uint256 _hatId, uint256 _threshold";
    return encodeAbiParameters(parseAbiParameters(parameters), [
      owner,
      periodLength,
      cookieAmount,
      cookieToken,
      hatId,
      hatThreshold,
    ]);
  }

  // Baal
  // 5. address _dao,
  // 6. uint256 _threshold,
  // 7. bool _useShares,
  // 8. bool _useLoot

  // ERC721
  // 5. address _erc721addr,
  // 6. uint256 _threshold

  // List
  // 5. address[] _allowlist
};
