import { useEffect, useState } from "react";
import { useDeployment } from "./useDeployment";
import CookieJarIndexer from "../../lib/indexer/CookieJarIndexer";
import { parseAbiItem } from "abitype";
import { db } from "../../lib/indexer";
import { useChainId, usePublicClient } from "wagmi";
import { isAddress } from "viem";

// TODO replace indexer with Graph instance
export const useIndexer = () => {
  const [indexer, setIndexer] = useState<CookieJarIndexer>();
  const deployment = useDeployment();
  const publicClient = usePublicClient();
  const chainId = useChainId();

  useEffect(() => {
    if (publicClient && !indexer && Number(chainId) > 0) {
      const initIndexer = async (chainId: number) => {
        console.log("Initializing cookie jar indexer...");
        // check if the indexer has not been initialized
        const indexer = new CookieJarIndexer(publicClient);
        setIndexer(indexer);

        // Subscribe to Poster
        //TODO better poster state management
        if (!(await db.keyvals.get(`posterState-${chainId}`)) && deployment) {
          await db.keyvals.add(
            { lastBlock: BigInt(5173582) }, //TODO replace hardcoded startblock for indexer
            `posterState-${chainId}`
          );
        }
      };

      initIndexer(Number(chainId));
    }
  }, []);

  useEffect(() => {
    if (deployment && indexer) {
      // TODO replace hardcoded Sepolia chainId
      if (chainId === 11155111) {
        const factoryAddress = deployment.find(
          (contract) => contract.contractName === "CookieJarFactory"
        )?.contractAddress;

        if (!factoryAddress || !isAddress(factoryAddress)) {
          throw new Error("No factory address found");
        }
        console.log("Registering initial subscriptions...");
        // Subscribe to Cookie Jar Factory
        indexer.subscribe(
          chainId,
          factoryAddress,
          parseAbiItem(
            "event SummonCookieJar(address cookieJar, bytes initializer, string details, string uid)"
          ),
          BigInt(5173582),
          "StoreCookieJar"
        );
      }
    }
  }, [deployment, indexer, chainId]);

  return {
    indexer,
    client: publicClient,
  };
};
