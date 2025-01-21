import { sepolia, optimism, gnosis, base, arbitrum } from "wagmi/chains";

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

const baseGraphUrl = "https://api.studio.thegraph.com/query/92478";
export const endpoints = {
  [arbitrum.id]: `${baseGraphUrl}/cg-arbitrum/version/latest`,
  [base.id]: `${baseGraphUrl}/cg-base/version/latest`,
  [gnosis.id]: `${baseGraphUrl}/cg-gnosis/version/latest`,
  [optimism.id]: `${baseGraphUrl}/cg-optimism/version/latest`,
  [sepolia.id]: `${baseGraphUrl}/cg-sepolia/version/latest`,
} as Record<number, string>;

export const getApiEndpoint = (chainId: number = sepolia.id) =>
  endpoints[chainId];

interface ChainMetadata {
  logo: string;
  name: string;
}
export const chainMetadata: Record<number, ChainMetadata> = {
  [sepolia.id]: { logo: "/sepolia.webp", name: sepolia.name },
  [base.id]: { logo: "/base.webp", name: base.name },
  [gnosis.id]: { logo: "/gnosis.webp", name: gnosis.name },
  [arbitrum.id]: { logo: "/arbitrum.webp", name: arbitrum.name },
  [optimism.id]: { logo: "/optimism.webp", name: optimism.name },
};

export const supportedChains = Object.keys(endpoints).map((id) => Number(id));
