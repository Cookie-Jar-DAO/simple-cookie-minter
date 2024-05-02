import Image from "next/image";

import { Claim, CookieJar } from "@/lib/indexer/db";

import { ClaimsList } from "@/components/claims-list";
import ClaimButton from "@/components/claim-button";

type JarData = { cookieJar: CookieJar; claims: Claim[] };

const fetchJarData = async (jarId: string): Promise<JarData | undefined> => {
  console.log("jarId", jarId, typeof jarId);
  try {
    const res = await fetch(
      "https://api.thegraph.com/subgraphs/name/psparacino/cookie-jar-testing",
      {
        cache: "no-store",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query GetClaimsByJar($jarId: String!) {
              cookieJar(id: $jarId) {
                id
                name
                owner
                periodLength
                type
                description
                cookieToken
                cookieAmount
              }
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
      !jsonResponse.data.cookieJar ||
      !Array.isArray(jsonResponse.data.claims)
    ) {
      throw new Error("Invalid response structure");
    }
    return {
      cookieJar: jsonResponse.data.cookieJar,
      claims: jsonResponse.data.claims,
    };
  } catch (error) {
    // TODO: handle errors more gracefully
    console.log("error fetching jars", error);
    return undefined;
  }
};

export default async function JarPage({
  params,
}: {
  params: { jarId: string };
}) {
  const jarData = await fetchJarData(params.jarId);
  if (
    jarData === undefined ||
    jarData === null ||
    jarData.claims === undefined
  ) {
    return <div>Failed to fetch Jar Data</div>;
  }
  const { cookieJar, claims } = jarData;

  return (
    <section className="container my-8 flex max-w-3xl flex-col items-center gap-8 rounded-xl bg-amber-100 bg-opacity-90 p-8">
      <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
        <div className="aspect-h-3 aspect-w-2 overflow-hidden rounded-lg bg-gray-100 sm:col-span-4 lg:col-span-5">
          <Image
            src={`/cookie-jar.png`}
            alt="Cookie Jar Image"
            height={600}
            width={400}
            className="object-cover object-center"
          />
        </div>
        <div className="flex h-full flex-col justify-between sm:col-span-8 lg:col-span-7">
          <section aria-labelledby="jar-information" className="mt-2">
            <h1 className="text-3xl font-bold text-gray-900 sm:pr-12">
              {cookieJar.name}
            </h1>
            <div className="">
              <h3 id="information-heading" className="sr-only">
                Jar information
              </h3>
              <p className="text-xl text-gray-900">
                Claim period: {cookieJar.periodLength}
              </p>
              <div className="mt-6">
                <h4 className="sr-only">Description</h4>
                <p className="text-sm text-gray-700">{cookieJar.description}</p>
              </div>
            </div>
          </section>
          <ClaimButton contractAddress={cookieJar.id} />
        </div>
      </div>
      <ClaimsList claims={claims} />
    </section>
  );
}
