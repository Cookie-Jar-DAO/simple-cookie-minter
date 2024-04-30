import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Claim } from "@/lib/indexer/db";
import { truncateEthereumAddress } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

const fetchClaims = async (jarId: string): Promise<Claim[] | undefined> => {
  console.log("jarId", jarId, typeof jarId);
  try {
    const res = await fetch(
      "https://api.thegraph.com/subgraphs/name/psparacino/cookie-jar-testing",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetClaimsByJar($jarId: String!) {
                claims(where: {jar: $jarId}) {
                    id
                    uuid
                    claimer
                    receiver
                    amount
                    timestamp
                    reason {
                      id
                      link
                      reason
                      tag
                    }
                  }
                }
            `,
          variables: {
            jarId: jarId,
          },
        }),
      },
    );
    if (!res.ok) {
      throw new Error("Network response was not ok.");
    }

    const jsonResponse = await res.json();
    console.log("data", jsonResponse.data);
    // Check if the expected data structure is present
    if (
      !jsonResponse ||
      !jsonResponse.data ||
      !Array.isArray(jsonResponse.data.claims)
    ) {
      throw new Error("Invalid response structure");
    }
    return jsonResponse.data.claims;
  } catch (error) {
    // TODO: handle errors more gracefully
    console.log("error fetching jars", error);
    return undefined;
  }
};

export default async function JarPage({
  params,
}: {
  params: { slug: string };
}) {
  const claims = await fetchClaims(params.slug);
  console.log("claims", claims);
  if (claims === undefined || claims === null) {
    return <div>Failed to fetch claims</div>;
  }

  return (
    <section className="container flex flex-col items-center gap-8 my-8 max-w-3xl bg-amber-100 bg-opacity-90 rounded-xl p-8">
      <h1 className="text-5xl font-semibold">Claims</h1>
      <ScrollArea className="w-full max-w-4xl">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {claims.map((claim) => {
            return (
              <Card key={claim.id}>
                <CardHeader>
                  <CardTitle>{claim.reason.reason}</CardTitle>
                  <CardDescription>
                    {truncateEthereumAddress(claim.receiver)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    {claim.amount}
                    {claim.claimer}
                    {claim.reason.link}
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-end">{claim.reason.tag}</div>
                  <div className="flex gap-2 ml-auto">
                    <Button
                      className="hover:bg-amber-200 focus:ring-4 focus:ring-amber-300"
                      variant="ghost"
                      size="icon"
                    >
                      <ArrowDown className="h-4 w-4 " />
                    </Button>
                    <Button
                      className="hover:bg-amber-200 focus:ring-4 focus:ring-amber-300"
                      variant="ghost"
                      size="icon"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </section>
  );
}
