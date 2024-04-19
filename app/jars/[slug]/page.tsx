const fetchClaims = async (jarId: string) => {
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
    // if (
    //   !jsonResponse ||
    //   !jsonResponse.data ||
    //   !Array.isArray(jsonResponse.data)
    // ) {
    //   throw new Error("Invalid response structure");
    // }
    return jsonResponse.data;
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
  return <div>My Post: {params.slug}</div>;
}
