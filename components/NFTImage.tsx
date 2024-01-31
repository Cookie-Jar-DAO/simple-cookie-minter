/* eslint-disable @next/next/no-img-element */
"use client";
import { useCookieNFT } from "../app/hooks/useCookieJarNFT";
import { useDeployment } from "../app/hooks/useDeployment";

export const NFTImage = () => {
  const deployment = useDeployment();

  const cookieJarNFT = deployment?.find(
    (contract) => contract.contractName === "CookieJarNFT"
  );

  const cookieNft = useCookieNFT({
    nftAddress: cookieJarNFT?.contractAddress,
  });

  if (!cookieNft) return null;

  const { totalSupply } = cookieNft;

  const nextTokenId = totalSupply ? totalSupply + 1 : 1;
  // TODO: don't hard code this
  // link to animation
  const ipfsImageData =
    "https://ipfs.io/ipfs/Qme4HsmWQSmShQ3dDPZGD8A5kyTPceTEP5dVkWnsMHhC2Z/";

  return (
    <div className="flex flex-col">
      <img
        src={`${ipfsImageData}${nextTokenId}.png`}
        alt="Cookie image"
        height={250}
        width={250}
      />
      <h2>Next tokenId: {nextTokenId}</h2>
    </div>
  );
};
