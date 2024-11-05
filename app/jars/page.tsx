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

type Chain = "Sepolia" | "Base" | "Gnosis" | "Arbitrum" | "Optimism";

export interface ChainAndGraph {
  url: string;
  name: Chain;
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

export default async function JarsPage() {
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
        {chainGraphs.map((chainAndGraph) => (
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
            <ScrollArea className="h-[40rem] w-full max-w-4xl">
              <div className="flex flex-col gap-2 p-4 pt-0">
                <ChainJars chainAndGraph={chainAndGraph} />
                {/* <DataTable columns={columns} data={data} /> */}
              </div>
            </ScrollArea>
          </Card>
        ))}
      </section>
    </div>
  );
}
