import { endpoints } from "@/config/endpoint";
import { CookieJar } from "@/lib/indexer/db";
import { useQuery } from "@tanstack/react-query";

export interface SortSettings {
  orderBy: "cookieAmount" | "periodLength";
  orderDirection: "asc" | "desc";
}

const fetchJarsOnGraph = async (
  chainId: number,
  sorting: SortSettings,
): Promise<CookieJar[] | undefined> => {
  const url = endpoints[chainId];
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

interface UseGraphDataProps {
  chainId: number;
  sorting: SortSettings;
}

export const useGraphData = ({ chainId, sorting }: UseGraphDataProps) => {
  const { data, error, ...rest } = useQuery({
    queryKey: [
      `graph-data-${chainId}-${sorting.orderBy}-${sorting.orderDirection}`,
    ],
    queryFn: () => fetchJarsOnGraph(chainId, sorting),
    enabled: !!chainId,
  });
  return { data, error, ...rest };
};
