import { useQuery } from "@tanstack/react-query";

import { CookieJarCore } from "../abis";
import { Abi, Address, PublicClient } from "viem";
import { db } from "../../lib/indexer/db";
import { useLiveQuery } from "dexie-react-hooks";
import { useAccount, useChainId, usePublicClient } from "wagmi";
import useCookieJarToken from "./useCookieJarToken";

// fetch user cookie claim data from the blockchain
const fetchUserClaim = async ({
  cookieJarAddress,
  userAddress,
  chainId,
  publicClient,
}: {
  cookieJarAddress?: Address;
  userAddress?: Address;
  chainId?: number;
  publicClient: PublicClient;
}) => {
  if (!cookieJarAddress || !chainId) {
    throw new Error("No cookie jar address provided");
  }

  console.log("FETCHING USER CLAIM");

  const contract = {
    address: cookieJarAddress as `0x${string}`,
    abi: CookieJarCore as Abi,
  };

  try {
    const [
      lastClaimed,
      claimAmt,
      claimPeriod,
      cookieToken,
      isMember,
      target,
      canClaim,
    ] = await Promise.all([
      publicClient.readContract({
        ...contract,
        functionName: "claims",
        args: [userAddress],
      }),
      publicClient.readContract({
        ...contract,
        functionName: "cookieAmount",
      }),
      publicClient.readContract({
        ...contract,
        functionName: "periodLength",
      }),
      publicClient.readContract({
        ...contract,
        functionName: "cookieToken",
      }),
      publicClient.readContract({
        ...contract,
        functionName: "isAllowList",
        args: [userAddress],
      }),
      publicClient.readContract({
        ...contract,
        functionName: "owner",
      }),
      publicClient.readContract({
        ...contract,
        functionName: "canClaim",
        args: [userAddress],
      }),
    ]);

    return {
      lastClaimed: lastClaimed as bigint,
      claimAmt: claimAmt as bigint,
      claimPeriod: claimPeriod as bigint,
      cookieToken: cookieToken as string,
      target: target as string,
      canClaim: canClaim as boolean,
      isMember: isMember as boolean,
    };
  } catch (error: any) {
    console.error(error);
    throw new Error(error?.message as string);
  }
};

// custom hook to fetch and return user claim data
// export const useCookieJar = ({ cookieJarId }: { cookieJarId: string }) => {
//   const publicClient = usePublicClient();
//   const chainId = useChainId();
//   const { address } = useAccount();
//   const chain = publicClient.chain;

//   const cookieJar = useLiveQuery(() => db.cookieJars.get(cookieJarId));

//   const { data, ...rest } = useQuery({
//     queryKey: ["claimData", { address }],
//     queryFn: () =>
//       fetchUserClaim({
//         cookieJarAddress: cookieJar?.address as `0x${string}`,
//         userAddress: address?.toLowerCase() as `0x${string}`,
//         chainId,
//         publicClient: client!,
//       }),

//     enabled: !!address && !!cookieJar && !!chainId && !!client,
//     refetchInterval: 5000,
//   });

//   const token = useCookieJarToken({ cookieJar: cookieJar! });

//   // determine if user has claimed cookies before
//   const hasClaimed = data?.lastClaimed && Number(data.lastClaimed) > 0;
//   // determine if user can claim based on last claim time and claim period
//   const canClaim = data?.canClaim || !hasClaimed;
//   const isMember = data?.canClaim;

//   // return user claim data along with helper variables and the query status
//   return {
//     cookieJar,
//     data,
//     hasClaimed,
//     canClaim,
//     isMember,
//     token,
//     ...rest,
//   };
// };
