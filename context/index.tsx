"use client";

import { createAppKit } from "@reown/appkit/react";
import { baseSepolia } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { WagmiProvider } from "wagmi";

import { wagmiAdapter, projectId } from "@/config";

const queryClient = new QueryClient();

const metadata = {
  name: "Ivolve",
  description: "Your on-chain identity, reputation, and opportunity layer.",
  url: "http://localhost:3000",
  icons: [],
};

createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: [baseSepolia],
  defaultNetwork: baseSepolia,
  metadata,
  features: {
    analytics: true,
  },
});

export default function ContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}