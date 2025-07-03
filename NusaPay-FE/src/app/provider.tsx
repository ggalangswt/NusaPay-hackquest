"use client"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import React from "react";

import '@rainbow-me/rainbowkit/styles.css';
import { config } from "@/config/config";

const queryClient = new QueryClient({});

export default function Provider({children}: {children: React.ReactNode}) {
    return (
        <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
    )
}