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

export interface ChainAndGraph {
  url: string;
  chain: string;
}

const chainGraphs: ChainAndGraph[] = [
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-base/version/latest",
    chain: "base",
  },
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-gnosis/version/latest",
    chain: "gnosis",
  },
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-arbitrum/version/latest",
    chain: "arbitrum",
  },
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-optimism/version/latest",
    chain: "optimism",
  },
  {
    url: "https://api.studio.thegraph.com/query/92478/cg-sepolia/version/latest",
    chain: "sepolia",
  },
];

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
        <Card className="relative z-20 flex flex-col items-center gap-8 border-none bg-amber-100 p-8 text-center">
          <h1 className="font-gluten text-5xl font-semibold">Jars</h1>
          <ScrollArea className="h-[40rem] w-full max-w-4xl">
            <div className="flex flex-col gap-2 p-4 pt-0">
              {chainGraphs.map((chainAndGraph) => (
                <ChainJars
                  key={chainAndGraph.chain}
                  chainAndGraph={chainAndGraph}
                />
              ))}
              {/* <DataTable columns={columns} data={data} /> */}
            </div>
          </ScrollArea>
        </Card>
      </section>
    </div>
  );
}
