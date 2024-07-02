"use client";

import { WagmiProvider, type State } from "wagmi";
import { ConnectKitProvider } from "connectkit";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// TODO: Update CustomTheme
import CustomTheme from "./theme.json";
import { wagmiConfig } from "@/config/wagmi";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<ConnectKitProvider theme="retro">
					{children}
					<ReactQueryDevtools initialIsOpen={false} />
				</ConnectKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
