"use client";

import { ChainAndGraph, SortSettings } from "@/app/jars/page";
import { JarCard } from "./jar-card";
import CreateJarFormERC20 from "./CreateJarFormERC20";
import { useCallback, useEffect, useState } from "react";
import { CookieJar } from "@/lib/indexer/db";
import { LoaderIcon } from "lucide-react";

const fetchJarsOnGraph = async (
  url: string,
  sorting: SortSettings,
): Promise<CookieJar[] | undefined> => {
  try {
    const res = await fetch(
      // TODO: update to be dynamic, use something like gql.tada for types https://gql-tada.0no.co/
      url,
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
          {
            cookieJars(orderBy: ${sorting.orderBy}, orderDirection: ${sorting.orderDirection}) {
              type
              periodLength
              owner
              name
              link
              id
              description
              cookieToken
              cookieAmount
            }
          }
          `,
        }),
      },
    );
    if (!res.ok) {
      throw new Error("Network response was not ok.");
    }

    const jsonResponse = await res.json();

    // Check if the expected data structure is present
    if (
      !jsonResponse ||
      !jsonResponse.data ||
      !Array.isArray(jsonResponse.data.cookieJars)
    ) {
      throw new Error("Invalid response structure");
    }
    return jsonResponse.data.cookieJars;
  } catch (error) {
    // TODO: handle errors more gracefully
    return undefined;
  }
};

interface ChainJarsProps {
  chainAndGraph: ChainAndGraph;
  sorting: SortSettings;
}

const ChainJars = ({ chainAndGraph, sorting }: ChainJarsProps) => {
  const [cookieJars, setCookieJars] = useState<CookieJar[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchJars = useCallback(
    async (chainUrl: string) => {
      const jars = await fetchJarsOnGraph(chainUrl, sorting);
      if (jars) {
        setCookieJars(jars);
      }
      setLoading(false);
    },
    [sorting],
  );

  useEffect(() => {
    if (chainAndGraph != null) {
      setLoading(true);
      fetchJars(chainAndGraph.url);
    }
  }, [chainAndGraph, fetchJars]);

  if (cookieJars === undefined || cookieJars === null) {
    return (
      <div>
        <h1>Looks like there are no jars</h1>
      </div>
    );
  }
  return loading ? (
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
