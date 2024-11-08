"use client";

import { JarCard } from "./jar-card";
import { SortSettings } from "@/hooks/useGraphData";
import useJarsTable from "@/hooks/useJarsTable";
import { Loader2Icon } from "lucide-react";

interface ChainJarsProps {
  chainId?: number;
  sorting: SortSettings;
  filter: string;
}

const ChainJars = ({ chainId, sorting, filter }: ChainJarsProps) => {
  const { table: cookieJars, isFetching } = useJarsTable({
    chainId,
    sorting,
    filter,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      {isFetching && (
        <div className="flex justify-center">
          <span className="animate-spin text-4xl">🍪</span>
          <span className="animate-spin text-4xl">🍪</span>
          <span className="animate-spin text-4xl">🍪</span>
        </div>
      )}
      {cookieJars.getFilteredRowModel().rows.map((jar) => (
        <JarCard key={jar.id} cookieJar={jar.original} />
      ))}
      {!isFetching && cookieJars.getFilteredRowModel().rows.length === 0 && (
        <p>No results, have a cookie anyway 🍪</p>
      )}
    </div>
  );
};

export default ChainJars;
