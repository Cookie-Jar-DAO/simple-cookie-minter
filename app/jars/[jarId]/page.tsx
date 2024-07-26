import Image from "next/image";

import cookieBackground from "@/assets/cookie-background.webp";

import type { Claim, CookieJar } from "@/lib/indexer/db";

import { ClaimsList } from "@/components/claims-list";
import { ClaimDialog } from "@/components/claim-dialog";
import { Card } from "@/components/ui/card";
import { truncateEthereumAddress } from "@/lib/utils";
import AdminButton from "@/components/admin-button";
import { Button } from "@/components/ui/button";
import { CookieJarBalance } from "@/components/cookie-jar-balance";
import { cookJarMockData } from "../mock-data";

type JarData = { cookieJar: CookieJar; claims: Claim[] };

const fetchJarData = async (jarId: string): Promise<JarData | undefined> => {
	console.log("jarId", jarId, typeof jarId);
	try {
		const res = await fetch(
			"https://api.studio.thegraph.com/query/28985/cookie-jar-testing/sepolia-2-0x4c9",
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
								target
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
		<div className="max-w-3x container my-8">
			<div className="relative flex w-full flex-col items-center gap-8 overflow-hidden rounded-3xl p-20">
				<div className="absolute inset-0 bg-amber-900 opacity-30" />
				{/* <section className="container relative my-8 flex w-full max-w-3xl flex-col items-center gap-8 rounded-xl bg-amber-100 bg-opacity-30 p-8"> */}
				<Image
					src={cookieBackground}
					alt="Background of cookie jars and cookies"
					className="-z-10 bg-center object-cover blur-sm"
					fill
				/>
				<section className="relative z-20 w-full max-w-3xl">
					<Card className="flex flex-col gap-6 border-none bg-amber-100 p-12">
						<Card className="flex items-center justify-between border-none bg-amber-50 p-6">
							<div className="flex flex-col gap-4">
								<div className="flex flex-col">
									<h1 className="font-gluten text-4xl font-bold">
										{cookieJar.name}
									</h1>
									<p className="text-amber-800">{cookieJar.description}</p>
								</div>
								<div className="flex flex-col">
									<CookieJarBalance jarAddress={cookieJar.id} />
									<p>Claim period: {cookieJar.periodLength}</p>
									<p>Owned by: {truncateEthereumAddress(cookieJar.owner)}</p>
								</div>
								<div className="flex">
									<ClaimDialog contractAddress={cookieJar.id} />
									<AdminButton owner={cookieJar.owner} />
								</div>
							</div>
							<div className="flex flex-col items-center">
								<Image
									className="aspect-square"
									src={"/cookie-jar.png"}
									alt="Cookie Jar"
									height={176}
									width={176}
									priority
								/>
								<Button variant="outline">Feed me!</Button>
							</div>
						</Card>
						<ClaimsList claims={claims} />
					</Card>
				</section>
			</div>
		</div>
	);
}
