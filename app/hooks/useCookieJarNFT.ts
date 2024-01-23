import { useQuery } from "react-query";
import { Address, usePublicClient } from "wagmi";
import { ZERO_ADDRESS } from "../constants";

export const useCookieNFT = ({
  nftAddress,
}: {
  nftAddress?: `0x${string}`;
}) => {
  const publicClient = usePublicClient();

  if (!nftAddress) {
    throw new Error("No cookie jar address provided");
  }

  if (!publicClient) {
    throw new Error("Not connected to network");
  }
  const { data, ...rest } = useQuery(["nftData", { nftAddress }], () =>
    publicClient?.getLogs({
      address: nftAddress as `0x${string}`,
      event: {
        name: "Transfer",
        inputs: [
          { type: "address", indexed: true, name: "from" },
          { type: "address", indexed: true, name: "to" },
          { type: "uint256", indexed: false, name: "value" },
        ],
        type: "event",
      },
      args: {
        from: ZERO_ADDRESS,
      },
    })
  );

  const totalSupply = data?.length;

  return {
    data,
    totalSupply,
    ...rest,
  };
};
