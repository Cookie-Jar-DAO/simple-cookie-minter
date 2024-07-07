import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { getDefaultConfig } from "connectkit";
import { mainnet, sepolia, optimism, arbitrum, base } from "wagmi/chains";

import { getUrl } from "@/config/endpoint";
import { chain } from "lodash";

export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) throw new Error("Project ID is not defined");

export const wagmiConfig = createConfig(
	getDefaultConfig({
		ssr: true,
		storage: createStorage({
			storage: cookieStorage,
		}),
		chains: [mainnet, sepolia, optimism, arbitrum, base],
		transports: {
			[mainnet.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_RPC_URL}`),
			[sepolia.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC_URL}`),
			[optimism.id]: http(
				`${process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_RPC_URL}`,
			),
			[arbitrum.id]: http(
				`${process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_RPC_URL}`,
			),
			[base.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC_URL}`),
		},

		// Required API Keys
		walletConnectProjectId: projectId,

		// Required App Info
		appName: "CookieJar",

		// Optional App Info
		appDescription: "Your Web3 Slush Fund.",
		appUrl: getUrl(), // your app's url
		// appIcon: "https://family.co/logo.png",
	}),
);
