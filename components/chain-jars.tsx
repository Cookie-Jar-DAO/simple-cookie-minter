"use client";

import { SortSettings } from "@/hooks/useGraphData";
import useJarsTable from "@/hooks/useJarsTable";
import type { CookieJar } from "@/lib/indexer/db";
import { JarCard } from "./jar-card";
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
      {cookieJars &&
        cookieJars
          .getFilteredRowModel()
          .rows.map((jar) => (
            <JarCard key={jar.id} cookieJar={jar.original as CookieJar} />
          ))}
      {!isFetching && cookieJars.getFilteredRowModel().rows.length === 0 && (
        <p>No results, have a cookie anyway 🍪</p>
      )}
    </div>
  );
};

export default ChainJars;
