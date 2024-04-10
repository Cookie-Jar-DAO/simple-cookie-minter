"use client";

import { WagmiConfig, createConfig } from "wagmi";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { assertExists } from "../lib";
import { sepolia } from "wagmi/chains";
import { useIndexer } from "./hooks/useIndexer";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const chains = [sepolia];

// See: https://docs.family.co/connectkit/getting-started#getting-started-section-3-implementation
const wagmiConfig = createConfig(
  getDefaultConfig({
    // Required API Keys
    alchemyId: assertExists(
      process.env.NEXT_PUBLIC_ALCHEMY_ID,
      "Alchemy ID not found"
    ), // or infuraId
    walletConnectProjectId: assertExists(
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
      "WalletConnect project ID not found"
    ),

    // Required
    appName: "Cookie Jar",

    // Optional
    appDescription:
      "Cookie Jar app powered by Next.js, Tailwind, Wagmi and Viem",
    appUrl: "https://example.com", // your app's url
    appIcon: "/public/hc_logo_400_400.png", // your app's icon, no bigger than 1024x1024px (max. 1MB)
    chains,
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  const { indexer } = useIndexer();

  return (
    <WagmiConfig config={wagmiConfig}>
      <ConnectKitProvider>
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ConnectKitProvider>
    </WagmiConfig>
  );
}
