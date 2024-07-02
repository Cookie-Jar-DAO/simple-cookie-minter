import type { Abi } from "viem";
import deployments from "@/app/deployments.json";

export type SupportedChainIds = keyof typeof deployments | "development";

export type SupportedImplementations =
	| "BaalCookieJar6551"
	| "ERC20CookieJar6551"
	| "ERC721CookieJar6551"
	| "ListCookieJar6551"
	| "OpenCookieJar6551";

type Contracts = {
	contractName: string;
	contractAddress: string;
	transactionHash: string;
	abi: Abi;
}[];

export type Deployments = Record<SupportedChainIds, Contracts>;

export const SEPOLIA = deployments["11155111"] as Contracts;
export const OPTIMISM = deployments["10"] as Contracts;
export const BASE = deployments["8453"] as Contracts;
export const ARBITRUM = deployments["42161"] as Contracts;
export const GNOSIS = deployments["100"] as Contracts;

export const DEPLOYMENTS: Deployments = {
	11155111: SEPOLIA,
	development: SEPOLIA,
	10: OPTIMISM,
	8453: BASE,
	42161: ARBITRUM,
	100: GNOSIS,
};

export const DEFAULT_TARGET = SEPOLIA;
