"use client";

import { sepolia } from "wagmi/chains";
import { Card } from "@/components/ui/card";
import ChainJars from "@/components/chain-jars";
import { chainMetadata, supportedChains } from "@/config/endpoint";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useEffect, useState } from "react";
import ChainsSelector from "./chains-selector";
import Image from "next/image";
import { SortSettings } from "@/hooks/useGraphData";
import { useAccount } from "wagmi";

type SortingSelectValues =
  | "cookieAmount-desc"
  | "cookieAmount-asc"
  | "periodLength-asc"
  | "periodLength-desc";

const ChainsList = () => {
  const { isConnected, chainId: userChainId } = useAccount();
  const [isChainValid, setIsChainValid] = useState(true);
  const [sorting, setSorting] = useState<SortSettings>({
    orderBy: "cookieAmount",
    orderDirection: "desc",
  });
  const [filter, setFilter] = useState("");
  const changeSorting = useCallback((val: SortingSelectValues) => {
    const [order, direction] = val.split("-");
    setSorting({
      orderBy: order as SortSettings["orderBy"],
      orderDirection: direction as SortSettings["orderDirection"],
    });
  }, []);

  useEffect(() => {
    if (userChainId && supportedChains.includes(userChainId)) {
      setIsChainValid(true);
    } else {
      setIsChainValid(false);
    }
  }, [userChainId]);

  return (
    <Card className="relative z-20 flex flex-col items-center gap-8 border-none bg-amber-100 p-8 text-center">
      <h1 className="font-gluten text-5xl font-semibold">Jars</h1>
      <div className="mx-2 flex w-full gap-4 px-4">
        <select
          className="text-strong rounded-md bg-amber-200 p-2 font-bold"
          onChange={(val) =>
            changeSorting(val.target.value as SortingSelectValues)
          }
        >
          <option value="cookieAmount-desc">Largest cookie stash</option>
          <option value="cookieAmount-asc">Smallest cookie stash</option>
          <option value="periodLength-asc">Shortest claim period</option>
          <option value="periodLength-desc">Longest claim period</option>
        </select>
        <input
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          name="filter"
          placeholder="Search by anything (name, owner, ...)"
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[40rem] w-full max-w-4xl">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {isConnected && !isChainValid ? (
            "Whoops, we dont support the chain you are connected to just yet :/"
          ) : (
            <ChainJars
              filter={filter}
              sorting={sorting}
              chainId={isConnected ? userChainId : undefined}
            />
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ChainsList;
