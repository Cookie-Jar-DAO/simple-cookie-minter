const production = "https://cookiejar.wtf";
const development = "https://cookiejar-dev.wtf";
const localhost = "http://localhost:3000";

export const getUrl = () => {
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "production") {
		return production;
	}
	if (process.env.NEXT_PUBLIC_DEPLOY_ENV === "development") {
		return development;
	}
	return localhost;
};

export const getApiEndpoint = (chainId: number) => {
	const endpoints = {
		11155111:
			"https://api.studio.thegraph.com/query/28985/cookie-jar-testing/sepolia-0x4c941cafac0b6d67a6c4ee5399927aa889aab780",
		10: "https://api.studio.thegraph.com/query/28985/cookie-jar-production/optimism-0x4c941cafac0b6d67a6c4ee5399927aa889aab780",
		// ! TODO: EVERYTHING BELOW IS NOT ACCURATE AND NEEDS TO BE UPDATED WHEN THE GRAPH IS DEPLOYED TO THE FOLLOWING CHAINS
		8453: "https://api.studio.thegraph.com/proxy/28985/cookie-jar-testing/0d72cbaa2c26d234c82e6b150cc7ffbce69bdeca",
		42161:
			"https://api.studio.thegraph.com/proxy/28985/cookie-jar-testing/0d72cbaa2c26d234c82e6b150cc7ffbce69bdeca",
		100: "https://api.studio.thegraph.com/proxy/28985/cookie-jar-testing/0d72cbaa2c26d234c82e6b150cc7ffbce69bdeca",
	} as Record<number, string>;
	return (
		endpoints[chainId] ||
		"https://api.studio.thegraph.com/proxy/28985/cookie-jar-testing/0d72cbaa2c26d234c82e6b150cc7ffbce69bdeca"
	);
};
