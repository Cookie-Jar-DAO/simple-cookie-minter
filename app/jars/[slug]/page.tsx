import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Claim } from "@/lib/indexer/db";

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
                  }
                }
            `,
          variables: {
            jarId: jarId,
          },
        }),
      }
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
                  <CardTitle>{claim.id}</CardTitle>
                  <CardDescription>{claim.receiver}</CardDescription>
                </CardHeader>
                <CardContent>
                  {claim.amount}
                  {claim.timestamp}
                  {claim.uuid}
                  {claim.claimer}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </section>
  );
}
