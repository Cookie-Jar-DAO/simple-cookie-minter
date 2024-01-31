import { Abi } from "viem";
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

export const DEPLOYMENTS: Deployments = {
  11155111: SEPOLIA,
  development: SEPOLIA,
};

export const DEFAULT_TARGET = SEPOLIA;
