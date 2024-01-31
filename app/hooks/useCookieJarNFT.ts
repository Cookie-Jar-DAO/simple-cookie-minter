import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { ZERO_ADDRESS } from "../constants";

export const useCookieNFT = ({ nftAddress }: { nftAddress?: string }) => {
  const publicClient = usePublicClient();

  const { data, ...rest } = useQuery({
    queryKey: ["nftData", { nftAddress }],
    queryFn: () =>
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
      }),
    enabled: !!nftAddress || !!publicClient,
  });

  if (!nftAddress) {
    console.log("No cookie jar address provided");
    return undefined;
  }

  if (!publicClient) {
    console.log("Not connected to network");
    return undefined;
  }

  const totalSupply = data?.length;

  return {
    data,
    totalSupply,
    ...rest,
  };
};
