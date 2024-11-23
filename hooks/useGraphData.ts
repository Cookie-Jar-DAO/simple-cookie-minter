import { chainMetadata, endpoints } from "@/config/endpoint";
import { CookieJar } from "@/lib/indexer/db";
import { useQueries } from "@tanstack/react-query";

export interface SortSettings {
  orderBy: "cookieAmount" | "periodLength";
  orderDirection: "asc" | "desc";
}

const fetchJarsOnGraph = async (
  chainId: number,
  sorting: SortSettings,
): Promise<CookieJar[]> => {
  const url = endpoints[chainId];
  try {
    const res = await fetch(url, {
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
    });
    if (!res.ok) {
      throw new Error("Network response was not ok.");
    }
    const jsonResponse = await res.json();
    // Check if the expected data structure is present
    if (jsonResponse.errors && jsonResponse.errors.length > 0) {
      throw new Error(jsonResponse.errors[0].message);
    }
    if (
      !jsonResponse ||
      !jsonResponse.data ||
      !Array.isArray(jsonResponse.data.cookieJars)
    ) {
      throw new Error("Invalid response structure");
    }
    return jsonResponse.data.cookieJars.map((cookieJar: CookieJar) => ({
      ...cookieJar,
      chainId,
      chainName: chainMetadata[chainId].name,
    }));
  } catch (error) {
    throw new Error(error as unknown as string);
  }
};

export interface UseGraphDataProps {
  chainId?: number;
  sorting: SortSettings;
}

export const useGraphData = ({ chainId, sorting }: UseGraphDataProps) => {
  const endpointsToQuery = Object.keys(endpoints)
    .filter((e) => (chainId ? Number(e) === chainId : true))
    .map((chainId) => Number(chainId));
  const { data, isFetching, error } = useQueries({
    queries: endpointsToQuery.map((chainId) => ({
      queryKey: [
        "graph-data",
        chainId,
        sorting.orderBy,
        sorting.orderDirection,
      ],
      queryFn: () => fetchJarsOnGraph(chainId, sorting),
    })),
    combine: (results) => ({
      data: results
        .filter((r) => r.data != null)
        .map((r) => r.data)
        .flat(),
      isFetching: results.map((r) => r.isFetching).filter((r) => r).length > 0,
      error: results
        .map((r) => r.error)
        .filter((r) => r != null)
        .flat(),
    }),
  });
  return { data, isFetching, error };
};
