"use client";

import React, { type ReactNode } from "react";

import { wagmiConfig, projectId } from "@/config/wagmi";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { type State, WagmiProvider } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { config } from "@/config";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

export default function Web3ModalProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<WagmiProvider config={wagmiConfig}>
			<QueryClientProvider client={queryClient}>
				<ConnectKitProvider theme="retro">{children}</ConnectKitProvider>
			</QueryClientProvider>
		</WagmiProvider>
	);
}
