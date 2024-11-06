"use client";
import { sepolia } from "wagmi/chains";
import { Card } from "@/components/ui/card";
import ChainJars from "@/components/chain-jars";
import { chainMetadata, supportedChains } from "@/config/endpoint";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCallback, useState } from "react";
import ChainsSelector from "./chains-selector";
import Image from "next/image";
import { SortSettings } from "@/hooks/useGraphData";

export interface ChainAndGraph {
  id: number;
  url: string;
  name: string;
}

type SortingSelectValues =
  | "cookieAmount-desc"
  | "cookieAmount-asc"
  | "periodLength-asc"
  | "periodLength-desc";

const ChainsList = () => {
  const [selectedChain, setSelectedChain] = useState<number>(sepolia.id);
  const [sorting, setSorting] = useState<SortSettings>({
    orderBy: "cookieAmount",
    orderDirection: "desc",
  });
  const changeSorting = useCallback((val: SortingSelectValues) => {
    const [order, direction] = val.split("-");
    setSorting({
      orderBy: order as SortSettings["orderBy"],
      orderDirection: direction as SortSettings["orderDirection"],
    });
  }, []);

  return (
    <section>
      <div className="mb-4">
        <ChainsSelector
          selectedId={selectedChain}
          setSelectedId={setSelectedChain}
        />
      </div>
      {supportedChains
        .filter((id) => id == selectedChain)
        .map((id) => (
          <Card
            key={id}
            className="relative z-20 flex flex-col items-center gap-8 border-none bg-amber-100 p-8 text-center"
          >
            <h1 className="font-gluten text-5xl font-semibold">
              <Image
                src={chainMetadata[id].logo}
                title={chainMetadata[id].name}
                alt="Chain logo"
                width={80}
                height={80}
                className="mr-5 inline-block"
              />
              {chainMetadata[id].name} Jars
            </h1>
            <div className="mv-2">
              Order by{" "}
              <select
                className="text-strong bg-amber-200 p-2 font-bold"
                onChange={(val) =>
                  changeSorting(val.target.value as SortingSelectValues)
                }
              >
                <option value="cookieAmount-desc">Largest cookie stash</option>
                <option value="cookieAmount-asc">Smallest cookie stash</option>
                <option value="periodLength-asc">Shortest claim period</option>
                <option value="periodLength-desc">Longest claim period</option>
              </select>
            </div>
            <ScrollArea className="h-[40rem] w-full max-w-4xl">
              <div className="flex flex-col gap-2 p-4 pt-0">
                <ChainJars chainId={id} sorting={sorting} />
              </div>
            </ScrollArea>
          </Card>
        ))}
    </section>
  );
};

export default ChainsList;
