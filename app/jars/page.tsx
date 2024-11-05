"use client";

import Image from "next/image";

import { JarCard } from "@/components/jar-card";
import CreateJarFormERC20 from "../../components/CreateJarFormERC20";
import type { CookieJar } from "@/lib/indexer/db";
import { ScrollArea } from "@/components/ui/scroll-area";

import cookieBackground from "@/assets/cookie-background.webp";

import { JarsQuery } from "@/lib/jars-query.graphql";
import { Card } from "@/components/ui/card";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { cookJarMockData, data } from "./mock-data";
import ChainJars from "@/components/chain-jars";
import { useCallback, useState } from "react";

type Chain = "Sepolia" | "Base" | "Gnosis" | "Arbitrum" | "Optimism";

export interface ChainAndGraph {
  url: string;
  name: Chain;
}

export interface SortSettings {
  orderBy: "cookieAmount" | "periodLength";
  orderDirection: "asc" | "desc";
}

const chainGraphs: ChainAndGraph[] = [
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-sepolia/version/latest",
    name: "Sepolia",
  },
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-base/version/latest",
    name: "Base",
  },
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-gnosis/version/latest",
    name: "Gnosis",
  },
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-arbitrum/version/latest",
    name: "Arbitrum",
  },
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-optimism/version/latest",
    name: "Optimism",
  },
];

const chainToImageMap: Record<Chain, string> = {
  Sepolia: "/sepolia.webp",
  Base: "/base.webp",
  Gnosis: "/gnosis.webp",
  Arbitrum: "/arbitrum.webp",
  Optimism: "/optimism.webp",
};

type SortingSelectValues =
  | "cookieAmount-desc"
  | "cookieAmount-asc"
  | "periodLength-asc"
  | "periodLength-desc";

export default function JarsPage() {
  const [selectedChain, setSelectedChain] = useState<Chain>("Sepolia");
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
    <div className="max-w-3x container my-8">
      <section className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl p-20">
        <div className="absolute inset-0 bg-amber-900 opacity-30" />
        {/* <section className="container relative my-8 flex w-full max-w-3xl flex-col items-center gap-8 rounded-xl bg-amber-100 bg-opacity-30 p-8"> */}
        <Image
          src={cookieBackground}
          alt="Background of cookie jars and cookies"
          className="-z-10 bg-center object-cover blur-sm"
          fill
        />
        <div className="flex-warp relative relative z-20 flex cursor-pointer flex-row items-center gap-8 border-none bg-transparent bg-none">
          {chainGraphs.map(({ name }) => (
            <Card
              className={`border-none ${name === selectedChain ? "bg-amber-300" : "bg-amber-100 hover:bg-amber-200 active:bg-amber-300"} p-3 text-center`}
              key={name}
              onClick={() => {
                setSelectedChain(name);
              }}
            >
              <Image
                src={chainToImageMap[name]}
                title={name}
                alt="Chain logo"
                width={40}
                height={40}
                className="mr-2 inline-block"
              />
              {name}
            </Card>
          ))}
        </div>
        {chainGraphs
          .filter(({ name }) => name == selectedChain)
          .map((chainAndGraph) => (
            <Card
              key={chainAndGraph.name}
              className="relative z-20 flex flex-col items-center gap-8 border-none bg-amber-100 p-8 text-center"
            >
              <h1 className="font-gluten text-5xl font-semibold">
                <Image
                  src={chainToImageMap[chainAndGraph.name]}
                  title={chainAndGraph.name}
                  alt="Chain logo"
                  width={80}
                  height={80}
                  className="mr-5 inline-block"
                />
                {chainAndGraph.name} Jars
              </h1>
              <div className="mv-2">
                Order by{" "}
                <select
                  className="text-strong bg-amber-200 p-2 font-bold"
                  onChange={(val) =>
                    changeSorting(val.target.value as SortingSelectValues)
                  }
                >
                  <option value="cookieAmount-desc">
                    Largest cookie stash
                  </option>
                  <option value="cookieAmount-asc">
                    Smallest cookie stash
                  </option>
                  <option value="periodLength-asc">
                    Shortest claim period
                  </option>
                  <option value="periodLength-desc">
                    Longest claim period
                  </option>
                </select>
              </div>
              <ScrollArea className="h-[40rem] w-full max-w-4xl">
                <div className="flex flex-col gap-2 p-4 pt-0">
                  <ChainJars chainAndGraph={chainAndGraph} sorting={sorting} />
                  {/* <DataTable columns={columns} data={data} /> */}
                </div>
              </ScrollArea>
            </Card>
          ))}
      </section>
    </div>
  );
}
