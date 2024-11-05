"use client";

import { ChainAndGraph } from "@/app/jars/page";
import { JarCard } from "./jar-card";
import CreateJarFormERC20 from "./CreateJarFormERC20";
import { useCallback, useEffect, useState } from "react";
import { CookieJar } from "@/lib/indexer/db";

const fetchJarsOnGraph = async (
  url: string,
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
            cookieJars {
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
}

const ChainJars = ({ chainAndGraph }: ChainJarsProps) => {
  const [cookieJars, setCookieJars] = useState<CookieJar[]>([]);

  const fetchJars = useCallback(async (chainUrl: string) => {
    const jars = await fetchJarsOnGraph(chainUrl);
    if (jars) {
      setCookieJars(jars);
    }
  }, []);

  useEffect(() => {
    if (chainAndGraph != null) {
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
  return cookieJars.length > 0 ? (
    cookieJars.map((jar) => <JarCard key={jar.id} cookieJar={jar} />)
  ) : (
    <CreateJarFormERC20 />
  );
};

export default ChainJars;
