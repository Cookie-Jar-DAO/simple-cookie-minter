import { useJars } from "../hooks/useJars";
import { JarCard } from "@/components/JarCard";
import CreateJarFormERC20 from "../../components/CreateJarFormERC20";
import { CookieJar } from "@/lib/indexer/db";
import { ScrollArea } from "@/components/ui/scroll-area";

const fetchJars = async (): Promise<CookieJar[] | undefined> => {
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
    console.log("error fetching jars", error);
    return undefined;
  }
};

export default async function JarsPage() {
  const cookieJars = await fetchJars();
  console.log("cookieJars", cookieJars);

  if (cookieJars === undefined || cookieJars === null) {
    return <CreateJarFormERC20 />;
  }

  return (
    <section className="container flex flex-col items-center gap-8 my-8 max-w-3xl bg-amber-100 bg-opacity-90 rounded-xl p-8">
      <h1 className="text-5xl font-semibold">Jars</h1>
      <ScrollArea className="w-full max-w-4xl">
        <div className="flex flex-col gap-2 p-4 pt-0">
          {cookieJars.length > 0 ? (
            cookieJars.map((jar) => <JarCard key={jar.id} cookieJar={jar} />)
          ) : (
            <CreateJarFormERC20 />
          )}
        </div>
      </ScrollArea>
    </section>
  );
}
