import { useEffect, useState } from "react";
import { useDeployment } from "./useDeployment";
import CookieJarIndexer from "../utils/indexer/CookieJarIndexer";
import { parseAbiItem } from "abitype";
import { db } from "../utils/indexer";
import { useChainId, usePublicClient } from "wagmi";

export const useIndexer = () => {
  const [indexer, setIndexer] = useState<CookieJarIndexer>();
  const addresses = useDeployment();
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
        if (!(await db.keyvals.get(`posterState-${chainId}`)) && addresses) {
          await db.keyvals.add(
            { lastBlock: BigInt(addresses.START_BLOCK) },
            `posterState-${chainId}`
          );
        }
      };

      initIndexer(Number(chainId));
    }
  }, []);

  useEffect(() => {
    if (addresses && indexer) {
      const chainId = Number(addresses?.CHAIN_ID);
      if (chainId === 5 || chainId === 100 || chainId === 11155111) {
        console.log("Registering initial subscriptions...");
        // Subscribe to Cookie Jar Factory
        indexer.subscribe(
          chainId,
          addresses?.COOKIEJAR_FACTORY_ADDRESS as `0x${string}`,
          parseAbiItem(
            "event SummonCookieJar(address cookieJar, bytes initializer, string details, string uid)"
          ),
          BigInt(addresses.START_BLOCK),
          "StoreCookieJar"
        );
      }
    }
  }, [addresses, indexer]);

  return {
    indexer,
    client: publicClient,
  };
};
