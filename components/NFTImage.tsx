import Image from "next/image";
import { useCookieNFT } from "../app/hooks/useCookieJarNFT";
import { useDeployment } from "../app/hooks/useDeployment";
import { useAccount } from "wagmi";

export const NFTImage = () => {
  const deployment = useDeployment();
  const { address } = useAccount();

  const { totalSupply } = useCookieNFT({
    nftAddress: deployment?.LIST_COOKIEJAR_6551_ADDRESS,
  });

  const nextTokenId = totalSupply ? totalSupply + 1 : 1;
  // TODO: don't hard code this
  // link to animation
  const nft =
    "https://ipfs.io/ipfs/Qme4HsmWQSmShQ3dDPZGD8A5kyTPceTEP5dVkWnsMHhC2Z/";
  return (
    <div className="flex flex-col">
      <img
        src={`${nft}${nextTokenId}.png`}
        alt="Cookie image"
        height={250}
        width={250}
      />
      <h2>Next tokenId: {nextTokenId}</h2>
    </div>
  );
};
