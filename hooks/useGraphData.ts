import { chainMetadata, endpoints } from "@/config/endpoint";
import { CookieJar } from "@/lib/indexer/db";
import { useQuery } from "@tanstack/react-query";

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

const fetchMultipleJars = async ({
  chainId,
  sorting,
}: UseGraphDataProps): Promise<CookieJar[]> => {
  const queries = Object.keys(endpoints)
    .filter((e) => (chainId ? Number(e) === chainId : true))
    .map((e) => fetchJarsOnGraph(Number(e), sorting));

  const dataFromGraphs = await Promise.allSettled(queries);

  const validJars = dataFromGraphs.reduce((acc, result) => {
    if (result.status === "fulfilled" && Array.isArray(result.value)) {
      return [...acc, ...result.value];
    }
    return acc;
  }, [] as CookieJar[]);

  return validJars;
};

export interface UseGraphDataProps {
  chainId?: number;
  sorting: SortSettings;
}

export const useGraphData = ({ chainId, sorting }: UseGraphDataProps) => {
  const key = `graph-data-${chainId || "all"}-${sorting.orderBy}-${sorting.orderDirection}`;
  const { data, error, ...rest } = useQuery({
    queryKey: [key],
    queryFn: () => fetchMultipleJars({ chainId, sorting }),
    enabled: !!sorting,
  });
  return { data, error, ...rest };
};
