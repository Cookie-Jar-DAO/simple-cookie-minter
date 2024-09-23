"use client";

import { wagmiAdapter, projectId } from "@/config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createAppKit } from "@reown/appkit/react";
import {
  mainnet,
  sepolia,
  optimism,
  arbitrum,
  base,
  gnosis,
} from "@reown/appkit/networks";
import React, { type ReactNode } from "react";
import { cookieToInitialState, WagmiProvider, type Config } from "wagmi";

// Set up queryClient
const queryClient = new QueryClient();

if (!projectId) {
  throw new Error("Project ID is not defined");
}

// Set up metadata
const metadata = {
  name: "CookieJar",
  description: "A Web3 Slush Fund for trusted groups",
  url: "https://cookiejar.wtf", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [mainnet, arbitrum, base, optimism, gnosis, sepolia],
  defaultNetwork: mainnet,
  metadata: metadata,
  features: {
    analytics: false, // Optional - defaults to your Cloud configuration
  },
});

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies: string | null;
}) {
  const initialState = cookieToInitialState(
    wagmiAdapter.wagmiConfig as Config,
    cookies,
  );

  return (
    <WagmiProvider
      config={wagmiAdapter.wagmiConfig as Config}
      initialState={initialState}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;

// "use client";

// import React, { type ReactNode } from "react";

// import { wagmiConfig, projectId } from "@/config/wagmi";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import { type State, WagmiProvider } from "wagmi";
// import { ConnectKitProvider } from "connectkit";
// import { config } from "@/config";

// // Setup queryClient
// const queryClient = new QueryClient();

// if (!projectId) throw new Error("Project ID is not defined");

// export default function Web3ModalProvider({
// 	children,
// }: {
// 	children: ReactNode;
// }) {
// 	return (
// 		<WagmiProvider config={wagmiConfig}>
// 			<QueryClientProvider client={queryClient}>
// 				<ConnectKitProvider theme="retro">{children}</ConnectKitProvider>
// 			</QueryClientProvider>
// 		</WagmiProvider>
// 	);
// }
