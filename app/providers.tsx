"use client";

import { WagmiProvider, type State } from "wagmi";
import { ConnectKitProvider } from "connectkit";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// TODO: Update CustomTheme
import CustomTheme from "./theme.json";
import { projectId, wagmiConfig } from "@/config/wagmi";

const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

export function Providers({
	children,
	initialState,
}: { children: React.ReactNode; initialState?: State }) {
	return (
		<WagmiProvider config={wagmiConfig} initialState={initialState}>
			<QueryClientProvider client={queryClient}>
				<ConnectKitProvider theme="retro">
					{children}
					<ReactQueryDevtools initialIsOpen={false} />
				</ConnectKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
