import { cookieStorage, createStorage, http, fallback } from "@wagmi/core";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
  mainnet,
  arbitrum,
  sepolia,
  optimism,
  base,
  gnosis,
} from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) {
  throw new Error("Project ID is not defined");
}

export const networks = [mainnet, arbitrum, optimism, base, gnosis, sepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: fallback([
      http(),
      http(`${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_RPC_URL}`),
    ]),
    [sepolia.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_SEPOLIA_RPC_URL}`),
    [optimism.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_RPC_URL}`),
    [arbitrum.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_RPC_URL}`),
    [base.id]: http(`${process.env.NEXT_PUBLIC_ALCHEMY_BASE_RPC_URL}`),
    [gnosis.id]: http(),
  },
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
