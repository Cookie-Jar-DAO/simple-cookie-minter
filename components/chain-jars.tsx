"use client";

import { JarCard } from "./jar-card";
import CreateJarFormERC20 from "./CreateJarFormERC20";
import { LoaderIcon } from "lucide-react";
import { SortSettings, useGraphData } from "@/hooks/useGraphData";

interface ChainJarsProps {
  chainId: number;
  sorting: SortSettings;
}

const ChainJars = ({ chainId, sorting }: ChainJarsProps) => {
  const {
    data: cookieJars,
    isFetching,
    error,
  } = useGraphData({ chainId, sorting });
  return error ? (
    <p>{error.toString()}</p>
  ) : isFetching || cookieJars == null ? (
    <div className="flex min-w-[768px] justify-center p-10">
      <LoaderIcon className="h-[80px] w-[80px] animate-spin" />
    </div>
  ) : cookieJars.length > 0 ? (
    cookieJars.map((jar) => <JarCard key={jar.id} cookieJar={jar} />)
  ) : (
    <div>
      <h2 className="text-2xl font-semibold leading-tight">
        No jars just yet ...
        <br />
        Let&apos;s create the first one 👇
      </h2>
      <CreateJarFormERC20 />
    </div>
  );
};

export default ChainJars;
