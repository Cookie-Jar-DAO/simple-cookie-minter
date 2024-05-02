"use client";

import {
  WagmiConfig,
  createConfig,
  WagmiProvider,
  http,
  fallback,
} from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { assertExists } from "../lib";
import { sepolia } from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import CustomTheme from "./theme.json";

// See: https://docs.family.co/connectkit/getting-started#getting-started-section-3-implementation
export const wagmiConfig = createConfig({
  chains: [sepolia],
  ssr: true,
  transports: {
    [sepolia.id]: http(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
    ),
    fallback: fallback([http(`https://sepolia.infura.io/v3/`)]),
  },
  // Required API Keys
  // alchemyId: assertExists(
  //   process.env.NEXT_PUBLIC_ALCHEMY_ID,
  //   "Alchemy ID not found",
  // ), // or infuraId
  // walletConnectProjectId: assertExists(
  //   process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
  //   "WalletConnect project ID not found",
  // ),

  // Required
  // appName: "Cookie Jar",

  // Optional
  // appDescription:
  //   "Cookie Jar app powered by Next.js, Tailwind, Wagmi and Viem",
  // appUrl: "https://example.com", // your app's url
  // appIcon: "/public/hc_logo_400_400.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider customTheme={CustomTheme}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
